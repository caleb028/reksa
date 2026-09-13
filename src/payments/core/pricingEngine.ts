import { db } from '@/lib/db';

export interface FeeCalculationParams {
  productType: string;         // 'LISTING' | 'LISTING_RENEWAL' | 'FEATURED_LISTING' | 'SEARCH_BOOST' | 'HOMEPAGE_SPOTLIGHT' | 'SUBSCRIPTION'
  propertyType?: string;       // 'Apartment', 'Bedsitter', 'Studio', 'Villa', 'Land', 'Commercial', etc.
  listingIntent?: string;      // 'SALE' | 'RENT' | 'LEASE'
  countyName?: string;         // 'Nairobi', 'Kiambu', etc.
  durationDays?: number;       // default 30
  activeListingCount?: number; // for volume discount calculation
  promotionCodes?: string[];   // ['FEATURED_LISTING', 'SEARCH_BOOST']
}

export interface FeeLineItem {
  name: string;
  description: string;
  amountKes: number;
}

export interface FeeCalculationResult {
  baseFeeKes: number;
  volumeDiscountPercent: number;
  volumeDiscountAmountKes: number;
  promotionsFeeKes: number;
  totalFeeKes: number;
  currency: string;
  durationDays: number;
  lineItems: FeeLineItem[];
}

export class PricingEngine {
  /**
   * Calculates dynamic server-side pricing for marketplace listings and promotions
   */
  public static async calculateFee(params: FeeCalculationParams): Promise<FeeCalculationResult> {
    const durationDays = params.durationDays || 30;
    const lineItems: FeeLineItem[] = [];

    // 1. Subscription Product Handling
    if (params.productType === 'SUBSCRIPTION') {
      const planCode = params.propertyType || 'STARTER'; // passed via propertyType for convenience
      let subPrice = 1500;
      let planName = 'Starter Agency Plan';

      if (planCode === 'PROFESSIONAL') {
        subPrice = 3500;
        planName = 'Professional Agency Plan';
      } else if (planCode === 'BUSINESS') {
        subPrice = 7500;
        planName = 'Business Agency Operating System';
      } else if (planCode === 'ENTERPRISE') {
        subPrice = 15000;
        planName = 'Enterprise Developer Plan';
      }

      lineItems.push({
        name: planName,
        description: `30-day agency operating subscription`,
        amountKes: subPrice
      });

      return {
        baseFeeKes: subPrice,
        volumeDiscountPercent: 0,
        volumeDiscountAmountKes: 0,
        promotionsFeeKes: 0,
        totalFeeKes: subPrice,
        currency: 'KES',
        durationDays: 30,
        lineItems
      };
    }

    // 2. Fetch PricingRule from database for listing base fee
    const rule = await db.pricingRule.findFirst({
      where: {
        productType: params.productType,
        isActive: true,
        OR: [
          { propertyType: params.propertyType || 'Apartment', listingIntent: params.listingIntent || 'SALE' },
          { propertyType: params.propertyType || 'Apartment' },
          { propertyType: 'ALL' }
        ]
      },
      orderBy: { baseFeeKes: 'desc' }
    });

    const baseFeeKes = rule ? rule.baseFeeKes : 250;
    lineItems.push({
      name: `${params.propertyType || 'Property'} ${params.productType === 'LISTING_RENEWAL' ? 'Renewal' : 'Publication'}`,
      description: `${durationDays}-day active listing in ${params.countyName || 'Kenya'}`,
      amountKes: baseFeeKes
    });

    // 3. Calculate Volume Discount (if agency has multiple listings)
    let volumeDiscountPercent = 0;
    let volumeDiscountAmountKes = 0;

    if (params.activeListingCount && params.activeListingCount > 0) {
      const discountTier = await db.volumeDiscount.findFirst({
        where: {
          isActive: true,
          minListings: { lte: params.activeListingCount },
          OR: [
            { maxListings: null },
            { maxListings: { gte: params.activeListingCount } }
          ]
        },
        orderBy: { minListings: 'desc' }
      });

      if (discountTier && discountTier.discountPercent > 0) {
        volumeDiscountPercent = discountTier.discountPercent;
        volumeDiscountAmountKes = Math.round((baseFeeKes * volumeDiscountPercent) / 100);
        lineItems.push({
          name: `Volume Discount (${discountTier.tierName})`,
          description: `${volumeDiscountPercent}% loyalty reduction applied`,
          amountKes: -volumeDiscountAmountKes
        });
      }
    }

    // 4. Calculate Promotional Add-ons (e.g. Featured Placement, Search Boost)
    let promotionsFeeKes = 0;
    if (params.promotionCodes && params.promotionCodes.length > 0) {
      const activePromos = await db.promotionPlan.findMany({
        where: {
          code: { in: params.promotionCodes },
          isActive: true
        }
      });

      for (const promo of activePromos) {
        promotionsFeeKes += promo.priceKes;
        lineItems.push({
          name: promo.name,
          description: `${promo.description} (${promo.durationDays} days)`,
          amountKes: promo.priceKes
        });
      }
    }

    const netTotal = Math.max(baseFeeKes - volumeDiscountAmountKes + promotionsFeeKes, 50); // Minimum KES 50

    return {
      baseFeeKes,
      volumeDiscountPercent,
      volumeDiscountAmountKes,
      promotionsFeeKes,
      totalFeeKes: netTotal,
      currency: 'KES',
      durationDays,
      lineItems
    };
  }
}
