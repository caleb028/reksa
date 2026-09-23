import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  Sparkles,
  Bot,
  MapPin,
  TrendingUp,
  Building2,
  CheckCircle,
  FileCheck,
  Scale,
  Award,
  ArrowRight,
  Hammer,
  KeyRound,
  Droplets,
  Zap,
  Layers,
  ArrowUpRight,
  Calculator,
  UserCheck
} from 'lucide-react';
import { db } from '@/lib/db';
import { KENYA_COUNTIES } from '@/lib/constants/kenya';
import { FALLBACK_PROPERTIES } from '@/lib/fallbackData';
import { HeroSlideshow } from '@/components/ui/HeroSlideshow';
import { MegaSearch } from '@/components/search/MegaSearch';
import { MarketplaceShowcase } from '@/components/marketplace/MarketplaceShowcase';
import { TrustScore } from '@/components/ui/TrustScore';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { AnimatedCounter } from '@/components/motion/MotionPrimitives';

export default async function HomePage() {
  let totalProperties = 10;
  let totalApartments = 5;
  let totalDevelopments = 1;
  let totalCounties = 47;
  let apartmentsForSale: any[] = [];
  let apartmentsForRent: any[] = [];
  let featuredVerified: any[] = [];
  let developments: any[] = [];
  let neighbourhoods: any[] = [];
  let professionals: any[] = [];

  try {
    const stats = await Promise.all([
      db.property.count({ where: { status: 'ACTIVE' } }),
      db.property.count({ where: { status: 'ACTIVE', propertyType: { in: ['Apartment', 'Penthouse', 'Studio'] } } }),
      db.development.count(),
      db.county.count(),
    ]);
    totalProperties = stats[0];
    totalApartments = stats[1];
    totalDevelopments = stats[2];
    totalCounties = stats[3];

    // Query featured apartments for sale
    apartmentsForSale = await db.property.findMany({
      where: {
        status: 'ACTIVE',
        listingIntent: 'SALE',
        propertyType: { in: ['Apartment', 'Penthouse', 'Studio'] }
      },
      take: 3,
      include: {
        county: true,
        neighbourhood: true,
        images: { take: 1, orderBy: { orderIndex: 'asc' } },
        passport: true,
        organization: { select: { name: true, slug: true } },
        agent: { select: { name: true } },
        assignedAgentMember: { include: { user: { select: { name: true } } } }
      },
      orderBy: { trustScore: 'desc' }
    });

    // Query popular apartments for rent
    apartmentsForRent = await db.property.findMany({
      where: {
        status: 'ACTIVE',
        listingIntent: 'RENT',
        propertyType: { in: ['Apartment', 'Penthouse', 'Studio'] }
      },
      take: 3,
      include: {
        county: true,
        neighbourhood: true,
        images: { take: 1, orderBy: { orderIndex: 'asc' } },
        passport: true,
        organization: { select: { name: true, slug: true } },
        agent: { select: { name: true } },
        assignedAgentMember: { include: { user: { select: { name: true } } } }
      },
      orderBy: { rentalYieldEstimate: 'desc' }
    });

    // Query top verified flagship properties
    featuredVerified = await db.property.findMany({
      where: { status: 'ACTIVE', verificationLevel: { gte: 3 } },
      take: 3,
      include: {
        county: true,
        neighbourhood: true,
        images: { take: 1, orderBy: { orderIndex: 'asc' } },
        passport: true,
        organization: { select: { name: true, slug: true } },
        agent: { select: { name: true } },
        assignedAgentMember: { include: { user: { select: { name: true } } } }
      },
      orderBy: { trustScore: 'desc' }
    });

    // Query developments
    developments = await db.development.findMany({
      take: 2,
      include: {
        county: true,
        neighbourhood: true,
        progressUpdates: true,
        units: true
      }
    });

    // Query popular neighbourhoods
    neighbourhoods = await db.neighbourhood.findMany({
      take: 4,
      include: {
        county: true
      }
    });

    // Query verified professionals
    professionals = await db.professional.findMany({
      take: 3,
      include: {
        user: true,
        services: true
      }
    });
  } catch (error) {
    console.warn('[HomePage] Database query notice, using fallback records:', error);
  }

  // Ensure fallbacks if database was empty
  if (!apartmentsForSale || apartmentsForSale.length === 0) {
    apartmentsForSale = FALLBACK_PROPERTIES.filter(
      (p) => p.status === 'ACTIVE' && p.listingIntent === 'SALE' && ['Apartment', 'Penthouse', 'Studio'].includes(p.propertyType)
    ).slice(0, 3);
  }
  if (!apartmentsForRent || apartmentsForRent.length === 0) {
    apartmentsForRent = FALLBACK_PROPERTIES.filter(
      (p) => p.status === 'ACTIVE' && p.listingIntent === 'RENT' && ['Apartment', 'Penthouse', 'Studio'].includes(p.propertyType)
    ).slice(0, 3);
  }
  if (!featuredVerified || featuredVerified.length === 0) {
    featuredVerified = FALLBACK_PROPERTIES.filter((p) => p.verificationLevel >= 3).slice(0, 3);
  }

  const mapToApartmentItem = (item: any) => ({
    id: item.id,
    passportId: item.passportId,
    title: item.title,
    slug: item.slug,
    propertyType: item.propertyType,
    listingIntent: item.listingIntent,
    price: item.price,
    monthlyRent: item.monthlyRent,
    serviceCharge: item.serviceCharge,
    rentalYieldEstimate: item.rentalYieldEstimate,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    sizeSqm: item.sizeSqm,
    floorNumber: item.floorNumber,
    totalFloors: item.totalFloors,
    parkingSpaces: item.parkingSpaces,
    balcony: item.balcony,
    elevator: item.elevator,
    borehole: item.borehole,
    backupGenerator: item.backupGenerator,
    swimmingPool: item.swimmingPool,
    gym: item.gym,
    completionStatus: item.completionStatus,
    furnishingStatus: item.furnishingStatus,
    town: item.town,
    estate: item.estate,
    countyName: item.county.name,
    trustScore: item.trustScore,
    verificationLevel: item.verificationLevel,
    imageUrl: item.images[0]?.url,
    isFeatured: item.isFeatured,
    sellerType: item.sellerType,
    organizationName: item.organization?.name,
    organizationSlug: item.organization?.slug,
    agentName: item.assignedAgentMember?.user?.name || item.agent?.name
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SLIDESHOW */}
      <HeroSlideshow />

      {/* 2. GLOBAL MEGA SEARCH & KEY PLATFORM INTELLIGENCE */}
      <section className="relative z-30 -mt-16 sm:-mt-20 px-4 sm:px-6 lg:px-8 mb-12">
        <MegaSearch />

        {/* Real Estate Platform Intelligence Counters */}
        <div className="mt-8 mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white/90 p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-md">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
            <div className="pt-2 sm:pt-0">
              <span className="block text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                <AnimatedCounter value={totalCounties || 47} suffix=" Counties" />
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Spatial Coverage</span>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-6">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                <AnimatedCounter value={totalProperties} suffix=" Listings" />
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Verified Properties</span>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-6">
              <span className="block text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 tracking-tight">
                <AnimatedCounter value={totalApartments} suffix=" Units" />
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Apartment Portfolios</span>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-6">
              <span className="block text-2xl sm:text-3xl font-black text-[#c59228] tracking-tight">
                <AnimatedCounter value={totalDevelopments} suffix=" Projects" />
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Master Developments</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. UNIFIED MARKETPLACE SHOWCASE (TABBED) */}
      <MarketplaceShowcase
        flagships={featuredVerified.map(mapToApartmentItem)}
        saleApartments={apartmentsForSale.map(mapToApartmentItem)}
        rentApartments={apartmentsForRent.map(mapToApartmentItem)}
      />

      {/* 7. POPULAR NEIGHBOURHOODS */}
      <section className="bg-slate-950 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                Micro-Market Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Kenya’s Top Residential Estates
              </h2>
            </div>
            <Link href="/neighbourhoods" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
              View All 47 Counties Hub →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {neighbourhoods.map((n) => (
              <Link
                key={n.id}
                href={`/neighbourhoods?name=${n.name}`}
                className="group rounded-2xl border border-slate-800 bg-slate-900/90 p-5 transition-all hover:border-emerald-500/50 hover:bg-slate-850 shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-md bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    {n.county.name}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {n.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                  {n.description}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                  <span>Median: KES {(n.medianAskingPrice / 1000000).toFixed(1)}M</span>
                  <span className="text-emerald-400 font-bold">{n.rentalYieldAvg}% Yield</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. NEW DEVELOPMENTS & CONSTRUCTION MILESTONES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Hammer className="w-4 h-4" />
              <span>Off-Plan Milestone Tracking</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Verified Developer Projects
            </h2>
            <p className="mt-1 text-xs text-slate-500 max-w-xl">
              Track multi-stage construction progress verified by licensed EBK engineers and ISK quantity surveyors.
            </p>
          </div>

          <Link href="/developments" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
            View All Developments →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {developments.map((dev) => (
            <div
              key={dev.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-card"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {dev.expectedCompletion ? `Expected ${dev.expectedCompletion}` : 'In Progress'}
                </span>
                <span className="text-xs text-slate-500">{dev.town}, {dev.county.name}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{dev.name}</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{dev.description}</p>

              {/* Progress Bar */}
              <div className="mt-5">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-600 dark:text-slate-300">Verified Construction Completion</span>
                  <span className="text-emerald-600 font-extrabold">{dev.overallProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full"
                    style={{ width: `${dev.overallProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  From KES {(dev.startingPrice / 1000000).toFixed(1)}M
                </span>
                <Link
                  href="/developments"
                  className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors dark:bg-slate-100 dark:text-slate-900"
                >
                  Track Project
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. HOW A&E WORKS: DATA -> VERIFICATION -> INTELLIGENCE -> DECISION */}
      <section className="bg-slate-950 text-white py-16 border-y border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#c59228] block mb-2">
            The A&E Operating Standard
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            How A&E (Ardhi &amp; Estates) Works
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
            A standard property portal answers &quot;What is available?&quot; A&E answers &quot;Is it trustworthy, what is it worth, and should you invest?&quot;
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="rounded-2xl border border-blue-900/60 bg-blue-950/30 p-6 backdrop-blur-sm">
              <span className="text-2xl font-mono font-black text-[#c59228] block mb-3">01</span>
              <h3 className="text-base font-bold text-white mb-2">DATA SEARCH</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We ingest cadastral GIS coordinates, sectional survey plans, building specs, and historical lease records across all 47 Kenyan counties.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-900/60 bg-blue-950/30 p-6 backdrop-blur-sm">
              <span className="text-2xl font-mono font-black text-[#c59228] block mb-3">02</span>
              <h3 className="text-base font-bold text-white mb-2">VERIFICATION</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Independent structural engineers, certified ISK valuers, and surveyors conduct multi-point physical site and documentation audits.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-900/60 bg-blue-950/30 p-6 backdrop-blur-sm">
              <span className="text-2xl font-mono font-black text-[#c59228] block mb-3">03</span>
              <h3 className="text-base font-bold text-white mb-2">INTELLIGENCE</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our algorithmic engine models 7 dimensions: Investment, Affordability, Rental Yield, Value Range, Submarket Trend, and Risk Signals.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-900/60 bg-blue-950/30 p-6 backdrop-blur-sm">
              <span className="text-2xl font-mono font-black text-[#c59228] block mb-3">04</span>
              <h3 className="text-base font-bold text-white mb-2">DECISION</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You receive a tamper-evident digital Property Passport empowering you to buy, lease, or finance with complete transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. AI PROPERTY ADVISOR CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden dark:border-slate-800">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-300 mb-4">
              <Bot className="w-4 h-4 text-[#c59228]" />
              <span>A&E Conversational Real Estate Intelligence</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Have Questions About a Property or Submarket?
            </h2>

            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Ask A&E AI to calculate rental yields, check verification tiers, compare prices per square metre, or generate due diligence checklists.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/ai-advisor"
                className="rounded-2xl bg-[#0a3871] hover:bg-[#0c4387] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition-colors border border-blue-400/30"
              >
                Chat with A&E AI Advisor
              </Link>
              <Link
                href="/tools/investment"
                className="rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Launch Investment Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}