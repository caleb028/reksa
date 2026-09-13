import { MpesaConfig, MpesaEnvironment } from './types';
import { MpesaConfigError } from './errors';

export function getMpesaConfig(): MpesaConfig {
  const envRaw = (process.env.MPESA_ENVIRONMENT || process.env.MPESA_ENV || 'sandbox').toLowerCase();
  const environment: MpesaEnvironment = envRaw === 'production' ? 'production' : 'sandbox';

  const consumerKey = process.env.MPESA_CONSUMER_KEY || '';
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET || '';
  const shortCode = process.env.MPESA_SHORTCODE || '174379';
  const passkey = process.env.MPESA_PASSKEY || '';
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';
  const callbackUrl = process.env.MPESA_CALLBACK_URL || `${appUrl}/api/payments/mpesa/callback`;
  const timeoutSeconds = parseInt(process.env.MPESA_TIMEOUT_SECONDS || '60', 10);

  const baseUrl =
    environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';

  // In production, ensure no silent fallback or missing keys
  if (environment === 'production') {
    if (!consumerKey || !consumerSecret || !passkey) {
      throw new MpesaConfigError(
        'Critical: Production M-Pesa environment is configured but MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, or MPESA_PASSKEY are missing. Set these environment variables in .env before executing live production transactions.'
      );
    }
  }

  return {
    environment,
    consumerKey,
    consumerSecret,
    shortCode,
    passkey,
    callbackUrl,
    timeoutSeconds,
    baseUrl
  };
}

export function isMpesaConfigured(): boolean {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  const passkey = process.env.MPESA_PASSKEY;
  return Boolean(
    key && secret && passkey &&
    key !== 'mock_consumer_key' &&
    secret !== 'mock_consumer_secret'
  );
}
