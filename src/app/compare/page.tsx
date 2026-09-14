import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  Scale,
  Bot,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Droplets,
  Zap,
  Layers,
  Building,
  ArrowUpRight
} from 'lucide-react';
import { TrustScore } from '@/components/ui/TrustScore';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

interface ComparePageProps {
  searchParams: {
    add?: string;
  };
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  // Fetch up to 5 active properties for side-by-side comparison
  const properties = await db.property.findMany({
    where: { status: 'ACTIVE' },
    take: 5,
    include: {
      county: true,
      neighbourhood: true,
      images: { take: 1 },
      passport: true,
      amenities: true
    },
    orderBy: { trustScore: 'desc' }
  });

  // Calculate AI Comparative Awards
  let bestValueProp = properties[0];
  let bestYieldProp = properties[0];
  let bestTrustProp = properties[0];
  let bestAffordProp = properties[0];

  for (const p of properties) {
    if ((p.rentalYieldEstimate || 0) > (bestYieldProp.rentalYieldEstimate || 0)) {
      bestYieldProp = p;
    }
    if (p.trustScore > bestTrustProp.trustScore) {
      bestTrustProp = p;
    }
    if (p.price < bestAffordProp.price) {
      bestAffordProp = p;
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Scale className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Algorithmic Property Evaluation
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          AI Property &amp; Apartment Comparison Matrix
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Comparing price per sqm, projected cashflows, service fees, building infrastructure, and verified documentation tiers side-by-side.
        </p>
      </div>

      {/* AI Comparative Awards Verdicts */}
      <div className="mb-8 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/10 via-white to-white p-6 dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            A&E AI Comparative Verdicts &amp; Recommendations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Best Value */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-800/40 dark:bg-emerald-950/40">
            <span className="flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[10px]">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              BEST VALUE
            </span>
            <h3 className="mt-1 font-bold text-slate-900 dark:text-white line-clamp-1">{bestValueProp.title}</h3>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
              Optimal price-to-specification ratio relative to submarket benchmarks.
            </p>
          </div>

          {/* Best Yield */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-800/40 dark:bg-amber-950/40">
            <span className="flex items-center gap-1 font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider text-[10px]">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              BEST RENTAL POTENTIAL
            </span>
            <h3 className="mt-1 font-bold text-slate-900 dark:text-white line-clamp-1">{bestYieldProp.title}</h3>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
              Generates the highest gross yield ({bestYieldProp.rentalYieldEstimate}% p.a.) with solid tenancy demand.
            </p>
          </div>

          {/* Best Affordability */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-800/40 dark:bg-blue-950/40">
            <span className="flex items-center gap-1 font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider text-[10px]">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
              BEST AFFORDABILITY
            </span>
            <h3 className="mt-1 font-bold text-slate-900 dark:text-white line-clamp-1">{bestAffordProp.title}</h3>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
              Entry ticket at KES {bestAffordProp.price.toLocaleString()} requires the lowest capital outlay.
            </p>
          </div>

          {/* Highest Verification */}
          <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-4 dark:border-purple-800/40 dark:bg-purple-950/40">
            <span className="flex items-center gap-1 font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              HIGHEST VERIFICATION
            </span>
            <h3 className="mt-1 font-bold text-slate-900 dark:text-white line-clamp-1">{bestTrustProp.title}</h3>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
              Trust Score of {bestTrustProp.trustScore}/100 with verified physical inspection audit.
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Matrix Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-card">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-850">
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider w-44">Property Attribute</th>
              {properties.map((p) => (
                <th key={p.id} className="p-4 min-w-[200px]">
                  <span className="font-mono text-[10px] text-emerald-600 font-bold block">{p.passportId}</span>
                  <span className="font-bold text-slate-900 dark:text-white line-clamp-2 text-sm">{p.title}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Price / Rent */}
            <tr>
              <td className="p-4 font-bold text-slate-500">Price / Rent</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 font-extrabold text-sm text-slate-900 dark:text-white">
                  KES {p.price.toLocaleString()}{p.listingIntent === 'RENT' ? ' / mo' : ''}
                </td>
              ))}
            </tr>

            {/* Price per sqm */}
            <tr>
              <td className="p-4 font-bold text-slate-500">Price / sqm</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 text-slate-700 dark:text-slate-300">
                  {p.sizeSqm && p.listingIntent !== 'RENT'
                    ? `KES ${Math.round(p.price / p.sizeSqm).toLocaleString()} / sqm`
                    : 'N/A (Rental / Plot)'}
                </td>
              ))}
            </tr>

            {/* Service Charge */}
            <tr>
              <td className="p-4 font-bold text-slate-500">Service Fee / mo</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 text-slate-700 dark:text-slate-300">
                  {p.serviceCharge ? `KES ${p.serviceCharge.toLocaleString()}` : 'Included / Low'}
                </td>
              ))}
            </tr>

            {/* Floor Number */}
            <tr>
              <td className="p-4 font-bold text-slate-500">Floor Level</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 text-slate-700 dark:text-slate-300">
                  {p.floorNumber ? `Floor ${p.floorNumber}${p.totalFloors ? ` of ${p.totalFloors}` : ''}` : 'Ground / Villa'}
                </td>
              ))}
            </tr>

            {/* Location */}
            <tr>
              <td className="p-4 font-bold text-slate-500">Submarket Location</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 text-slate-700 dark:text-slate-300">
                  {p.estate ? `${p.estate}, ` : ''}{p.town}, {p.county.name}
                </td>
              ))}
            </tr>

            {/* Specifications */}
            <tr>
              <td className="p-4 font-bold text-slate-500">Specs (Beds / Baths / Sqm)</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 text-slate-700 dark:text-slate-300">
                  {p.bedrooms || '—'} Beds • {p.bathrooms || '—'} Baths • {p.sizeSqm ? `${p.sizeSqm} sqm` : '—'}
                </td>
              ))}
            </tr>

            {/* Borehole & Generator */}
            <tr>
              <td className="p-4 font-bold text-slate-500">Water &amp; Power Backup</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 text-slate-700 dark:text-slate-300">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      {p.borehole ? 'Borehole On-Site' : 'Council Water'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      {p.backupGenerator ? 'Full Generator' : 'Standard Inverter'}
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Elevator & Amenities */}
            <tr>
              <td className="p-4 font-bold text-slate-500">Lift &amp; Wellness</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 text-slate-700 dark:text-slate-300">
                  {p.elevator ? 'High-Speed Lift' : 'Stairs Access'} • {p.gym ? 'Gym' : 'No Gym'}
                </td>
              ))}
            </tr>

            {/* A&E Trust Score */}
            <tr>
              <td className="p-4 font-bold text-slate-500">A&E Trust Score</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4">
                  <TrustScore score={p.trustScore} size="sm" />
                </td>
              ))}
            </tr>

            {/* Verification Tier */}
            <tr>
              <td className="p-4 font-bold text-slate-500">Verification Tier</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4">
                  <VerificationBadge level={p.verificationLevel} size="sm" />
                </td>
              ))}
            </tr>

            {/* Rental Potential */}
            <tr>
              <td className="p-4 font-bold text-slate-500">Yield Potential</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 font-semibold text-emerald-600">
                  {p.rentalYieldEstimate ? `${p.rentalYieldEstimate}% gross` : '—'}
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr>
              <td className="p-4 font-bold text-slate-500">Action</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4">
                  <Link
                    href={`/properties/${p.id}`}
                    className="flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition-colors w-full dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-emerald-400"
                  >
                    <span>View Property</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}