import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { db } from './db';
import { UserRole } from '@/auth/roles';

const BCRYPT_SALT_ROUNDS = 12;
const SESSION_COOKIE_NAME = 'mali_session';
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    // Fallback deterministic dev secret with warning in dev, but strictly required in prod
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: SESSION_SECRET must be at least 32 characters long in production.');
    }
    return 'mali_trace_default_dev_session_secret_32chars_long!';
  }
  return secret;
}

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  createdAt: number;
  expiresAt: number;
}

export function createSignedSessionToken(payload: Omit<SessionPayload, 'createdAt' | 'expiresAt'>): string {
  const secret = getSessionSecret();
  const now = Date.now();
  const fullPayload: SessionPayload = {
    ...payload,
    createdAt: now,
    expiresAt: now + SESSION_MAX_AGE_SECONDS * 1000
  };

  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');

  return `${payloadB64}.${signature}`;
}

export function verifySignedSessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;
    const secret = getSessionSecret();
    const expectedSignature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');

    // Timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > payload.expiresAt) {
      return null; // Expired session
    }

    return payload;
  } catch (err) {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, token: string): void {
  const isProd = process.env.NODE_ENV === 'production';
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
}

export async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = verifySignedSessionToken(token);
  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      isVerified: true,
      avatar: true,
      createdAt: true
    }
  });

  return user;
}