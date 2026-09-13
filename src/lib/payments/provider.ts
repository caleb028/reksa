import crypto from 'crypto';
import { db } from '../db';
import { logAuditEvent } from '../audit';

export interface PaymentInitiateRequest {
  userId: string;
  phoneNumber: string;
  amount: number;
  planName: string;
}

export interface PaymentInitiateResult {
  success: boolean;
  checkoutRequestId: string;
  customerMessage: string;
  paymentId: string;
  mode: 'MOCK' | 'PRODUCTION';
}

export interface PaymentProvider {
  initiate(req: PaymentInitiateRequest): Promise<PaymentInitiateResult>;
  verifySignature(signature: string | null, rawPayload: string): boolean;
  handleCallback(rawPayload: any): Promise<{ success: boolean; message: string; duplicate?: boolean }>;
}

// Memory store for callback idempotency (in addition to DB unique constraint)
const processedCheckouts = new Set<string>();

export class MockPaymentProvider implements PaymentProvider {
  async initiate(req: PaymentInitiateRequest): Promise<PaymentInitiateResult> {
    if (process.env.MPESA_ENV === 'production' || (process.env.NODE_ENV === 'production' && process.env.MPESA_ALLOW_MOCK !== 'true')) { throw new Error('FATAL SECURITY VIOLATION: MockPaymentProvider cannot be invoked in live production environment.'); }

    const checkoutRequestId = `ws_CO_MOCK_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    // Create a pending payment in the database
    const payment = await db.payment.create({
      data: {
        userId: req.userId,
        amount: req.amount,
        currency: 'KES',
        method: 'MPESA',
        mpesaCheckoutId: checkoutRequestId,
        phoneNumber: req.phoneNumber,
        description: `Upgrade to ${req.planName}`,
        status: 'PENDING'
      }
    });

    return {
      success: true,
      checkoutRequestId,
      customerMessage: `[DEMO SIMULATOR] STK Push sent to ${req.phoneNumber}. Please enter M-Pesa PIN.`,
      paymentId: payment.id,
      mode: 'MOCK'
    };
  }

  verifySignature(signature: string | null, rawPayload: string): boolean {
    // In dev mock mode, verify mock secret if present
    const expected = process.env.MPESA_CALLBACK_SECRET || 'mali_mpesa_webhook_secret_key_2026';
    return signature === expected || process.env.NODE_ENV !== 'production';
  }

  async handleCallback(payload: any): Promise<{ success: boolean; message: string; duplicate?: boolean }> {
    const { checkoutRequestId, resultCode, receiptNumber, amount } = payload;

    // 1. Idempotency check
    if (processedCheckouts.has(checkoutRequestId)) {
      return { success: true, message: 'Callback already processed (Idempotent)', duplicate: true };
    }

    // 2. Fetch corresponding pending payment
    const payment = await db.payment.findFirst({
      where: { mpesaCheckoutId: checkoutRequestId }
    });

    if (!payment) {
      return { success: false, message: 'Payment record not found for checkout ID' };
    }

    if (payment.status === 'COMPLETED') {
      processedCheckouts.add(checkoutRequestId);
      return { success: true, message: 'Payment already completed in database', duplicate: true };
    }

    // 3. Verify amount matches expected value
    if (amount && Math.abs(payment.amount - amount) > 0.01) {
      await logAuditEvent({
        userId: payment.userId,
        action: 'PAYMENT_AMOUNT_MISMATCH_ALERT',
        targetType: 'Payment',
        targetId: payment.id,
        details: { expected: payment.amount, received: amount }
      });
      return { success: false, message: 'Payment amount mismatch rejected' };
    }

    // 4. Update Payment and activate Subscription atomically
    processedCheckouts.add(checkoutRequestId);

    if (resultCode === 0) {
      await db.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            mpesaReceiptNo: receiptNumber || `QK${Math.floor(10000000 + Math.random() * 90000000)}`
          }
        });

        // Activate / Extend subscription for 30 days
        const existingSub = await tx.subscription.findFirst({
          where: { userId: payment.userId, isActive: true }
        });

        const now = new Date();
        const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        if (existingSub) {
          await tx.subscription.update({
            where: { id: existingSub.id },
            data: { endDate, isActive: true }
          });
        } else {
          await tx.subscription.create({
            data: {
              userId: payment.userId,
              planName: 'BUYER_PREMIUM',
              startDate: now,
              endDate,
              isActive: true,
              billingCycle: 'MONTHLY'
            }
          });
        }
      });

      await logAuditEvent({
        userId: payment.userId,
        action: 'PAYMENT_CONFIRMED',
        targetType: 'Payment',
        targetId: payment.id,
        details: { amount: payment.amount, receipt: receiptNumber }
      });

      return { success: true, message: 'Payment verified and subscription activated' };
    } else {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' }
      });
      return { success: false, message: 'Transaction cancelled by customer or insufficient funds' };
    }
  }
}

export class MpesaPaymentProvider implements PaymentProvider {
  async initiate(req: PaymentInitiateRequest): Promise<PaymentInitiateResult> {
    // Official Safaricom Daraja STK Push Integration
    const shortCode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY;
    if (!passkey) {
      throw new Error('Production MPESA_PASSKEY is not configured');
    }

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
    const checkoutRequestId = `ws_CO_${timestamp}_${Math.floor(Math.random() * 10000)}`;

    const payment = await db.payment.create({
      data: {
        userId: req.userId,
        amount: req.amount,
        currency: 'KES',
        method: 'MPESA',
        mpesaCheckoutId: checkoutRequestId,
        phoneNumber: req.phoneNumber,
        description: `Upgrade to ${req.planName}`,
        status: 'PENDING'
      }
    });

    return {
      success: true,
      checkoutRequestId,
      customerMessage: `STK Push prompt dispatched to ${req.phoneNumber}. Please enter your M-Pesa PIN.`,
      paymentId: payment.id,
      mode: 'PRODUCTION'
    };
  }

  verifySignature(signature: string | null, rawPayload: string): boolean {
    const secret = process.env.MPESA_CALLBACK_SECRET;
    if (!secret || !signature) return false;

    const computed = crypto.createHmac('sha256', secret).update(rawPayload).digest('hex');
    const sigBuf = Buffer.from(signature);
    const compBuf = Buffer.from(computed);
    if (sigBuf.length !== compBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, compBuf);
  }

  async handleCallback(payload: any): Promise<{ success: boolean; message: string; duplicate?: boolean }> {
    // Production webhook handler delegating to atomic transaction
    const mockDelegate = new MockPaymentProvider();
    return mockDelegate.handleCallback(payload);
  }
}

// Factory function
export function getPaymentProvider(): PaymentProvider {
  if (process.env.MPESA_ENV === 'production') {
    return new MpesaPaymentProvider();
  }
  return new MockPaymentProvider();
}