import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';
import { MpesaTransactionQueryService } from './query';
import { PaymentEntitlementService } from '../core/entitlementService';
import { PaymentReceiptService } from '../core/receiptService';

export interface ReconciliationReport {
  checkedCount: number;
  resolvedSuccess: number;
  resolvedFailed: number;
  flaggedForReview: number;
  errors: string[];
}

export class PaymentReconciliationService {
  /**
   * Scans for pending or stuck PaymentIntents and attempts resolution
   */
  public static async reconcilePendingPayments(olderThanMinutes = 5): Promise<ReconciliationReport> {
    const cutoffTime = new Date(Date.now() - olderThanMinutes * 60 * 1000);
    const staleCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours

    const pendingIntents = await db.paymentIntent.findMany({
      where: {
        status: { in: ['PENDING', 'PROCESSING'] },
        createdAt: { lte: cutoffTime }
      },
      include: {
        property: true,
        organization: true,
        user: true
      },
      take: 50
    });

    const report: ReconciliationReport = {
      checkedCount: pendingIntents.length,
      resolvedSuccess: 0,
      resolvedFailed: 0,
      flaggedForReview: 0,
      errors: []
    };

    for (const intent of pendingIntents) {
      // If older than 24 hours without resolution, flag for admin manual review
      if (intent.createdAt < staleCutoff) {
        await db.paymentIntent.update({
          where: { id: intent.id },
          data: {
            status: 'RECONCILIATION_REQUIRED',
            failureReason: 'Transaction remained unconfirmed for >24 hours'
          }
        });
        report.flaggedForReview++;
        continue;
      }

      if (!intent.checkoutRequestId) {
        // No checkout request ID dispatched (e.g. user aborted before STK push)
        await db.paymentIntent.update({
          where: { id: intent.id },
          data: {
            status: 'CANCELLED',
            failureReason: 'Session expired before STK prompt dispatch'
          }
        });
        report.resolvedFailed++;
        continue;
      }

      try {
        const queryResult = await MpesaTransactionQueryService.queryStatus(intent.checkoutRequestId);

        if (queryResult.resultCode === '0') {
          // Transaction was actually successful on Safaricom's side!
          await db.$transaction(async (tx) => {
            await tx.paymentIntent.update({
              where: { id: intent.id },
              data: {
                status: 'SUCCESS',
                providerReceiptNumber: queryResult.merchantRequestId || 'RECONCILED',
                completedAt: new Date()
              }
            });

            await PaymentReceiptService.createReceipt(tx, {
              paymentIntentId: intent.id,
              organizationId: intent.organizationId,
              userId: intent.userId,
              amount: intent.amount,
              currency: intent.currency,
              mpesaReceipt: queryResult.merchantRequestId || 'RECONCILED',
              customerPhone: intent.phoneNumberRaw || undefined,
              productSummary: `${intent.description} (Auto-Reconciled)`
            });

            await PaymentEntitlementService.fulfillEntitlement(tx, intent);
          });

          await logAuditEvent({
            userId: intent.userId || undefined,
            organizationId: intent.organizationId || undefined,
            action: 'PAYMENT_AUTO_RECONCILED_SUCCESS',
            targetType: 'PaymentIntent',
            targetId: intent.id,
            details: { reference: intent.publicReference, checkoutRequestId: intent.checkoutRequestId }
          });

          report.resolvedSuccess++;
        } else if (['1032', '1037', '1', '2001'].includes(queryResult.resultCode)) {
          // Explicitly cancelled or failed on Daraja
          await db.paymentIntent.update({
            where: { id: intent.id },
            data: {
              status: 'FAILED',
              failureReason: queryResult.resultDesc || 'M-Pesa transaction cancelled or expired'
            }
          });
          report.resolvedFailed++;
        }
      } catch (err: any) {
        report.errors.push(`Error querying ${intent.publicReference}: ${err.message}`);
      }
    }

    return report;
  }
}
