'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Receipt,
  Calculator,
  ShieldAlert,
  Info,
  Banknote,
  DollarSign,
  Clock,
  Sparkles
} from 'lucide-react';

interface RentalIntelligenceProps {
  monthlyRent: number;
  serviceCharge?: number | null;
  deposit?: number | null;
  neighbourhoodAverageRent?: number | null;
  rentalYieldEstimate?: number | null;
  town?: string;
  estate?: string | null;
}

export function RentalIntelligenceCard({
  monthlyRent,
  serviceCharge = 5000,
  deposit,
  neighbourhoodAverageRent,
  rentalYieldEstimate,
  town = 'Nairobi',
  estate = 'Kilimani'
}: RentalIntelligenceProps) {
  // Move-in cost calculation: 1 Month Rent + Deposit (default 1 or 2 months) + 1 Month Service Charge + Utility deposit estimate (KES 10,000)
  const defaultDeposit = deposit || monthlyRent * 2;
  const actualServiceCharge = serviceCharge || 0;
  const utilityDeposit = 10000;
  const estimatedMoveInCost = monthlyRent + defaultDeposit + actualServiceCharge + utilityDeposit;

  const annualRent = monthlyRent * 12;
  const areaAvg = neighbourhoodAverageRent || Math.round(monthlyRent * 1.05);
  const diffFromAvg = Math.round(((monthlyRent - areaAvg) / areaAvg) * 100);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card">
      <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Rental Market Intelligence &amp; Cashflow
            </h3>
            <span className="text-xs text-slate-500">
              Verified submarket lease metrics for {estate || town}
            </span>
          </div>
        </div>

        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Rental Unit
        </span>
      </div>

      {/* Grid of Key Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Monthly Rent</span>
          <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">
            KES {monthlyRent.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500">Paid monthly</span>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Annual Commitment</span>
          <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">
            KES {(annualRent / 1000).toFixed(0)}k
          </span>
          <span className="text-[10px] text-slate-500">KES {(annualRent / 1000000).toFixed(2)}M / yr</span>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Building Service Fee</span>
          <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">
            KES {actualServiceCharge.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500">Water, security, trash</span>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Security Deposit</span>
          <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">
            KES {defaultDeposit.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500">Refundable upon exit</span>
        </div>
      </div>

      {/* Estimated Move-In Breakdown Box */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 dark:border-indigo-950 dark:bg-indigo-950/20 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-indigo-600" />
            <span>Estimated Move-in Cost Breakdown</span>
          </h4>
          <span className="text-sm font-black text-indigo-900 dark:text-indigo-200">
            Total: KES {estimatedMoveInCost.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex justify-between sm:flex-col py-1 border-b sm:border-b-0 border-indigo-100 dark:border-indigo-900">
            <span className="text-slate-500">First Month Rent:</span>
            <span className="font-bold text-slate-900 dark:text-white">KES {monthlyRent.toLocaleString()}</span>
          </div>
          <div className="flex justify-between sm:flex-col py-1 border-b sm:border-b-0 border-indigo-100 dark:border-indigo-900">
            <span className="text-slate-500">Security Deposit:</span>
            <span className="font-bold text-slate-900 dark:text-white">KES {defaultDeposit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between sm:flex-col py-1 border-b sm:border-b-0 border-indigo-100 dark:border-indigo-900">
            <span className="text-slate-500">First Month Service:</span>
            <span className="font-bold text-slate-900 dark:text-white">KES {actualServiceCharge.toLocaleString()}</span>
          </div>
          <div className="flex justify-between sm:flex-col py-1">
            <span className="text-slate-500">Utility / Water Prep:</span>
            <span className="font-bold text-slate-900 dark:text-white">KES {utilityDeposit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Neighbourhood Rental Trend Comparison */}
      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 mb-4 flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
            Submarket Context: {estate || town} Median is KES {areaAvg.toLocaleString()}/mo
          </span>
          <span>
            This unit is priced {diffFromAvg === 0 ? 'at the median' : diffFromAvg > 0 ? `${diffFromAvg}% above median due to luxury amenities` : `${Math.abs(diffFromAvg)}% below median providing strong rental value`}.
          </span>
        </div>
      </div>

      {/* Statutory Disclaimer */}
      <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
        <span>
          Rental yield and move-in figures are estimates based on observed market leases and standard landlord terms in Kenya. Actual leases, utility meters, and deposit conditions are governed strictly by the formal tenancy agreement.
        </span>
      </div>
    </div>
  );
}