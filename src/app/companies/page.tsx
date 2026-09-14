import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  Building2,
  MapPin,
  ShieldCheck,
  Award,
  Users,
  Search,
  CheckCircle2,
  ArrowRight,
  Filter,
  Sparkles,
  Phone
} from 'lucide-react';
import { TrustScore } from '@/components/ui/TrustScore';

interface CompanyDiscoveryProps {
  searchParams: {
    q?: string;
    county?: string;
    type?: string;
    verified?: string;
  };
}

export default async function CompanyDiscoveryPage({ searchParams }: CompanyDiscoveryProps) {
  const { q, county, type, verified } = searchParams;

  const where: any = {};

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { town: { contains: q } }
    ];
  }

  if (county && county !== 'ALL') {
    where.county = { contains: county };
  }

  if (type && type !== 'ALL') {
    where.businessType = type;
  }

  if (verified === 'true') {
    where.verificationStatus = 'VERIFIED';
  }

  const companies = await db.organization.findMany({
    where,
    include: {
      _count: {
        select: {
          properties: true,
          developments: true,
          members: true
        }
      },
      properties: {
        where: { status: 'ACTIVE' },
        take: 2,
        select: {
          id: true,
          title: true,
          price: true,
          town: true
        }
      }
    },
    orderBy: { trustScore: 'desc' }
  });

  const counties = [
    'ALL',
    'Nairobi',
    'Kiambu',
    'Mombasa',
    'Machakos',
    'Kajiado',
    'Nakuru',
    'Uasin Gishu',
    'Kilifi',
    'Kisumu'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header Banner */}
      <div className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <Building2 className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                A&E Stores &amp; Agencies Directory
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Find Verified Real Estate Companies
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Discover licensed agencies, property developers, and registered management firms across Kenya. Every company features an independent Trust Score, official team credentials, and verified inventory passports.
            </p>
          </div>

          {/* Quick Filter Bar */}
          <form className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2 relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={q || ''}
                placeholder="Search agency name, town or specialty..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <select
                name="county"
                defaultValue={county || 'ALL'}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="ALL">All 47 Counties</option>
                {counties.filter(c => c !== 'ALL').map(c => (
                  <option key={c} value={c}>{c} County</option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Companies</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Companies Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Showing {companies.length} real estate {companies.length === 1 ? 'business' : 'businesses'}
          </span>

          <Link
            href="/onboarding/business"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
          >
            <span>Register your agency</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {companies.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Companies Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No real estate firms match your filter criteria. Try resetting your search parameters.
            </p>
            <Link
              href="/companies"
              className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((co) => (
              <div
                key={co.id}
                className="group flex flex-col rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-card hover:-translate-y-1 hover:shadow-premium transition-all duration-300 dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Cover Image */}
                <div className="relative h-28 w-full bg-slate-800 overflow-hidden">
                  <img
                    src={co.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'}
                    alt={co.name}
                    className="h-full w-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <TrustScore score={co.trustScore} size="sm" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 -mt-10 mb-3 relative z-10">
                    <div className="h-14 w-14 rounded-2xl border-2 border-white bg-white p-1 shadow-md dark:border-slate-800 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <img
                        src={co.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=100&q=80'}
                        alt={co.name}
                        className="h-full w-full object-contain rounded-xl"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                        <span>{co.name}</span>
                        {co.verificationStatus === 'VERIFIED' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {co.businessType.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {co.description || 'Professional real estate enterprise operating in Kenya with verified property inventory.'}
                  </p>

                  {/* Location & Stats */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{co.town || co.county || 'Nairobi'}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono font-bold text-slate-700 dark:text-slate-300">
                      <span>{co._count.properties} Listings</span>
                      <span>•</span>
                      <span>{co._count.members} Agents</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/companies/${co.slug}`}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-2.5 text-xs font-bold text-white group-hover:bg-emerald-700 transition-colors dark:bg-slate-800 dark:group-hover:bg-emerald-700 shadow-xs"
                  >
                    <span>Visit A&E Store</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
