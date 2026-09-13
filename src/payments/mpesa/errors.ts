export class PaymentError extends Error {
  code: string;
  statusCode: number;
  details?: any;

  constructor(message: string, code = 'PAYMENT_ERROR', statusCode = 400, details?: any) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class MpesaConfigError extends PaymentError {
  constructor(message: string, details?: any) {
    super(message, 'MPESA_CONFIG_ERROR', 500, details);
    this.name = 'MpesaConfigError';
  }
}

export class MpesaAuthError extends PaymentError {
  constructor(message: string, details?: any) {
    super(message, 'MPESA_AUTH_ERROR', 502, details);
    this.name = 'MpesaAuthError';
  }
}

export class MpesaStkPushError extends PaymentError {
  constructor(message: string, details?: any) {
    super(message, 'MPESA_STK_PUSH_ERROR', 502, details);
    this.name = 'MpesaStkPushError';
  }
}

export class MpesaCallbackError extends PaymentError {
  constructor(message: string, details?: any) {
    super(message, 'MPESA_CALLBACK_ERROR', 422, details);
    this.name = 'MpesaCallbackError';
  }
}

export class PaymentIdempotencyError extends PaymentError {
  constructor(message: string, details?: any) {
    super(message, 'PAYMENT_IDEMPOTENCY_CONFLICT', 409, details);
    this.name = 'PaymentIdempotencyError';
  }
}
