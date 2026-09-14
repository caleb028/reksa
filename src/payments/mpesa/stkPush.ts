import { getMpesaConfig } from './config';
import { MpesaAuthService } from './auth';
import { StkPushRequest, StkPushResponse } from './types';
import { MpesaStkPushError } from './errors';
import { normalizeKenyanPhone, validatePaymentAmount } from './validation';

export class MpesaStkPushService {
  /**
   * Generates formatted timestamp required by Daraja (YYYYMMDDHHmmss)
   */
  public static generateTimestamp(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      now.getFullYear().toString() +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      pad(now.getHours()) +
      pad(now.getMinutes()) +
      pad(now.getSeconds())
    );
  }

  /**
   * Generates Base64 encoded password for STK Push request
   */
  public static generatePassword(shortCode: string, passkey: string, timestamp: string): string {
    return Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
  }

  /**
   * Dispatches an STK Push prompt to the customer's phone via Safaricom Daraja
   */
  public static async initiateStkPush(req: StkPushRequest): Promise<StkPushResponse> {
    const config = getMpesaConfig();

    // 1. Validate inputs
    const normalizedPhone = normalizeKenyanPhone(req.phoneNumber);
    const amountCheck = validatePaymentAmount(req.amount);
    if (!amountCheck.valid) {
      throw new MpesaStkPushError(amountCheck.error || 'Invalid amount', { amount: req.amount });
    }

    if (!config.passkey) {
      throw new MpesaStkPushError(
        'MPESA_PASSKEY is not configured in the environment. Cannot generate STK push signature.',
        { environment: config.environment }
      );
    }

    // 2. Obtain OAuth Bearer Token
    const accessToken = await MpesaAuthService.getAccessToken();

    // 3. Assemble Daraja STK Push payload
    const timestamp = this.generateTimestamp();
    const password = this.generatePassword(config.shortCode, config.passkey, timestamp);
    const roundedAmount = Math.round(req.amount);

    const payload = {
      BusinessShortCode: config.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: roundedAmount,
      PartyA: normalizedPhone,
      PartyB: config.shortCode,
      PhoneNumber: normalizedPhone,
      CallBackURL: config.callbackUrl,
      AccountReference: (req.accountReference || 'ARDHI').substring(0, 12).replace(/[^a-zA-Z0-9]/g, ''),
      TransactionDesc: (req.transactionDesc || 'Listing Fee').substring(0, 13)
    };

    const processRequestUrl = `${config.baseUrl}/mpesa/stkpush/v1/processrequest`;

    try {
      const response = await fetch(processRequestUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        cache: 'no-store'
      });

      const responseText = await response.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new MpesaStkPushError(
          `Daraja returned non-JSON response (HTTP ${response.status}): ${responseText}`,
          { status: response.status }
        );
      }

      if (!response.ok || data.ResponseCode !== '0') {
        throw new MpesaStkPushError(
          data.errorMessage || data.ResponseDescription || 'M-Pesa STK Push rejected by Safaricom',
          {
            responseCode: data.ResponseCode,
            errorCode: data.errorCode,
            details: data
          }
        );
      }

      return {
        merchantRequestId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
        customerMessage: data.CustomerMessage || 'Success. Request accepted for processing'
      };
    } catch (error: any) {
      if (error instanceof MpesaStkPushError) throw error;
      throw new MpesaStkPushError(
        `Failed to communicate with Safaricom Daraja STK push endpoint: ${error.message}`,
        { error: error.message }
      );
    }
  }
}
