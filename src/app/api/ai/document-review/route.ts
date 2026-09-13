import { NextRequest, NextResponse } from 'next/server';
import { analyzePropertyDocument } from '@/ai/documentAnalyzer';
import { documentReviewSchema } from '@/lib/validation/schemas';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { sanitizePromptText } from '@/ai/defense';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 10 document reviews per minute per IP
    const rateCheck = checkRateLimit(`ai:doc-review:${ip}`, 10, 60 * 1000);
    if (!rateCheck.isAllowed) {
      return rateLimitResponse(rateCheck.retryAfterSeconds);
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const validation = documentReviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid document review payload', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { fileName, textContent } = validation.data;
    const sanitizedText = sanitizePromptText(textContent || '', 50_000);

    const review = analyzePropertyDocument({
      fileName,
      textContent: sanitizedText
    });

    return NextResponse.json(review);
  } catch (error: any) {
    console.error('Document review error:', error);
    return NextResponse.json(
      { error: 'Internal error during document analysis' },
      { status: 500 }
    );
  }
}