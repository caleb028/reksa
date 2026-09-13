import { getMpesaConfig } from './config';
import { MpesaAuthService } from './auth';
import { MpesaStkPushService } from './stkPush';
import { MpesaQueryResult } from './types';
import { PaymentError } from './errors';

export class MpesaTransactionQueryService {
  /**
   * Queries Safaricom Daraja to determine the real-time status of an STK Push transaction
   */
  public static async queryStatus(checkoutRequestId: string): Promise<MpesaQueryResult> {
    if (!checkoutRequestId) {
      throw new PaymentError('CheckoutRequestID is required for M-Pesa query', 'INVALID_ARGUMENT', 400);
    }

    const config = getMpesaConfig();
    const accessToken = await MpesaAuthService.getAccessToken();

    const timestamp = MpesaStkPushService.generateTimestamp();
    const password = MpesaStkPushService.generatePassword(config.shortCode, config.passkey, timestamp);

    const payload = {
      BusinessShortCode: config.shortCode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };

    const queryUrl = `${config.baseUrl}/mpesa/stkpushquery/v1/query`;

    try {
      const response = await fetch(queryUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        cache: 'no-store'
      });

      const data = await response.json();

      return {
        responseCode: data.ResponseCode || '-1',
        responseDescription: data.ResponseDescription || '',
        merchantRequestId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID,
        resultCode: data.ResultCode !== undefined ? String(data.ResultCode) : '-1',
        resultDesc: data.ResultDesc || data.errorMessage || ''
      };
    } catch (error: any) {
      throw new PaymentError(
        `Failed to query Safaricom transaction status for ${checkoutRequestId}: ${error.message}`,
        'MPESA_QUERY_FAILED',
        502,
        { error: error.message }
      );
    }
  }
}
