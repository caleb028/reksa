import { NextRequest, NextResponse } from 'next/server';
import { PaymentIntentService } from '@/payments/core/intentService';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(req);
    // Allow up to 120 status polling requests per minute per IP (e.g. 1 poll per second during checkout)
    const rateCheck = checkRateLimit(`intent:poll:${ip}`, 120, 60 * 1000);
    if (!rateCheck.isAllowed) {
      return rateLimitResponse(rateCheck.retryAfterSeconds);
    }

    const intent = await PaymentIntentService.getIntent(params.id);
    if (!intent) {
      return NextResponse.json({ error: 'Payment intent not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: intent.id,
      publicReference: intent.publicReference,
      status: intent.status,
      productType: intent.productType,
      description: intent.description,
      amount: intent.amount,
      currency: intent.currency,
      phoneNumberMasked: intent.phoneNumberMasked,
      mpesaReceipt: intent.providerReceiptNumber,
      receiptNumber: intent.receipt?.receiptNumber,
      failureReason: intent.failureReason,
      completedAt: intent.completedAt,
      isCompleted: intent.status === 'SUCCESS',
      isFailed: intent.status === 'FAILED' || intent.status === 'CANCELLED' || intent.status === 'EXPIRED',
      isPending: intent.status === 'PENDING' || intent.status === 'PROCESSING'
    });
  } catch (error: any) {
    console.error('Get PaymentIntent Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve payment intent' }, { status: 500 });
  }
}
