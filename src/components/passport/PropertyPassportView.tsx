'use client';

import React from 'react';
import { ShieldCheck, History, Calendar, CheckCircle, FileText, AlertCircle, Building2, MapPin, Award } from 'lucide-react';
import { TrustScore } from '@/components/ui/TrustScore';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

interface PropertyPassportProps {
  passport: {
    passportNumber: string;
    initialRegistered: Date | string;
    lastVerified?: Date | string | null;
    riskLevel: string;
    structuralStatus: string;
    boundaryConfidence: number;
    changesDetected: string;
    ownershipChain?: { year: number; event: string; party: string }[];
  };
  priceHistory?: { price: number; effectiveYear: number; changePercentage?: number | null; event: string }[];
  property: {
    title: string;
    propertyType: string;
    town: string;
    estate?: string | null;
    countyName: string;
    trustScore: number;
    verificationLevel: number;
  };
}

export function PropertyPassportView({ passport, priceHistory = [], property }: PropertyPassportProps) {
  const registeredYear = new Date(passport.initialRegistered).getFullYear();
  const lastVerifiedStr = passport.lastVerified
    ? new Date(passport.lastVerified).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })
    : 'Pending verification';

  return (
    <div className="rounded-3xl border-2 border-emerald-600/30 bg-white p-6 sm:p-8 shadow-card dark:border-emerald-500/20 dark:bg-slate-900">
      {/* Passport Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-emerald-800 px-2.5 py-1 text-xs font-mono font-bold tracking-widest text-emerald-100 uppercase">
              Official Digital Passport
            </span>
            <VerificationBadge level={property.verificationLevel} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
            ID: {passport.passportNumber}
          </h2>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{property.estate ? `${property.estate}, ` : ''}{property.town}, {property.countyName}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <TrustScore score={property.trustScore} />
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">First Registered</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{registeredYear}</span>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Last Verified</span>
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{lastVerifiedStr}</span>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Structural Audit</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{passport.structuralStatus}</span>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Boundary Confidence</span>
          <span className="text-sm font-semibold text-emerald-600">{(passport.boundaryConfidence * 100).toFixed(0)}% Confirmed</span>
        </div>
      </div>

      {/* Price History Trajectory */}
      <div className="py-6 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-emerald-600" />
          <span>Listing & Value Trajectory</span>
        </h3>
        <div className="relative pl-6 border-l-2 border-emerald-500/30 space-y-4">
          {priceHistory.map((item, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-emerald-600 bg-white dark:bg-slate-900" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {item.effectiveYear} — KES {item.price.toLocaleString()}
                  </span>
                  <span className="ml-2 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    [{item.event}]
                  </span>
                </div>
                {item.changePercentage !== null && item.changePercentage !== undefined && item.changePercentage > 0 && (
                  <span className="text-xs font-semibold text-emerald-600">
                    +{item.changePercentage}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Changes Detected & User Reports */}
      <div className="pt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-slate-500" />
          <span>Integrity & Anomaly Log</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {passport.changesDetected || 'No structural alterations, boundary revisions, or unauthorized listing modifications recorded.'}
        </p>
      </div>
    </div>
  );
}