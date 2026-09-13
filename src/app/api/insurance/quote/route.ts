import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.clientName || !body.clientPhone || !body.propertyValue) {
      return NextResponse.json(
        { error: 'Client name, phone number, and property valuation are required' },
        { status: 400 }
      );
    }

    const {
      clientName,
      clientPhone,
      clientEmail,
      propertyId,
      propertyValue,
      insuranceType,
      selectedInsurer
    } = body;

    const val = Number(propertyValue);
    // Kenyan insurance rates: ~0.125% - 0.175% of building replacement valuation + statutory training levy & stamp duty
    const basePremium = Math.round(val * 0.0015);
    const estimatedAnnualPremium = Math.max(7500, basePremium);
    // REKSA introduction commission: 15% of first year annual premium
    const estimatedReferralFee = Math.round(estimatedAnnualPremium * 0.15);

    const quote = await db.insuranceQuote.create({
      data: {
        propertyId: propertyId || null,
        clientName,
        clientPhone,
        clientEmail: clientEmail || '',
        insuranceType: insuranceType || 'HOME_AND_FIRE',
        propertyValue: val,
        estimatedAnnualPremiumKes: estimatedAnnualPremium,
        selectedInsurer: selectedInsurer || 'JUBILEE',
        referralFeeKes: estimatedReferralFee,
        status: 'QUOTE_GENERATED'
      }
    });

    await logAuditEvent({
      action: 'INSURANCE_QUOTE_GENERATED',
      targetType: 'InsuranceQuote',
      targetId: quote.id,
      details: {
        insurer: selectedInsurer || 'JUBILEE',
        propertyValue: val,
        annualPremiumKes: estimatedAnnualPremium,
        referralFeeKes: estimatedReferralFee
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Home & property insurance quote generated successfully',
      quoteNumber: `REKSA-INS-${quote.id.slice(-6).toUpperCase()}`,
      estimatedAnnualPremiumKes: estimatedAnnualPremium,
      monthlyInstallmentKes: Math.round(estimatedAnnualPremium / 12),
      quote
    });
  } catch (error: any) {
    console.error('Insurance quote API error:', error);
    return NextResponse.json({ error: 'Failed to generate insurance quote' }, { status: 500 });
  }
}
