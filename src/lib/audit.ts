import { db } from './db';

export interface AuditEventParams {
  userId?: string | null;
  organizationId?: string | null;
  action: string;
  targetType: string;
  targetId: string;
  details?: Record<string, any> | string;
  ipAddress?: string | null;
}

export async function logAuditEvent(params: AuditEventParams): Promise<void> {
  try {
    let sanitizedDetails = '';
    if (typeof params.details === 'object' && params.details !== null) {
      // Scrub sensitive keys to prevent credential/token leakage
      const scrubbed = { ...params.details };
      delete scrubbed.password;
      delete scrubbed.passwordHash;
      delete scrubbed.token;
      delete scrubbed.secret;
      delete scrubbed.apiKey;
      delete scrubbed.pin;
      sanitizedDetails = JSON.stringify(scrubbed);
    } else {
      sanitizedDetails = String(params.details || '');
    }

    await db.auditLog.create({
      data: {
        userId: params.userId || null,
        organizationId: params.organizationId || null,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        details: sanitizedDetails,
        ipAddress: params.ipAddress || null
      }
    });
  } catch (error) {
    // Non-blocking: log to server stderr so primary action does not fail if audit log write fails
    console.error('Failed to record audit log event:', error);
  }
}