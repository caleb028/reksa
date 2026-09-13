import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { MapPin, TrendingUp, ShieldCheck, ArrowRight, School, Hospital, Bus } from 'lucide-react';

export default async function NeighbourhoodsPage() {
  const neighbourhoods = await db.neighbourhood.findMany({
    include: {
      county: true,
      properties: true
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Micro-Market Analytics
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Neighbourhood Intelligence Hub
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          In-depth market trends, rental yields, infrastructure indices, school zones, and security scores for Kenya&apos;s leading residential corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
        {neighbourhoods.map((n) => (
          <div
            key={n.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card hover:border-emerald-500/50 transition-colors"
          >
            <div>
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {n.name}
                </h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {n.rentalYieldAvg}% Yield
                </span>
              </div>

              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-4">
                {n.town}, {n.county.name} County
              </span>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {n.description}
              </p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-6">
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 font-bold block">Median Price</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    KES {(n.medianAskingPrice / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 font-bold block">Development</span>
                  <span className="font-bold text-emerald-600">{n.developmentScore}/100</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 font-bold block">Security Rating</span>
                  <span className="font-bold text-slate-900 dark:text-white">{n.securityRating}/5.0</span>
                </div>
              </div>
            </div>

            <Link
              href={`/buy?county=${n.county.name}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-800"
            >
              <span>Explore {n.name} Verified Listings ({n.properties.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}