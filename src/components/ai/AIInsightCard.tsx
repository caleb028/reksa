'use client';

import React from 'react';
import { Bot, CheckCircle2, AlertTriangle, Database, Info, Sparkles } from 'lucide-react';
import { PropertyAnalystOutput } from '@/ai/types';

interface AIInsightCardProps {
  analysis: PropertyAnalystOutput;
}

export function AIInsightCard({ analysis }: AIInsightCardProps) {
  const scores = [
    { label: 'Investment', value: analysis.investmentScore, max: 100 },
    { label: 'Rental Potential', value: analysis.rentalPotentialScore, max: 100 },
    { label: 'Location', value: analysis.locationScore, max: 100 },
    { label: 'Value Score', value: analysis.valueScore, max: 100 },
    { label: 'Affordability', value: analysis.affordabilityScore, max: 100 },
    { label: 'Risk Signal', value: analysis.riskSignalScore, max: 100, isInverse: true },
  ];

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/[0.03] to-slate-900/[0.01] p-6 sm:p-8 dark:border-emerald-500/20 dark:bg-slate-900 shadow-soft">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">REKSA AI Property Analyst</h3>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                {analysis.confidence} Confidence
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Algorithmic valuation and risk modeling based on verified platform data
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Overall Opportunity</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {analysis.overallOpportunityScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </span>
        </div>
      </div>

      {/* Summary Paragraph */}
      <div className="my-5 rounded-2xl bg-white p-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-800/40">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          {analysis.summary}
        </p>
      </div>

      {/* Score Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
        {scores.map((s, idx) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-100 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-850 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md animate-fade-up"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{s.label}</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{s.value}/100</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  s.isInverse
                    ? s.value > 40 ? 'bg-red-500' : 'bg-emerald-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${s.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Breakdown Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <h4 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Positive Market Indicators</span>
          </h4>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            {analysis.positiveFactors.map((f, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Due Diligence & Risk Signals</span>
          </h4>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            {analysis.riskSignals.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Data Source & Disclaimer Footer */}
      <div className="mt-6 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-1">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Data Sources Cited: {analysis.dataSources.join(' • ')}</span>
        </div>
        <p className="italic">{analysis.disclaimer}</p>
      </div>
    </div>
  );
}