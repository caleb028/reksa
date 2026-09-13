'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  BarChart3,
  Download,
  ShieldCheck,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  FileText,
  Lock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';
import { useApp } from '@/components/layout/AppProviders';

interface SubmarketBenchmark {
  submarket: string;
  county: string;
  assetClass: 'Residential' | 'Commercial' | 'Land' | 'Industrial';
  avgPriceSqmKes: number;
  rentalYieldPercent: number;
  occupancyPercent: number;
  capitalAppreciation1Y: number;
  riskRating: 'A+' | 'A' | 'B+' | 'B';
}

const SUBMARKET_DATA: SubmarketBenchmark[] = [
  {
    submarket: 'Westlands / Parklands',
    county: 'Nairobi',
    assetClass: 'Residential',
    avgPriceSqmKes: 145000,
    rentalYieldPercent: 8.4,
    occupancyPercent: 89,
    capitalAppreciation1Y: 7.8,
    riskRating: 'A+'
  },
  {
    submarket: 'Kilimani / Kileleshwa',
    county: 'Nairobi',
    assetClass: 'Residential',
    avgPriceSqmKes: 118000,
    rentalYieldPercent: 8.9,
    occupancyPercent: 92,
    capitalAppreciation1Y: 6.4,
    riskRating: 'A'
  },
  {
    submarket: 'Riverside Drive',
    county: 'Nairobi',
    assetClass: 'Residential',
    avgPriceSqmKes: 162000,
    rentalYieldPercent: 7.8,
    occupancyPercent: 86,
    capitalAppreciation1Y: 8.1,
    riskRating: 'A+'
  },
  {
    submarket: 'Upper Hill',
    county: 'Nairobi',
    assetClass: 'Commercial',
    avgPriceSqmKes: 175000,
    rentalYieldPercent: 9.6,
    occupancyPercent: 84,
    capitalAppreciation1Y: 5.2,
    riskRating: 'A'
  },
  {
    submarket: 'Karen / Langata',
    county: 'Nairobi',
    assetClass: 'Residential',
    avgPriceSqmKes: 135000,
    rentalYieldPercent: 6.5,
    occupancyPercent: 95,
    capitalAppreciation1Y: 9.4,
    riskRating: 'A+'
  },
  {
    submarket: 'Ruiru / Juja Corridor',
    county: 'Kiambu',
    assetClass: 'Land',
    avgPriceSqmKes: 48000,
    rentalYieldPercent: 10.2,
    occupancyPercent: 94,
    capitalAppreciation1Y: 14.2,
    riskRating: 'A'
  },
  {
    submarket: 'Nyali / Shanzu',
    county: 'Mombasa',
    assetClass: 'Residential',
    avgPriceSqmKes: 125000,
    rentalYieldPercent: 10.4,
    occupancyPercent: 79,
    capitalAppreciation1Y: 8.9,
    riskRating: 'B+'
  },
  {
    submarket: 'Tatu City / Ruiru Industrial',
    county: 'Kiambu',
    assetClass: 'Industrial',
    avgPriceSqmKes: 65000,
    rentalYieldPercent: 11.0,
    occupancyPercent: 97,
    capitalAppreciation1Y: 12.5,
    riskRating: 'A+'
  },
  {
    submarket: 'Syokimau / Athi River',
    county: 'Machakos',
    assetClass: 'Residential',
    avgPriceSqmKes: 78000,
    rentalYieldPercent: 9.1,
    occupancyPercent: 93,
    capitalAppreciation1Y: 7.2,
    riskRating: 'A'
  }
];

const QUARTERLY_REPORTS = [
  {
    id: 'rep-q3-2026',
    title: 'Kenya Real Estate Market Report Q3 2026',
    subtitle: 'Nairobi Metropolitan & Coastal corridors yield analysis and transaction velocities',
    fileSize: '3.8 MB',
    date: 'September 2026',
    pages: 42,
    premiumOnly: false
  },
  {
    id: 'rep-kmrc-2026',
    title: 'Affordable Housing & KMRC 9.5% Impact Study',
    subtitle: 'Assessing buyer uptake of subsidized residential debt in Satellite Nairobi',
    fileSize: '2.4 MB',
    date: 'August 2026',
    pages: 28,
    premiumOnly: false
  },
  {
    id: 'rep-diaspora-2026',
    title: 'Kenyan Diaspora Property Investment Flow 2026',
    subtitle: 'UK, US & Gulf capital allocations in title-verified commercial and land assets',
    fileSize: '4.1 MB',
    date: 'July 2026',
    pages: 36,
    premiumOnly: true
  },
  {
    id: 'rep-hospitality-2026',
    title: 'Mombasa & Diani Coastal Serviced Apartments Yields',
    subtitle: 'Short-term rental ADR benchmarks and occupancy seasonality across the Swahili Coast',
    fileSize: '3.1 MB',
    date: 'June 2026',
    pages: 32,
    premiumOnly: true
  }
];

export default function MarketReportsPage() {
  const { notify } = useApp();
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);

  const filteredSubmarkets = SUBMARKET_DATA.filter((item) => {
    const matchesAsset = selectedAssetClass === 'All' || item.assetClass === selectedAssetClass;
    const matchesSearch =
      item.submarket.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.county.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAsset && matchesSearch;
  });

  const handleDownload = (report: (typeof QUARTERLY_REPORTS)[0]) => {
    setDownloadingReport(report.id);
    setTimeout(() => {
      setDownloadingReport(null);
      notify(
        'Report Downloaded',
        `'${report.title}' has been downloaded to your device.`,
        'success'
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header Banner */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-3">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>REKSA Institutional Intelligence Division</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Kenya Property Market Reports &amp; Submarket Benchmarks
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Objective transactional intelligence, rental yield matrices, and title-verified price indices across Nairobi Metropolitan, Kiambu, Machakos, and the Coastal economic corridor.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/tools/investment"
                className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-xs"
              >
                <span>Investment Yield Calculator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/tools/affordability"
                className="inline-flex items-center gap-2 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Bank Pre-Qualification</span>
              </Link>
            </div>
          </div>

          {/* Key Macro Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Nairobi Prime Yield
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">8.4%</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> +0.6% YoY
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Westlands &amp; Kilimani multi-units</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                KMRC Subsidized Debt
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">9.5%</span>
                <span className="text-xs font-bold text-emerald-600">Fixed Rate</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Properties &le; KES 8.0M threshold</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Commercial Office Yield
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">9.6%</span>
                <span className="text-xs font-bold text-slate-500">Stable</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Upper Hill &amp; Riverside Grade-A</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Satellite Land Index
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-purple-700 dark:text-purple-400">+14.2%</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> 1Y Growth
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Ruiru, Juja &amp; Thika Road corridor</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Submarket Matrix & Reports */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Section 1: Submarket Benchmark Table */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Submarket Yield &amp; Pricing Benchmark Matrix</span>
              </h2>
              <p className="text-xs text-slate-500">
                Aggregated from 1,200+ verified transaction records and certified valuer returns.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by submarket / county..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs w-48 sm:w-60 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800 p-1 rounded-xl">
                {['All', 'Residential', 'Commercial', 'Land', 'Industrial'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedAssetClass(type)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedAssetClass === type
                        ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[10.5px] uppercase font-bold text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Submarket Corridor</th>
                    <th className="py-3.5 px-3">Asset Class</th>
                    <th className="py-3.5 px-3 text-right">Avg Price / Sqm</th>
                    <th className="py-3.5 px-3 text-right">Gross Rental Yield</th>
                    <th className="py-3.5 px-3 text-right">Occupancy Rate</th>
                    <th className="py-3.5 px-3 text-right">1Y Appreciation</th>
                    <th className="py-3.5 px-4 text-center">Risk Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSubmarkets.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <div>{item.submarket}</div>
                        <span className="text-[10px] text-slate-400 font-normal">{item.county} County</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          {item.assetClass}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                        KES {item.avgPriceSqmKes.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-emerald-700 dark:text-emerald-400">
                        {item.rentalYieldPercent.toFixed(1)}% p.a.
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                        {item.occupancyPercent}%
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        +{item.capitalAppreciation1Y.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            item.riskRating === 'A+'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.riskRating === 'A'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {item.riskRating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 2: Downloadable Institutional Reports */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>Quarterly Market Research Publications</span>
            </h2>
            <p className="text-xs text-slate-500">
              In-depth macroeconomic and submarket briefings prepared by REKSA research analysts for institutional funds, developers, and commercial lenders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QUARTERLY_REPORTS.map((rep) => (
              <div
                key={rep.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      {rep.date} • {rep.pages} Pages • {rep.fileSize}
                    </span>
                    {rep.premiumOnly ? (
                      <span className="rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 text-[9px] font-bold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Institutional Access
                      </span>
                    ) : (
                      <span className="rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[9px] font-bold">
                        Open Access
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {rep.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {rep.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Certified REKSA Data</span>
                  </div>
                  <button
                    onClick={() => handleDownload(rep)}
                    disabled={downloadingReport === rep.id}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition-colors disabled:opacity-70"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingReport === rep.id ? 'Generating...' : 'Download Briefing'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: B2B API Integration Banner */}
        <section className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-forest-950 via-forest-900 to-slate-950 text-white p-8 shadow-xl">
          <div className="max-w-3xl">
            <span className="text-gold-400 text-xs font-mono font-bold uppercase tracking-wider block mb-1">
              REKSA Verification-as-a-Service (VaaS) API
            </span>
            <h3 className="text-2xl font-black tracking-tight text-white">
              Direct Cadastral &amp; Title Verification for Banks &amp; SACCOs
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Programmatically query title document presence, GPS cadastral boundary records, valuer structural reports, and statutory risk ratings inside your loan origination workflow.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/api/v1/verify/property/MLT-NBI-008421?apiKey=reksa_vaas_demo_partner"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 px-4 py-2 text-xs font-bold shadow-md transition-colors"
              >
                <span>Try Live B2B API Endpoint</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/professionals"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-bold text-white transition-colors"
              >
                <span>Conveyancing Partner Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
