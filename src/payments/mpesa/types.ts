export type MpesaEnvironment = 'sandbox' | 'production';

export interface MpesaConfig {
  environment: MpesaEnvironment;
  consumerKey: string;
  consumerSecret: string;
  shortCode: string;
  passkey: string;
  callbackUrl: string;
  timeoutSeconds: number;
  baseUrl: string;
}

export interface StkPushRequest {
  phoneNumber: string; // Kenyan normalized format 2547...
  amount: number;      // Amount in KES (minimum 1)
  accountReference: string; // e.g. REKSA-PAY-2026
  transactionDesc: string;  // e.g. REKSA Listing Fee
}

export interface StkPushResponse {
  merchantRequestId: string;
  checkoutRequestId: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
}

export interface DarajaCallbackMetadataItem {
  Name: string;
  Value?: string | number;
}

export interface DarajaStkCallback {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  CallbackMetadata?: {
    Item: DarajaCallbackMetadataItem[];
  };
}

export interface DarajaCallbackPayload {
  Body: {
    stkCallback: DarajaStkCallback;
  };
}

export interface ParsedCallbackResult {
  merchantRequestId: string;
  checkoutRequestId: string;
  resultCode: number;
  resultDesc: string;
  success: boolean;
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  phoneNumber?: string;
}

export interface MpesaQueryResult {
  responseCode: string;
  responseDescription: string;
  merchantRequestId?: string;
  checkoutRequestId?: string;
  resultCode: string;
  resultDesc: string;
}
