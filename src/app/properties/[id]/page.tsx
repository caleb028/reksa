import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getFallbackPropertyByIdOrSlug } from '@/lib/fallbackData';
import { TrustScore } from '@/components/ui/TrustScore';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { PropertyPassportView } from '@/components/passport/PropertyPassportView';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import { RentalYieldCard } from '@/components/analytics/RentalYieldCard';
import { RentalIntelligenceCard } from '@/components/analytics/RentalIntelligenceCard';
import { InvestmentIntelligenceCard } from '@/components/analytics/InvestmentIntelligenceCard';
import { PropertyGallery } from '@/components/gallery/PropertyGallery';
import { PropertyInquiryCard } from '@/components/marketplace/PropertyInquiryCard';
import { PrintButton } from '@/components/ui/PrintButton';
import { analyseProperty } from '@/ai/propertyAnalyst';
import { calculatePriceIntelligence } from '@/ai/priceIntelligence';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Layers,
  Building,
  Droplets,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Phone,
  UserCheck,
  Bot,
  Scale,
  Receipt,
  Sparkles,
  Wifi,
  SunMedium
} from 'lucide-react';

interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  let property: any = null;

  try {
    property = await db.property.findUnique({
      where: { id: params.id },
      include: {
        county: true,
        neighbourhood: true,
        images: { orderBy: { orderIndex: 'asc' } },
        passport: true,
        priceHistory: { orderBy: { effectiveYear: 'asc' } },
        amenities: true,
        agent: {
          include: {
            agentProfile: true
          }
        },
        documents: true,
        inspections: {
          include: {
            report: true
          }
        }
      }
    });
  } catch (error) {
    console.warn('[PropertyDetailPage] Database query notice, trying fallback data:', error);
  }

  if (!property) {
    property = getFallbackPropertyByIdOrSlug(params.id);
  }

  if (!property) {
    notFound();
  }

  // Generate real-time explainable AI Analysis
  const aiAnalysis = analyseProperty({
    id: property.id,
    passportId: property.passportId,
    title: property.title,
    propertyType: property.propertyType,
    price: property.price,
    bedrooms: property.bedrooms,
    sizeSqm: property.sizeSqm,
    neighbourhood: property.neighbourhood,
    rentalYieldEstimate: property.rentalYieldEstimate,
    estimatedMonthlyRent: property.estimatedMonthlyRent || property.monthlyRent,
    verificationLevel: property.verificationLevel,
    trustScore: property.trustScore
  });

  // Price intelligence
  const priceIntel = calculatePriceIntelligence(
    property.price,
    property.sizeSqm,
    property.neighbourhood?.medianAskingPrice
  );

  const isRent = property.listingIntent === 'RENT';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb & Top Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
          <span>/</span>
          <Link
            href={isRent ? '/apartments-for-rent' : '/apartments-for-sale'}
            className="hover:text-slate-900 dark:hover:text-white"
          >
            {isRent ? 'Apartments for Rent' : 'Apartments for Sale'}
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900 dark:text-white">{property.county.name}</span>
          <span>/</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400">{property.passportId}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/compare?add=${property.id}`}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>Compare with AI</span>
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* Header Bar: Title, Passport, Verification Badges, Pricing */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="rounded-md bg-slate-950 px-2.5 py-1 text-xs font-mono font-bold text-emerald-400">
              PASSPORT: {property.passportId}
            </span>
            <VerificationBadge level={property.verificationLevel} size="md" />
            <span className={`rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white ${
              isRent ? 'bg-indigo-600' : 'bg-emerald-700'
            }`}>
              {isRent ? 'For Rent' : 'For Sale'}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {property.propertyType}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {property.title}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>
              {property.address} • {property.estate ? `${property.estate}, ` : ''}{property.town}, {property.county.name} County
            </span>
          </div>
        </div>

        <div className="flex flex-col md:items-end">
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">KES</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {property.price.toLocaleString()}
            </span>
            {isRent && <span className="text-xs text-slate-500 font-medium">/month</span>}
          </div>

          {priceIntel.pricePerSqm && !isRent && (
            <span className="text-xs text-slate-500 mt-1">
              Observed: KES {priceIntel.pricePerSqm.toLocaleString()} / sqm
            </span>
          )}

          {property.serviceCharge && (
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
              Service Fee: KES {property.serviceCharge.toLocaleString()}/mo
            </span>
          )}
        </div>
      </div>

      {/* 1. IMMERSIVE PROPERTY PHOTO GALLERY (WITH FULLSCREEN LIGHTBOX) */}
      <PropertyGallery images={property.images} propertyTitle={property.title} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left 2 Columns: Specs, Overview, Intelligence & Passport */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Specs Bar (Including Floor, Block, Size) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Bedrooms</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{property.bedrooms || '—'} Beds</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Bathrooms</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{property.bathrooms || '—'} Baths</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Floor Area</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{property.sizeSqm ? `${property.sizeSqm} sqm` : '—'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Floor / Block</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {property.floorNumber ? `Floor ${property.floorNumber}` : property.apartmentBlock || 'Ground'}
              </span>
            </div>
          </div>

          {/* Property Overview & Verified Building Amenities */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Property Overview</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>

            {/* Verified Building Amenities Highlights */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Verified Building Amenities &amp; Infrastructure
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {property.elevator && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>High-Speed Elevator</span>
                  </div>
                )}
                {property.borehole && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>Borehole Water Supply</span>
                  </div>
                )}
                {property.backupGenerator && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Full Backup Generator</span>
                  </div>
                )}
                {property.swimmingPool && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Swimming Pool</span>
                  </div>
                )}
                {property.gym && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Equipped Gym</span>
                  </div>
                )}
                {property.balcony && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Private Balcony</span>
                  </div>
                )}
                {property.cctv && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>24/7 CCTV &amp; Security</span>
                  </div>
                )}
                {property.solarWaterHeater && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                    <SunMedium className="w-4 h-4 text-amber-500" />
                    <span>Solar Water Heating</span>
                  </div>
                )}
                {property.internetReady && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                    <Wifi className="w-4 h-4 text-indigo-500" />
                    <span>Fiber Internet Ready</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. DEDICATED RENTAL OR INVESTMENT INTELLIGENCE CARD */}
          {isRent ? (
            <RentalIntelligenceCard
              monthlyRent={property.price}
              serviceCharge={property.serviceCharge}
              deposit={property.deposit}
              neighbourhoodAverageRent={property.neighbourhood?.rentalYieldAvg ? Math.round(property.price * 0.98) : undefined}
              rentalYieldEstimate={property.rentalYieldEstimate}
              town={property.town}
              estate={property.estate}
            />
          ) : (
            <InvestmentIntelligenceCard
              price={property.price}
              sizeSqm={property.sizeSqm}
              medianAskingPrice={property.neighbourhood?.medianAskingPrice}
              rentalYieldEstimate={property.rentalYieldEstimate}
              estimatedMonthlyRent={property.estimatedMonthlyRent}
              town={property.town}
              estate={property.estate}
            />
          )}

          {/* 3. DIGITAL PROPERTY PASSPORT */}
          {property.passport && (
            <PropertyPassportView
              passport={property.passport}
              priceHistory={property.priceHistory}
              property={{
                title: property.title,
                propertyType: property.propertyType,
                town: property.town,
                estate: property.estate,
                countyName: property.county.name,
                trustScore: property.trustScore,
                verificationLevel: property.verificationLevel
              }}
            />
          )}

          {/* 4. AI PROPERTY ANALYST BREAKDOWN */}
          <AIInsightCard analysis={aiAnalysis} />

          {/* 5. DUE DILIGENCE CHECKLIST */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                A&E AI Due Diligence Checklist for this Property
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-2">1. Before Viewing</span>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  <li>• Ask for audited service charge statements.</li>
                  <li>• Verify borehole water filtration &amp; backup generator output.</li>
                  <li>• Confirm sectional title mother deed status under SPA 2020.</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-2">2. During Physical Tour</span>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  <li>• Inspect water pressure and shower seal integrity.</li>
                  <li>• Verify parking slot allocation on master architectural plan.</li>
                  <li>• Check natural cross-ventilation and sound insulation.</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-2">3. Pre-Transaction</span>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  <li>• Engage certified ISK valuer / structural inspector.</li>
                  <li>• Execute official ArdhiSasa registry search via legal counsel.</li>
                  <li>• Verify Land Control Board (LCB) or County clearance receipts.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Agent, Inquiry & Price Context */}
        <div className="space-y-6">
          {/* Price Position Widget */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-card">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Price Positioning
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">{isRent ? 'Monthly Rent' : 'Asking Price'}</span>
                <span className="font-bold text-slate-900 dark:text-white">KES {property.price.toLocaleString()}</span>
              </div>
              {property.serviceCharge && (
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Service Charge</span>
                  <span className="font-bold text-slate-900 dark:text-white">KES {property.serviceCharge.toLocaleString()}/mo</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Local Area Median</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  KES {priceIntel.medianAskingPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Market Position</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {priceIntel.marketPosition}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Agent & Viewing Scheduler / Inquiry Card */}
          <PropertyInquiryCard
            propertyId={property.id}
            propertyTitle={property.title}
            organizationId={property.organizationId}
            agent={property.agent ? {
              name: property.agent.name,
              phone: property.agent.phone,
              agencyName: property.agent.agentProfile?.agencyName,
              licenseNumber: property.agent.agentProfile?.licenseNumber
            } : null}
          />

          {/* Professional Independent Inspection Action */}
          <Link
            href="/professionals"
            className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-card hover:border-emerald-500 transition-all dark:border-slate-800 dark:bg-slate-900 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 flex-shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                Book Independent Inspection
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Hire certified ISK valuers or EBK structural engineers
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}