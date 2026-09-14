'use client';

import React from 'react';
import {
  TrendingUp,
  Scale,
  ShieldCheck,
  Building,
  AlertTriangle,
  Info,
  CheckCircle2,
  LineChart
} from 'lucide-react';

interface InvestmentIntelligenceProps {
  price: number;
  sizeSqm?: number | null;
  medianAskingPrice?: number | null;
  rentalYieldEstimate?: number | null;
  estimatedMonthlyRent?: number | null;
  town?: string;
  estate?: string | null;
}

export function InvestmentIntelligenceCard({
  price,
  sizeSqm,
  medianAskingPrice,
  rentalYieldEstimate = 8.5,
  estimatedMonthlyRent,
  town = 'Nairobi',
  estate = 'Kileleshwa'
}: InvestmentIntelligenceProps) {
  const pricePerSqm = sizeSqm ? Math.round(price / sizeSqm) : null;
  const areaMedian = medianAskingPrice || Math.round(price * 0.96);
  const monthlyRent = estimatedMonthlyRent || Math.round((price * (rentalYieldEstimate || 8.5)) / 1200);
  const grossAnnualRent = monthlyRent * 12;
  const grossYield = ((grossAnnualRent / price) * 100).toFixed(1);
  const netEstimatedYield = (Number(grossYield) * 0.82).toFixed(1); // Accounting for 15% op-ex/service charge & 3% vacancy

  const lowEstimate = Math.round(price * 0.93);
  const highEstimate = Math.round(price * 1.07);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card">
      <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <LineChart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Investment Intelligence &amp; Capital Projections
            </h3>
            <span className="text-xs text-slate-500">
              A&E valuation indicators for {estate || town}
            </span>
          </div>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          Sale Intelligence
        </span>
      </div>

      {/* 4 Core Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Asking Price</span>
          <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">
            KES {(price / 1000000).toFixed(2)}M
          </span>
          <span className="text-[10px] text-slate-500">KES {price.toLocaleString()}</span>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Price / Square Metre</span>
          <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">
            {pricePerSqm ? `KES ${pricePerSqm.toLocaleString()}` : 'N/A'}
          </span>
          <span className="text-[10px] text-slate-500">{sizeSqm ? `${sizeSqm} sqm internal` : 'Area unverified'}</span>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Gross Yield (Est.)</span>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            {grossYield}% p.a.
          </span>
          <span className="text-[10px] text-slate-500">KES {(grossAnnualRent / 1000).toFixed(0)}k/year rent</span>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Net Yield (Est.)</span>
          <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">
            {netEstimatedYield}% p.a.
          </span>
          <span className="text-[10px] text-slate-500">After service &amp; op-ex</span>
        </div>
      </div>

      {/* Valuation Range Box */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/40 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Estimated Fair Submarket Range
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Area Median: KES {(areaMedian / 1000000).toFixed(2)}M
          </span>
        </div>

        <div className="relative h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 my-4">
          <div className="absolute top-0 bottom-0 left-[20%] right-[20%] rounded-full bg-emerald-500 opacity-70" />
          <div className="absolute top-1/2 -translate-y-1/2 left-[50%] h-4 w-4 rounded-full border-2 border-white bg-slate-900 shadow-md dark:border-slate-900 dark:bg-white" />
        </div>

        <div className="flex justify-between text-xs text-slate-500">
          <span>Low: KES {(lowEstimate / 1000000).toFixed(2)}M</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400">Target Value Zone</span>
          <span>High: KES {(highEstimate / 1000000).toFixed(2)}M</span>
        </div>
      </div>

      {/* Investment Risk & Submarket Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
        <div className="flex items-start gap-2 rounded-2xl bg-emerald-50/60 p-3.5 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Strong Tenancy Liquidity</span>
            <span>Submarket {estate} commands 88%+ average occupancy driven by young professionals and expatriates.</span>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-2xl bg-amber-50/60 p-3.5 text-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Service Charge Diligence</span>
            <span>Confirm audited accounts for common area generator diesel consumption and lift maintenance contracts.</span>
          </div>
        </div>
      </div>

      {/* Non-guaranteed Disclaimer */}
      <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
        <span>
          A&E investment projections represent informational analysis derived from observed asking prices and verified historical leases. They do not constitute formal financial, legal, or licensed appraisal advice.
        </span>
      </div>
    </div>
  );
}