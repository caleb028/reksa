import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PaymentIntentService } from '@/payments/core/intentService';
import { MpesaStkPushService } from '@/payments/mpesa/stkPush';
import { normalizeKenyanPhone, maskPhoneNumber } from '@/payments/mpesa/validation';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { isMpesaConfigured, getMpesaConfig } from '@/payments/mpesa/config';

const stkPushSchema = z.object({
  intentId: z.string().min(1, 'intentId is required'),
  phoneNumber: z.string().min(8, 'phoneNumber is required')
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 6 STK prompt dispatches per minute per IP to prevent spamming
    const rateCheck = checkRateLimit(`stk:dispatch:${ip}`, 6, 60 * 1000);
    if (!rateCheck.isAllowed) {
      return rateLimitResponse(rateCheck.retryAfterSeconds);
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const validation = stkPushSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid STK dispatch parameters', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { intentId, phoneNumber } = validation.data;

    // 1. Fetch PaymentIntent
    const intent = await PaymentIntentService.getIntent(intentId);
    if (!intent) {
      return NextResponse.json({ error: 'Payment intent not found' }, { status: 404 });
    }

    if (intent.status === 'SUCCESS') {
      return NextResponse.json(
        { error: 'This payment intent has already been successfully paid.' },
        { status: 400 }
      );
    }

    // 2. Validate and normalize Kenyan phone number
    const normalizedPhone = normalizeKenyanPhone(phoneNumber);
    const maskedPhone = maskPhoneNumber(normalizedPhone);

    // 3. Check credentials configuration
    if (!isMpesaConfigured()) {
      const config = getMpesaConfig();
      // Inform client clearly if credentials have not been configured
      return NextResponse.json(
        {
          error: 'M-Pesa Daraja gateway is not configured with live credentials.',
          code: 'MPESA_CREDENTIALS_REQUIRED',
          details: `Please set MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, and MPESA_PASSKEY in your environment (${config.environment} mode). No simulated/fake transactions are allowed on REKSA.`,
          maskedPhone
        },
        { status: 503 }
      );
    }

    // 4. Initiate Safaricom Daraja STK Push prompt
    const stkResponse = await MpesaStkPushService.initiateStkPush({
      phoneNumber: normalizedPhone,
      amount: intent.amount,
      accountReference: intent.publicReference,
      transactionDesc: intent.description
    });

    // 5. Update PaymentIntent with Safaricom IDs and status PENDING
    await PaymentIntentService.recordStkDispatch(
      intent.id,
      stkResponse.merchantRequestId,
      stkResponse.checkoutRequestId,
      normalizedPhone
    );

    return NextResponse.json({
      success: true,
      checkoutRequestId: stkResponse.checkoutRequestId,
      merchantRequestId: stkResponse.merchantRequestId,
      customerMessage: stkResponse.customerMessage || 'M-Pesa payment prompt sent to your phone. Please enter your PIN to complete the transaction.',
      maskedPhone
    });
  } catch (error: any) {
    console.error('STK Push Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to dispatch M-Pesa STK push prompt', code: error.code || 'STK_PUSH_ERROR' },
      { status: error.statusCode || 500 }
    );
  }
}
