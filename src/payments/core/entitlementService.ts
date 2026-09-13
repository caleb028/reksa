import { Prisma, PrismaClient } from '@prisma/client';
import { db } from '@/lib/db';

export class PaymentEntitlementService {
  /**
   * Atomically fulfills product entitlement upon confirmed payment
   */
  public static async fulfillEntitlement(
    tx: Prisma.TransactionClient | PrismaClient = db,
    intent: any
  ): Promise<void> {
    const now = new Date();
    let metadata: any = {};
    try {
      if (intent.metadataJson) {
        metadata = JSON.parse(intent.metadataJson);
      }
    } catch {
      metadata = {};
    }

    const durationDays = metadata.durationDays || 30;
    const validUntil = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // 1. LISTING PUBLICATION OR RENEWAL
    if (intent.productType === 'LISTING' || intent.productType === 'LISTING_RENEWAL') {
      if (intent.propertyId) {
        // Activate listing
        await tx.property.update({
          where: { id: intent.propertyId },
          data: {
            status: 'ACTIVE'
          }
        });

        // Upsert ListingEntitlement
        const existingEntitlement = await tx.listingEntitlement.findUnique({
          where: { propertyId: intent.propertyId }
        });

        if (existingEntitlement) {
          const baseDate = existingEntitlement.validUntil > now ? existingEntitlement.validUntil : now;
          const extendedUntil = new Date(baseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

          await tx.listingEntitlement.update({
            where: { id: existingEntitlement.id },
            data: {
              status: 'ACTIVE',
              validUntil: extendedUntil,
              lastPaymentIntentId: intent.id
            }
          });
        } else {
          await tx.listingEntitlement.create({
            data: {
              propertyId: intent.propertyId,
              organizationId: intent.organizationId || null,
              status: 'ACTIVE',
              startsAt: now,
              validUntil,
              lastPaymentIntentId: intent.id
            }
          });
        }
      }
    }

    // 2. FEATURED LISTING VISIBILITY BOOST
    if (intent.productType === 'FEATURED_LISTING') {
      if (intent.propertyId) {
        await tx.property.update({
          where: { id: intent.propertyId },
          data: { isFeatured: true }
        });

        await tx.listingEntitlement.upsert({
          where: { propertyId: intent.propertyId },
          create: {
            propertyId: intent.propertyId,
            organizationId: intent.organizationId || null,
            status: 'ACTIVE',
            startsAt: now,
            validUntil,
            isFeatured: true,
            featuredUntil: validUntil,
            lastPaymentIntentId: intent.id
          },
          update: {
            isFeatured: true,
            featuredUntil: validUntil,
            lastPaymentIntentId: intent.id
          }
        });
      }
    }

    // 3. SEARCH ALGORITHM BOOST
    if (intent.productType === 'SEARCH_BOOST') {
      if (intent.propertyId) {
        await tx.listingEntitlement.upsert({
          where: { propertyId: intent.propertyId },
          create: {
            propertyId: intent.propertyId,
            organizationId: intent.organizationId || null,
            status: 'ACTIVE',
            startsAt: now,
            validUntil,
            searchBoostUntil: validUntil,
            lastPaymentIntentId: intent.id
          },
          update: {
            searchBoostUntil: validUntil,
            lastPaymentIntentId: intent.id
          }
        });
      }
    }

    // 4. BUSINESS SUBSCRIPTION PLAN
    if (intent.productType === 'SUBSCRIPTION') {
      const planCode = metadata.planCode || 'STARTER';

      if (intent.organizationId) {
        await tx.organization.update({
          where: { id: intent.organizationId },
          data: {
            subscriptionTier: planCode,
            subscriptionStatus: 'ACTIVE'
          }
        });
      }

      if (intent.userId) {
        await tx.subscription.create({
          data: {
            userId: intent.userId,
            planName: planCode,
            startDate: now,
            endDate: validUntil,
            isActive: true,
            billingCycle: 'MONTHLY'
          }
        });
      }
    }
  }
}
