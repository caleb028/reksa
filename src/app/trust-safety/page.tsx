import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, FileSearch, Scale, Bot, Users } from 'lucide-react';
import { VERIFICATION_TIERS } from '@/lib/constants/kenya';

export default function TrustSafetyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Integrity Framework &amp; Disclaimers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Trust, Verification &amp; Risk Signals
        </h1>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Transparency is the foundation of A&E (Ardhi and Estates). Here is how our verification tiers, AI risk signals, and professional audits operate.
        </p>
      </div>

      {/* 1. What A&E Verifies vs Does NOT Verify */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="rounded-3xl border border-emerald-500/30 bg-white p-6 sm:p-8 dark:border-emerald-500/20 dark:bg-slate-900 shadow-card">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-base mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>What A&E Verifies</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Agent &amp; Developer Identity:</strong> Verified against Estate Agents Registration Board (EARB) and National Construction Authority (NCA) registers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Spatial &amp; Boundary Consistency:</strong> GPS coordinates cross-referenced against county GIS zoning records.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Document Structural Completeness:</strong> Automated checking of title deeds, mutation forms, and sectional plans for essential seals, dates, and parcel numbers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Physical Site Audits:</strong> On-site inspections conducted by licensed EBK engineers and ISK valuers where Tier 4 is indicated.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-red-500/30 bg-white p-6 sm:p-8 dark:border-red-500/20 dark:bg-slate-900 shadow-card">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-extrabold text-base mb-4">
            <XCircle className="w-5 h-5 text-red-600" />
            <span>What A&E Does NOT Certify</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span><strong>Official Government Legal Title:</strong> A&E is NOT a government land registry. Only the Ministry of Lands &amp; Physical Planning (via ArdhiSasa) can issue official certificates of search.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span><strong>Guaranteed Investment Returns:</strong> All rental yields, capital appreciation rates, and cashflow projections are estimates based on historical data and user assumptions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span><strong>Legal Representation:</strong> Platform intelligence does not replace independent legal counsel from a certified advocate of the High Court of Kenya.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 2. Verification Tiers Breakdown */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card mb-12">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">
          The 6 Verification Levels (Tier 0 to Tier 5)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VERIFICATION_TIERS.map((tier) => (
            <div
              key={tier.level}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-850"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  LEVEL {tier.level}
                </span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                  {tier.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{tier.label}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{tier.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI Safety & Risk Signals */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card mb-12">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">
          How AI Risk Signals Work
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          A&E runs continuous background algorithms screening every listing for anomalies: duplicate photographs, sudden price drops (&gt;40% below submarket median), conflicting title parcel numbers, and unverified broker credentials. Listings with high risk signals are placed on hold for human moderator review.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs text-center">
          <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="font-bold block mb-1">🟢 Low Signal</span>
            <span className="text-[11px]">Normal variance; documents internally consistent.</span>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <span className="font-bold block mb-1">🟡 Review Recommended</span>
            <span className="text-[11px]">Preliminary tier; title or rates documents pending.</span>
          </div>
          <div className="rounded-2xl bg-orange-50 p-4 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300">
            <span className="font-bold block mb-1">🟠 Elevated Signal</span>
            <span className="text-[11px]">Steep price variance or repeated image candidate.</span>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 text-red-800 dark:bg-red-950/40 dark:text-red-300">
            <span className="font-bold block mb-1">🔴 High-Risk Signal</span>
            <span className="text-[11px]">Held for human audit; user reporting triggered.</span>
          </div>
        </div>
      </div>
    </div>
  );
}