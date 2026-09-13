import { getMpesaConfig } from './config';
import { MpesaAuthError } from './errors';

interface CachedToken {
  token: string;
  expiresAt: number; // Unix timestamp in ms
}

export class MpesaAuthService {
  private static cachedToken: CachedToken | null = null;

  /**
   * Retrieves a valid OAuth bearer access token from Safaricom Daraja.
   * Utilizes in-memory caching to avoid excessive token generation requests.
   */
  public static async getAccessToken(): Promise<string> {
    const config = getMpesaConfig();
    const now = Date.now();

    // Return cached token if valid (with 60-second safety margin)
    if (this.cachedToken && this.cachedToken.expiresAt > now + 60000) {
      return this.cachedToken.token;
    }

    if (!config.consumerKey || !config.consumerSecret) {
      throw new MpesaAuthError(
        'Daraja API credentials not configured: MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET missing in environment.',
        { environment: config.environment }
      );
    }

    const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');
    const authUrl = `${config.baseUrl}/oauth/v1/generate?grant_type=client_credentials`;

    try {
      const response = await fetch(authUrl, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new MpesaAuthError(
          `Safaricom Daraja OAuth request failed with HTTP ${response.status}: ${errorText}`,
          { status: response.status, body: errorText }
        );
      }

      const data = await response.json();
      if (!data.access_token) {
        throw new MpesaAuthError('Daraja OAuth response did not contain access_token', data);
      }

      const expiresInSeconds = parseInt(data.expires_in || '3599', 10);
      this.cachedToken = {
        token: data.access_token,
        expiresAt: now + expiresInSeconds * 1000
      };

      return data.access_token;
    } catch (error: any) {
      if (error instanceof MpesaAuthError) throw error;
      throw new MpesaAuthError(
        `Failed to communicate with Safaricom Daraja OAuth server at ${config.baseUrl}: ${error.message}`,
        { error: error.message }
      );
    }
  }

  /**
   * Clears the cached token (useful for test isolation or auth retry)
   */
  public static clearCache(): void {
    this.cachedToken = null;
  }
}
