import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSignedSessionToken, setSessionCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validation/schemas';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { logAuditEvent } from '@/lib/audit';
import { toUserDTO } from '@/lib/dto';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`register:${ip}`, 5, 60 * 1000);
    if (!rateCheck.isAllowed) {
      return rateLimitResponse(rateCheck.retryAfterSeconds);
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = validation.data;

    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        phone: phone || null,
        role: 'BUYER', // Default safe role, never accept role from client payload
        isVerified: false
      }
    });

    const token = createSignedSessionToken({
      userId: user.id,
      email: user.email,
      role: 'BUYER'
    });

    const response = NextResponse.json(
      {
        message: 'Account registered successfully',
        user: toUserDTO(user)
      },
      { status: 201 }
    );

    setSessionCookie(response, token);

    await logAuditEvent({
      userId: user.id,
      action: 'USER_REGISTERED',
      targetType: 'User',
      targetId: user.id,
      details: { email: user.email, role: 'BUYER' },
      ipAddress: ip
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}