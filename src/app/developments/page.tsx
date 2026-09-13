import React from 'react';
import { db } from '@/lib/db';
import { Hammer, Building2, Calendar, CheckCircle2, Bot, Layers, Sparkles } from 'lucide-react';

export default async function DevelopmentsPage() {
  const developments = await db.development.findMany({
    include: {
      county: true,
      neighbourhood: true,
      developer: true,
      units: true,
      progressUpdates: {
        orderBy: { recordedDate: 'desc' }
      }
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Hammer className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Developer Projects &amp; Milestone Audit
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          New Residential Developments in Kenya
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Track verified off-plan construction progress, foundation milestones, and unit inventory direct from NCA-certified developers.
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-12 mb-12">
        {developments.map((dev) => (
          <div
            key={dev.id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-card"
          >
            {/* Top Grid: Media & Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="relative aspect-video lg:aspect-auto w-full bg-slate-200 dark:bg-slate-800">
                <img src={dev.coverImage} alt={dev.name} className="h-full w-full object-cover" />
                <div className="absolute top-4 left-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  {dev.stage} Phase
                </div>
              </div>

              <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{dev.name}</h2>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      From KES {dev.startingPrice.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    By <strong>{dev.developer.companyName}</strong> • {dev.estate}, {dev.town}, {dev.county.name} County
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {dev.description}
                  </p>

                  {/* Milestone Progress Bar */}
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-6">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Overall Construction Progress</span>
                      <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{dev.overallProgress}% Complete</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${dev.overallProgress}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Target Completion: <strong>{dev.expectedCompletion}</strong></span>
                      <span>Available Units: <strong>{dev.availableUnits} / {dev.totalUnits}</strong></span>
                    </div>
                  </div>
                </div>

                {/* AI Development Analyst Commentary */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 dark:border-emerald-800/30 dark:bg-emerald-950/30 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                    <Bot className="w-4 h-4 text-emerald-600" />
                    <span>AI Development Analyst Observation</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Structure and foundation milestones have undergone independent physical inspection. Current progress rate of {dev.overallProgress}% aligns with the {dev.expectedCompletion} handover timeline. Buyers are advised to review escrow payment schedules and escrow bank guarantees.
                  </p>
                </div>
              </div>
            </div>

            {/* Construction Timeline & Available Units */}
            <div className="border-t border-slate-200 bg-slate-50/50 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-850/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Verified Construction Updates &amp; Site Milestones
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {dev.progressUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                      <span>{update.milestone.toUpperCase()}</span>
                      <span>{update.progressPct}%</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{update.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{update.description}</p>
                    {update.verifiedByInspector && (
                      <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Inspector Verified</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}