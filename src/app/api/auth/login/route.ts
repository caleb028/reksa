import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, createSignedSessionToken, setSessionCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validation/schemas';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { logAuditEvent } from '@/lib/audit';
import { toUserDTO } from '@/lib/dto';
import { UserRole } from '@/auth/roles';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 5 attempts per minute per IP to defend against brute force
    const rateCheck = checkRateLimit(`login:${ip}`, 5, 60 * 1000);
    if (!rateCheck.isAllowed) {
      return rateLimitResponse(rateCheck.retryAfterSeconds);
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid login credentials format', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.passwordHash) {
      // Record failed login audit event
      await logAuditEvent({
        action: 'LOGIN_FAILED',
        targetType: 'User',
        targetId: email,
        details: { reason: 'User not found or unconfigured password' },
        ipAddress: ip
      });

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      await logAuditEvent({
        userId: user.id,
        action: 'LOGIN_FAILED',
        targetType: 'User',
        targetId: user.id,
        details: { reason: 'Password mismatch' },
        ipAddress: ip
      });

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate signed cryptographic session token
    const token = createSignedSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole
    });

    const response = NextResponse.json({
      message: 'Login successful',
      user: toUserDTO(user)
    });

    setSessionCookie(response, token);

    await logAuditEvent({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      targetType: 'User',
      targetId: user.id,
      details: { role: user.role },
      ipAddress: ip
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}