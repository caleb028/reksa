'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, X, ArrowRight, Sparkles, Trash2 } from 'lucide-react';
import { useApp } from '@/components/layout/AppProviders';

export function ComparisonTray() {
  const { comparisonList, comparisonDetails, toggleCompare, clearComparison } = useApp();

  if (!comparisonList || comparisonList.length === 0) {
    return null;
  }

  const maxCompare = 5;
  const count = comparisonList.length;

  return (
    <aside
      aria-label="Active property comparison tray"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl animate-slide-up"
    >
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 rounded-3xl border border-emerald-500/40 bg-slate-950/95 p-3 sm:p-4 shadow-dock backdrop-blur-xl text-white">
        {/* Left: Indicator & Count */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wide text-white uppercase">
                AI Compare Matrix
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                {count} / {maxCompare}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {count === 1
                ? 'Select at least 1 more property'
                : `${count} properties ready for algorithmic comparison`}
            </p>
          </div>
        </div>

        {/* Center: Selected Item Thumbnails */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {comparisonList.map((id) => {
            const details = comparisonDetails?.[id];
            const imgSrc =
              details?.imageUrl ||
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80';
            const title = details?.title || `Property ${id.slice(0, 5)}`;

            return (
              <div
                key={id}
                className="group relative flex-shrink-0 w-11 h-11 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 transition-all hover:scale-105"
                title={title}
              >
                <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => toggleCompare(id)}
                  aria-label={`Remove ${title} from comparison`}
                  className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}

          {/* Empty slot indicators */}
          {Array.from({ length: Math.max(0, maxCompare - count) }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="hidden sm:flex flex-shrink-0 w-11 h-11 rounded-xl border border-dashed border-slate-800 items-center justify-center text-slate-600 text-xs font-mono"
            >
              +
            </div>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={clearComparison}
            title="Clear comparison list"
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-all active:scale-[0.98]"
          >
            <span>Compare</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
