import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  ShieldCheck,
  Award,
  Layers,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { TrustScore } from '@/components/ui/TrustScore';

interface Props {
  params: {
    slug: string;
  };
}

export default async function DeveloperProfilePage({ params }: Props) {
  const { slug } = params;

  const devOrg = await db.organization.findFirst({
    where: {
      slug,
      businessType: 'DEVELOPER'
    },
    include: {
      developments: {
        include: {
          county: true,
          neighbourhood: true,
          units: true,
          progressUpdates: {
            orderBy: { recordedDate: 'desc' },
            take: 3
          }
        }
      }
    }
  });

  if (!devOrg) {
    notFound();
  }

  const developments = devOrg.developments;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* 1. HERO BANNER */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-900">
        <img
          src={devOrg.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80'}
          alt={devOrg.name}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
      </div>

      {/* 2. DEVELOPER HEADER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-28 relative z-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-2 border-white dark:border-slate-800 bg-white p-2 shadow-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img
                  src={devOrg.logo || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=200&q=80'}
                  alt={devOrg.name}
                  className="h-full w-full object-contain rounded-xl"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {devOrg.verificationBadge || 'REKSA VERIFIED DEVELOPER'}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Institutional Developer
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {devOrg.name}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{devOrg.address || `${devOrg.town}, ${devOrg.county} County`}</span>
                  </div>
                  {devOrg.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{devOrg.phone}</span>
                    </div>
                  )}
                  {devOrg.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{devOrg.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 dark:border-slate-800">
              <div className="text-center">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">Developer Trust</span>
                <TrustScore score={devOrg.trustScore} size="md" />
              </div>

              {devOrg.phone && (
                <a
                  href={`tel:${devOrg.phone}`}
                  className="rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
                >
                  Contact Developer
                </a>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {devOrg.description ||
                'Award-winning institutional property developer delivering high-yield residential communities with transparent milestone audits, sectional titles, and modern urban design.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. DEVELOPMENTS PORTFOLIO */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>Developments &amp; Master Projects</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Off-plan and active projects with live construction progress updates</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">{developments.length} Projects</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {developments.map((dev) => (
            <div
              key={dev.id}
              className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-card dark:border-slate-800 dark:bg-slate-900 flex flex-col"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={dev.coverImage}
                  alt={dev.name}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                    {dev.stage}
                  </span>
                  <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-mono font-bold text-white backdrop-blur-md">
                    {dev.overallProgress}% Complete
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs text-slate-500 font-medium">
                      {dev.estate ? `${dev.estate}, ` : ''}{dev.town}, {dev.county.name}
                    </span>
                    <span className="text-xs font-mono text-emerald-600 font-bold">
                      Handover: {dev.expectedCompletion}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{dev.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    {dev.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[11px] font-bold mb-1 text-slate-700 dark:text-slate-300">
                      <span>Construction Milestone</span>
                      <span className="font-mono text-emerald-600">{dev.overallProgress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full"
                        style={{ width: `${dev.overallProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Available Units Grid */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs py-3 border-y border-slate-100 dark:border-slate-800 mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Starting Price</span>
                      <span className="font-black text-slate-900 dark:text-white">KES {dev.startingPrice.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Available Inventory</span>
                      <span className="font-black text-emerald-600">{dev.availableUnits} of {dev.totalUnits} Units</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/developments/${dev.slug}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white py-3 text-xs font-bold text-white dark:text-slate-900 hover:bg-emerald-700 dark:hover:bg-slate-100 transition-colors"
                >
                  <span>View Development Units &amp; Floor Plans</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
