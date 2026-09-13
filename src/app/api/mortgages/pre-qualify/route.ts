import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.fullName || !body.phoneNumber || !body.monthlyNetIncome) {
      return NextResponse.json(
        { error: 'Full name, phone number, and monthly net income are required' },
        { status: 400 }
      );
    }

    const {
      fullName,
      phoneNumber,
      email,
      employmentType,
      monthlyNetIncome,
      existingMonthlyDebts,
      downPaymentAmount,
      maxLoanAmount,
      targetPropertyPrice,
      preferredLender,
      propertyId
    } = body;

    // Determine estimated referral commission based on target loan size (0.35% blended banking referral)
    const loanSize = maxLoanAmount || (targetPropertyPrice - (downPaymentAmount || 0));
    const estimatedCommission = Math.round(Math.max(2500, loanSize * 0.0035));

    const mortgageLead = await db.mortgageLead.create({
      data: {
        fullName,
        phoneNumber,
        email: email || '',
        employmentType: employmentType || 'SALARIED',
        monthlyNetIncome: Number(monthlyNetIncome),
        existingMonthlyDebts: Number(existingMonthlyDebts || 0),
        downPaymentAmount: Number(downPaymentAmount || 0),
        maxLoanAmount: Number(maxLoanAmount || loanSize),
        targetPropertyPrice: Number(targetPropertyPrice || 0),
        preferredLender: preferredLender || 'KCB',
        propertyId: propertyId || null,
        referralCommissionKes: estimatedCommission,
        status: 'PRE_QUALIFIED'
      }
    });

    await logAuditEvent({
      action: 'MORTGAGE_PREQUALIFICATION_CREATED',
      targetType: 'MortgageLead',
      targetId: mortgageLead.id,
      details: {
        lender: preferredLender,
        loanAmount: loanSize,
        commissionKes: estimatedCommission
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Mortgage pre-qualification submitted successfully',
      referenceNumber: `REKSA-MORT-${mortgageLead.id.slice(-6).toUpperCase()}`,
      lead: mortgageLead
    });
  } catch (error: any) {
    console.error('Mortgage pre-qualify API error:', error);
    return NextResponse.json({ error: 'Failed to process mortgage pre-qualification' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const leads = await db.mortgageLead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads
    });
  } catch (error: any) {
    console.error('Error fetching mortgage leads:', error);
    return NextResponse.json({ error: 'Failed to fetch mortgage leads' }, { status: 500 });
  }
}
