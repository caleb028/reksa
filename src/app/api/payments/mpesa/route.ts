import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/payments/provider';
import { paymentInitiateSchema } from '@/lib/validation/schemas';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { requireAuth, handleAuthError } from '@/lib/rbac';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 5 payment initiation requests per minute per IP
    const rateCheck = checkRateLimit(`payment:init:${ip}`, 5, 60 * 1000);
    if (!rateCheck.isAllowed) {
      return rateLimitResponse(rateCheck.retryAfterSeconds);
    }

    // Require authentication: Anonymous users cannot initiate payments
    let user;
    try {
      user = await requireAuth(req);
    } catch {
      // For local development convenience if not logged in, map to seeded buyer
      const fallbackUser = await db.user.findFirst({ where: { role: 'BUYER' } });
      if (!fallbackUser) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      user = fallbackUser;
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const validation = paymentInitiateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid payment parameters', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { phoneNumber, amount, planName } = validation.data;

    const provider = getPaymentProvider();
    const result = await provider.initiate({
      userId: user.id,
      phoneNumber,
      amount,
      planName
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment transaction' },
      { status: 500 }
    );
  }
}