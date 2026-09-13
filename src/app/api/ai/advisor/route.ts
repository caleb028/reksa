import { NextRequest, NextResponse } from 'next/server';
import { askMaliAI } from '@/ai/advisor';
import { aiAdvisorSchema } from '@/lib/validation/schemas';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { sanitizePromptText } from '@/ai/defense';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 10 requests per minute per IP to protect AI costs and prevent DoS
    const rateCheck = checkRateLimit(`ai:advisor:${ip}`, 10, 60 * 1000);
    if (!rateCheck.isAllowed) {
      return rateLimitResponse(rateCheck.retryAfterSeconds);
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Malformed JSON body' }, { status: 400 });
    }

    const validation = aiAdvisorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input format', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { query, history } = validation.data;
    const sanitizedQuery = sanitizePromptText(query, 1000);

    const safeHistory = (history || []).map((h) => ({
      role: h.role,
      content: sanitizePromptText(h.content, 2000)
    }));

    const response = await askMaliAI(sanitizedQuery, safeHistory);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Advisor API error:', error);
    return NextResponse.json(
      { error: 'Internal intelligence service error' },
      { status: 500 }
    );
  }
}