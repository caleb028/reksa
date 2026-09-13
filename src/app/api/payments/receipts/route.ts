import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    const where: any = {};

    if (organizationId) {
      where.organizationId = organizationId;
    } else if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      where.userId = user.id;
    }

    const receipts = await db.paymentReceipt.findMany({
      where,
      orderBy: { issuedAt: 'desc' },
      take: 30,
      include: {
        paymentIntent: {
          select: {
            publicReference: true,
            status: true,
            productType: true
          }
        },
        organization: {
          select: { name: true, slug: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      receipts: receipts.map((r) => ({
        id: r.id,
        receiptNumber: r.receiptNumber,
        publicReference: r.paymentIntent?.publicReference,
        productSummary: r.productSummary,
        amount: r.amount,
        currency: r.currency,
        paymentMethod: r.paymentMethod,
        mpesaReceipt: r.mpesaReceipt,
        customerPhone: r.customerPhone,
        issuedAt: r.issuedAt,
        organizationName: r.organization?.name
      }))
    });
  } catch (error: any) {
    console.error('Receipts API Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve receipts' }, { status: 500 });
  }
}
