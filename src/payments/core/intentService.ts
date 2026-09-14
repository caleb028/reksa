import { db } from '@/lib/db';
import { PricingEngine, FeeCalculationParams } from './pricingEngine';
import { PaymentError } from '../mpesa/errors';
import { maskPhoneNumber, normalizeKenyanPhone } from '../mpesa/validation';

export interface CreateIntentInput {
  userId?: string | null;
  organizationId?: string | null;
  propertyId?: string | null;
  productType: string;
  propertyType?: string;
  listingIntent?: string;
  countyName?: string;
  durationDays?: number;
  promotionCodes?: string[];
  phoneNumber?: string;
  idempotencyKey?: string;
}

export class PaymentIntentService {
  /**
   * Generates a unique, commercial public payment reference
   * e.g. AE-PAY-2026-94812
   */
  public static generatePublicReference(): string {
    const year = new Date().getFullYear();
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `AE-PAY-${year}-${rand}`;
  }

  /**
   * Creates or safely retrieves an idempotent PaymentIntent
   */
  public static async createIntent(input: CreateIntentInput) {
    // 1. Idempotency Check: if key provided, check for existing intent
    if (input.idempotencyKey) {
      const existing = await db.paymentIntent.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
        include: {
          property: { select: { id: true, title: true } },
          receipt: true
        }
      });

      if (existing) {
        // If not expired, return existing intent
        const now = new Date();
        if (!existing.expiresAt || existing.expiresAt > now) {
          return existing;
        }
      }
    }

    // 2. Count active listings for organization to calculate volume discount
    let activeListingCount = 0;
    if (input.organizationId) {
      activeListingCount = await db.property.count({
        where: {
          organizationId: input.organizationId,
          status: 'ACTIVE'
        }
      });
    }

    // 3. Server-side fee recalculation (Zero Trust for client amount)
    const calculationParams: FeeCalculationParams = {
      productType: input.productType,
      propertyType: input.propertyType,
      listingIntent: input.listingIntent,
      countyName: input.countyName,
      durationDays: input.durationDays || 30,
      activeListingCount,
      promotionCodes: input.promotionCodes
    };

    const feeResult = await PricingEngine.calculateFee(calculationParams);
    const amount = feeResult.totalFeeKes;

    // 4. Phone masking if phone supplied
    let phoneNumberRaw: string | undefined;
    let phoneNumberMasked: string | undefined;

    if (input.phoneNumber) {
      try {
        phoneNumberRaw = normalizeKenyanPhone(input.phoneNumber);
        phoneNumberMasked = maskPhoneNumber(phoneNumberRaw);
      } catch {
        // Will be validated on checkout step
      }
    }

    // 5. Build description
    let description = `${input.productType.replace(/_/g, ' ')} (${feeResult.durationDays} days)`;
    if (input.propertyId) {
      const prop = await db.property.findUnique({
        where: { id: input.propertyId },
        select: { title: true }
      });
      if (prop) description = `${prop.title} — ${description}`;
    }

    const publicReference = this.generatePublicReference();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration for unpaid intent

    // 6. Persist PaymentIntent in database
    const intent = await db.paymentIntent.create({
      data: {
        publicReference,
        userId: input.userId || null,
        organizationId: input.organizationId || null,
        propertyId: input.propertyId || null,
        productType: input.productType,
        description,
        amount,
        currency: 'KES',
        phoneNumberRaw,
        phoneNumberMasked,
        status: 'CREATED',
        provider: 'MPESA_DARAJA',
        idempotencyKey: input.idempotencyKey || null,
        expiresAt,
        metadataJson: JSON.stringify({
          ...calculationParams,
          lineItems: feeResult.lineItems,
          volumeDiscountPercent: feeResult.volumeDiscountPercent,
          baseFeeKes: feeResult.baseFeeKes
        })
      },
      include: {
        property: { select: { id: true, title: true } }
      }
    });

    return intent;
  }

  /**
   * Retrieves intent details by public reference or internal ID
   */
  public static async getIntent(identifier: string) {
    return db.paymentIntent.findFirst({
      where: {
        OR: [
          { id: identifier },
          { publicReference: identifier },
          { checkoutRequestId: identifier }
        ]
      },
      include: {
        property: { select: { id: true, title: true, price: true, town: true } },
        organization: { select: { id: true, name: true, slug: true } },
        receipt: true
      }
    });
  }

  /**
   * Updates an intent with Safaricom Daraja request IDs upon STK prompt dispatch
   */
  public static async recordStkDispatch(
    intentId: string,
    merchantRequestId: string,
    checkoutRequestId: string,
    phoneRaw: string
  ) {
    const masked = maskPhoneNumber(phoneRaw);
    return db.paymentIntent.update({
      where: { id: intentId },
      data: {
        merchantRequestId,
        checkoutRequestId,
        phoneNumberRaw: phoneRaw,
        phoneNumberMasked: masked,
        status: 'PENDING'
      }
    });
  }
}
