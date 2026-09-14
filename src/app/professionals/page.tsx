import React from 'react';
import { db } from '@/lib/db';
import { ShieldCheck, UserCheck, Star, Clock, CheckCircle2, Award, Briefcase, Phone, Scale, MapPin, Building, Lock } from 'lucide-react';
import Link from 'next/link';

export default async function ProfessionalsPage() {
  const professionals = await db.professional.findMany({
    include: {
      user: true,
      services: true
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-forest-900 text-ochre-400">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-forest-800 dark:text-forest-400">
            Accredited Real Estate Experts
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Professional Services Marketplace
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Retain certified Conveyancing Advocates, ISK Valuers, EBK Structural Engineers, and Licensed Surveyors with platform escrow protection.
        </p>
      </div>

      {/* Escrow Guarantee Banner */}
      <div className="mb-8 rounded-2xl border border-forest-200/90 bg-forest-50/70 p-4 dark:border-forest-900/60 dark:bg-forest-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-forest-700 dark:text-forest-400 shrink-0" />
          <div>
            <span className="font-bold text-forest-950 dark:text-forest-200">
              A&E Escrow Protected Transaction:
            </span>{' '}
            <span className="text-forest-900/90 dark:text-forest-300">
              Professional fees are held securely and disbursed only when verified valuation reports or registered sale agreements are delivered.
            </span>
          </div>
        </div>
        <span className="rounded-full bg-ochre-100 dark:bg-ochre-900/60 px-3 py-1 font-bold text-ochre-800 dark:text-ochre-300 shrink-0 text-[11px]">
          12.5% Platform Take-Rate Included
        </span>
      </div>

      {/* Professionals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {professionals.map((p) => (
          <div
            key={p.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card hover:border-forest-700/60 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-900 font-bold text-ochre-400">
                    {p.user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{p.user.name}</span>
                      <UserCheck className="w-4 h-4 text-forest-600 dark:text-forest-400" />
                    </h3>
                    <span className="text-xs font-semibold text-forest-800 dark:text-forest-400">
                      {p.professionType} • {p.boardRegNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {p.yearsExperience} Years Experience • Serves: {p.countiesServed}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white justify-end">
                    <Star className="w-3.5 h-3.5 fill-ochre-400 text-ochre-400" />
                    <span>{p.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{p.reviewCount} Verified Jobs</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-6 leading-relaxed">
                {p.bio || 'Accredited real estate professional licensed for statutory land searches, structural health inspections, and boundary dispute verifications.'}
              </p>

              {/* Service Capabilities */}
              <div className="border-t border-slate-100 pt-4 dark:border-slate-800 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Specialist Services &amp; Flat Rates
                </span>
                <div className="space-y-2">
                  {p.services.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs dark:bg-slate-800/60"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-forest-900 dark:text-forest-400 font-mono">
                          KES {s.estimatedCost.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {s.turnaroundDays}d
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">
                Verified Board: <strong>{p.boardRegNumber}</strong>
              </span>
              <a
                href={`https://wa.me/254722000000?text=${encodeURIComponent(`Hello, I would like to book a professional service with ${p.user.name} on A&E (Ardhi and Estates).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-forest-900 px-4 py-2 text-xs font-bold text-white hover:bg-forest-800 transition-colors shadow-xs"
              >
                <Phone className="w-3 h-3 text-ochre-400" />
                <span>Book Service Now</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}