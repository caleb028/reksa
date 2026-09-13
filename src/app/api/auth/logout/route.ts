import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, getAuthenticatedUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const response = NextResponse.json({ message: 'Logged out successfully' });
    clearSessionCookie(response);

    if (user) {
      await logAuditEvent({
        userId: user.id,
        action: 'LOGOUT',
        targetType: 'User',
        targetId: user.id
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}