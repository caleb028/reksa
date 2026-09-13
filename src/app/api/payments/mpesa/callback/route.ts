import { NextRequest, NextResponse } from 'next/server';
import { MpesaCallbackService } from '@/payments/mpesa/callback';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    if (!rawBody) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Empty callback body' }, { status: 400 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid JSON format' }, { status: 400 });
    }

    // Process Safaricom Daraja callback payload atomically
    const result = await MpesaCallbackService.processCallback(payload);

    // Safaricom expects a 200 response with ResultCode 0 to acknowledge receipt
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Callback processed successfully',
      received: true,
      duplicate: !!result.duplicate,
      reksaStatus: result.success ? 'CONFIRMED' : 'FAILED',
      receiptNumber: result.receiptNumber
    });
  } catch (error: any) {
    console.error('M-Pesa Webhook Error:', error);
    // Still return 200/500 appropriately to ensure retry semantics
    return NextResponse.json(
      { ResultCode: 1, ResultDesc: error.message || 'Internal processing error' },
      { status: 500 }
    );
  }
}