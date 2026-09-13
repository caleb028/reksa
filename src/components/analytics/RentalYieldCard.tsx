'use client';

import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, TrendingUp, RefreshCw } from 'lucide-react';

interface RentalYieldCardProps {
  purchasePrice: number;
  initialMonthlyRent?: number | null;
}

export function RentalYieldCard({ purchasePrice, initialMonthlyRent }: RentalYieldCardProps) {
  const [price, setPrice] = useState<number>(purchasePrice);
  const [monthlyRent, setMonthlyRent] = useState<number>(initialMonthlyRent || Math.round(purchasePrice * 0.0078));
  const [serviceCharge, setServiceCharge] = useState<number>(6500);
  const [maintenancePct, setMaintenancePct] = useState<number>(5);
  const [vacancyWeeks, setVacancyWeeks] = useState<number>(4);

  // Math
  const annualGrossRent = monthlyRent * 12;
  const grossYield = (annualGrossRent / (price || 1)) * 100;

  const annualServiceCharge = serviceCharge * 12;
  const annualMaintenance = (annualGrossRent * maintenancePct) / 100;
  const vacancyLoss = (annualGrossRent * vacancyWeeks) / 52;
  const totalExpenses = annualServiceCharge + annualMaintenance + vacancyLoss;

  const annualNetIncome = annualGrossRent - totalExpenses;
  const netYield = (annualNetIncome / (price || 1)) * 100;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Rental Yield & Cashflow Engine</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Dynamic investment yield model with customizable Kenyan assumptions</p>
          </div>
        </div>
      </div>

      {/* Yield KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        <div className="rounded-2xl bg-emerald-50/70 p-4 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">Gross Yield</span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{grossYield.toFixed(1)}%</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">KES {annualGrossRent.toLocaleString()} / yr</span>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Estimated Net Yield</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{netYield.toFixed(1)}%</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">KES {Math.max(0, Math.round(annualNetIncome)).toLocaleString()} / yr net</span>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Monthly Cashflow</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            KES {Math.round(annualNetIncome / 12).toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">After operational costs</span>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Estimated Payback</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {netYield > 0 ? (price / annualNetIncome).toFixed(1) : '—'} <span className="text-xs font-normal">Yrs</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Capital recovery period</span>
        </div>
      </div>

      {/* Interactive Sliders / Inputs */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Fine-Tune Financial Assumptions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Monthly Rent (KES)
            </label>
            <input
              type="number"
              step="5000"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Monthly Service Charge (KES)
            </label>
            <input
              type="number"
              step="500"
              value={serviceCharge}
              onChange={(e) => setServiceCharge(Number(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Annual Vacancy (Weeks)
            </label>
            <input
              type="number"
              min="0"
              max="12"
              value={vacancyWeeks}
              onChange={(e) => setVacancyWeeks(Number(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}