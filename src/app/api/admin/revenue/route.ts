import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/rbac';
import { PaymentReconciliationService } from '@/payments/mpesa/reconciliation';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 1. Fetch all completed intents
    const completedIntents = await db.paymentIntent.findMany({
      where: { status: 'SUCCESS' },
      include: {
        organization: { select: { id: true, name: true, slug: true } },
        property: { select: { id: true, title: true, town: true, countyId: true } }
      },
      orderBy: { completedAt: 'desc' }
    });

    // 2. Aggregate metrics
    let totalGrossRevenue = 0;
    let todayRevenue = 0;
    let weekRevenue = 0;
    let monthRevenue = 0;
    let yearRevenue = 0;

    const productBreakdown: Record<string, { count: number; totalKes: number }> = {};
    const companyBreakdown: Record<string, { name: string; count: number; totalKes: number }> = {};

    for (const intent of completedIntents) {
      const amount = intent.amount;
      const date = intent.completedAt || intent.createdAt;
      totalGrossRevenue += amount;

      if (date >= startOfToday) todayRevenue += amount;
      if (date >= startOfWeek) weekRevenue += amount;
      if (date >= startOfMonth) monthRevenue += amount;
      if (date >= startOfYear) yearRevenue += amount;

      // Product breakdown
      if (!productBreakdown[intent.productType]) {
        productBreakdown[intent.productType] = { count: 0, totalKes: 0 };
      }
      productBreakdown[intent.productType].count += 1;
      productBreakdown[intent.productType].totalKes += amount;

      // Company breakdown
      if (intent.organization) {
        const orgId = intent.organization.id;
        if (!companyBreakdown[orgId]) {
          companyBreakdown[orgId] = { name: intent.organization.name, count: 0, totalKes: 0 };
        }
        companyBreakdown[orgId].count += 1;
        companyBreakdown[orgId].totalKes += amount;
      }
    }

    // 3. Status counts
    const [pendingCount, failedCount, reconciliationCount] = await Promise.all([
      db.paymentIntent.count({ where: { status: { in: ['PENDING', 'PROCESSING'] } } }),
      db.paymentIntent.count({ where: { status: { in: ['FAILED', 'CANCELLED', 'EXPIRED'] } } }),
      db.paymentIntent.count({ where: { status: 'RECONCILIATION_REQUIRED' } })
    ]);

    // 4. Recent transactions
    const recentTransactions = completedIntents.slice(0, 15).map((intent) => ({
      id: intent.id,
      publicReference: intent.publicReference,
      productType: intent.productType,
      description: intent.description,
      amount: intent.amount,
      currency: intent.currency,
      mpesaReceipt: intent.providerReceiptNumber,
      organizationName: intent.organization?.name || 'Direct Seller',
      completedAt: intent.completedAt || intent.createdAt,
      status: intent.status
    }));

    return NextResponse.json({
      success: true,
      metrics: {
        totalGrossRevenue,
        todayRevenue,
        weekRevenue,
        monthRevenue,
        yearRevenue,
        successfulCount: completedIntents.length,
        pendingCount,
        failedCount,
        reconciliationCount,
        averageTransactionValue:
          completedIntents.length > 0 ? Math.round(totalGrossRevenue / completedIntents.length) : 0
      },
      productBreakdown,
      topCompanies: Object.values(companyBreakdown).sort((a, b) => b.totalKes - a.totalKes).slice(0, 5),
      recentTransactions
    });
  } catch (error: any) {
    console.error('Admin Revenue API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to retrieve revenue metrics' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Trigger reconciliation
    const report = await PaymentReconciliationService.reconcilePendingPayments(5);

    return NextResponse.json({
      success: true,
      message: `Reconciliation complete: ${report.resolvedSuccess} confirmed, ${report.resolvedFailed} closed, ${report.flaggedForReview} flagged.`,
      report
    });
  } catch (error: any) {
    console.error('Reconciliation execution error:', error);
    return NextResponse.json({ error: 'Failed to execute reconciliation' }, { status: 500 });
  }
}
