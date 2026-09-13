import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [pricingRules, volumeDiscounts, promotionPlans] = await Promise.all([
      db.pricingRule.findMany({
        where: { isActive: true },
        orderBy: { baseFeeKes: 'asc' }
      }),
      db.volumeDiscount.findMany({
        where: { isActive: true },
        orderBy: { minListings: 'asc' }
      }),
      db.promotionPlan.findMany({
        where: { isActive: true },
        orderBy: { priceKes: 'asc' }
      })
    ]);

    const subscriptionPlans = [
      {
        code: 'STARTER',
        name: 'Starter Agent Store',
        priceKes: 1500,
        billingCycle: 'Monthly',
        listingLimit: 10,
        agentLimit: 2,
        features: [
          'Up to 10 Active Listings',
          'Company Profile & Storefront',
          'Lead Notification Pipeline',
          'Standard Support'
        ]
      },
      {
        code: 'PROFESSIONAL',
        name: 'Professional Agency',
        priceKes: 3500,
        billingCycle: 'Monthly',
        listingLimit: 35,
        agentLimit: 5,
        popular: true,
        features: [
          'Up to 35 Active Listings',
          'Digital Company Storefront',
          '5 Agent Team Accounts',
          '15% Volume Discount on Boosts',
          'CRM Kanban Lead Management',
          'Dedicated Account Representative'
        ]
      },
      {
        code: 'BUSINESS',
        name: 'Business Agency OS',
        priceKes: 7500,
        billingCycle: 'Monthly',
        listingLimit: 100,
        agentLimit: 15,
        features: [
          'Up to 100 Active Listings',
          'Multi-Branch Storefront',
          '15 Agent Team Accounts',
          '30% Volume Listing Discount',
          'Full Commercial Revenue Analytics',
          'Priority Customer Inquiries',
          'API Data Export'
        ]
      },
      {
        code: 'ENTERPRISE',
        name: 'Enterprise Developer',
        priceKes: 15000,
        billingCycle: 'Monthly',
        listingLimit: 500,
        agentLimit: 50,
        features: [
          'Unlimited Active Listings & Units',
          'Master Development Showcase Hub',
          '50 Team Members & Valuers',
          '45% Volume Listing Discount',
          'Custom Branding & Analytics',
          'Dedicated Technical Lead'
        ]
      }
    ];

    return NextResponse.json({
      success: true,
      pricingRules,
      volumeDiscounts,
      promotionPlans,
      subscriptionPlans
    });
  } catch (error: any) {
    console.error('Pricing API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve pricing catalog' }, { status: 500 });
  }
}
