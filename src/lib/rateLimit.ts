import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodic garbage collection every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((record, key) => {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  });
}, 5 * 60 * 1000);

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { isAllowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { isAllowed: true, remaining: maxRequests - 1, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    return { isAllowed: false, remaining: 0, retryAfterSeconds };
  }

  record.count += 1;
  const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
  return { isAllowed: true, remaining: maxRequests - record.count, retryAfterSeconds };
}

export function rateLimitResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Please try again in ${retryAfterSeconds} seconds.`
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
        'X-RateLimit-Remaining': '0'
      }
    }
  );
}