export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin, handleAuthError } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    // Only ADMIN or SUPER_ADMIN can view audit logs
    const adminUser = await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25')));
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const skip = (page - 1) * limit;

    const [total, logs] = await Promise.all([
      db.auditLog.count(),
      db.auditLog.findMany({
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      })
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      logs
    });
  } catch (error: any) {
    return handleAuthError(error);
  }
}