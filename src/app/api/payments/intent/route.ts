import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PaymentIntentService } from '@/payments/core/intentService';
import { requireAuth } from '@/lib/rbac';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';

const createIntentSchema = z.object({
  productType: z.enum([
    'LISTING',
    'LISTING_RENEWAL',
    'FEATURED_LISTING',
    'SEARCH_BOOST',
    'HOMEPAGE_SPOTLIGHT',
    'SUBSCRIPTION'
  ]),
  propertyId: z.string().optional(),
  organizationId: z.string().optional(),
  propertyType: z.string().optional(),
  listingIntent: z.string().optional(),
  countyName: z.string().optional(),
  durationDays: z.number().int().min(7).max(365).optional(),
  promotionCodes: z.array(z.string()).optional(),
  phoneNumber: z.string().optional(),
  idempotencyKey: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`intent:create:${ip}`, 15, 60 * 1000);
    if (!rateCheck.isAllowed) {
      return rateLimitResponse(rateCheck.retryAfterSeconds);
    }

    // Authenticate user
    let user;
    try {
      user = await requireAuth(req);
    } catch {
      return NextResponse.json({ error: 'Authentication required to create a payment intent' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const validation = createIntentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid intent parameters', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    const intent = await PaymentIntentService.createIntent({
      userId: user.id,
      organizationId: data.organizationId || null,
      propertyId: data.propertyId || null,
      productType: data.productType,
      propertyType: data.propertyType,
      listingIntent: data.listingIntent,
      countyName: data.countyName,
      durationDays: data.durationDays,
      promotionCodes: data.promotionCodes,
      phoneNumber: data.phoneNumber,
      idempotencyKey: data.idempotencyKey
    });

    let metadata: any = {};
    try {
      if (intent.metadataJson) metadata = JSON.parse(intent.metadataJson);
    } catch {
      metadata = {};
    }

    return NextResponse.json({
      success: true,
      intentId: intent.id,
      publicReference: intent.publicReference,
      productType: intent.productType,
      description: intent.description,
      amount: intent.amount,
      currency: intent.currency,
      status: intent.status,
      lineItems: metadata.lineItems || [],
      volumeDiscountPercent: metadata.volumeDiscountPercent || 0,
      expiresAt: intent.expiresAt
    });
  } catch (error: any) {
    console.error('Create PaymentIntent Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error creating payment intent' },
      { status: 500 }
    );
  }
}
