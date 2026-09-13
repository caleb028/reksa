'use client';

import React, { useState } from 'react';
import { TrendingUp, Calculator, BarChart3, AlertCircle } from 'lucide-react';

export default function InvestmentSimulatorPage() {
  const [purchasePrice, setPurchasePrice] = useState<number>(10000000);
  const [depositPct, setDepositPct] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(13.0);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [monthlyRent, setMonthlyRent] = useState<number>(75000);
  const [serviceCharge, setServiceCharge] = useState<number>(6000);
  const [vacancyRatePct, setVacancyRatePct] = useState<number>(8);
  const [annualMaintenancePct, setAnnualMaintenancePct] = useState<number>(4);

  // Math
  const deposit = (purchasePrice * depositPct) / 100;
  const loanAmount = purchasePrice - deposit;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTenureYears * 12;

  const monthlyMortgagePayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : 0;

  const annualGrossRent = monthlyRent * 12;
  const grossYield = (annualGrossRent / purchasePrice) * 100;

  const annualServiceCharge = serviceCharge * 12;
  const annualVacancyLoss = (annualGrossRent * vacancyRatePct) / 100;
  const annualMaintenance = (annualGrossRent * annualMaintenancePct) / 100;
  const annualOperatingExpenses = annualServiceCharge + annualVacancyLoss + annualMaintenance;

  const annualNetOperatingIncome = annualGrossRent - annualOperatingExpenses;
  const annualDebtService = monthlyMortgagePayment * 12;
  const annualPreTaxCashFlow = annualNetOperatingIncome - annualDebtService;

  const netYield = (annualNetOperatingIncome / purchasePrice) * 100;
  const cashOnCashROI = deposit > 0 ? (annualPreTaxCashFlow / deposit) * 100 : 0;

  // Scenario Simulator
  const scenarios = [
    {
      name: 'Conservative',
      rent: Math.round(monthlyRent * 0.9),
      vacancy: vacancyRatePct + 4,
      desc: 'Market slowdown with 12% vacancy'
    },
    {
      name: 'Expected',
      rent: monthlyRent,
      vacancy: vacancyRatePct,
      desc: 'Base case assumption'
    },
    {
      name: 'Optimistic',
      rent: Math.round(monthlyRent * 1.1),
      vacancy: Math.max(3, vacancyRatePct - 3),
      desc: 'High occupancy with 10% rent upside'
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Real Estate Analytics &amp; Yield Modeler
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Property Investment &amp; Mortgage Simulator
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Model gross yield, net operating income, mortgage debt service, and multi-scenario cashflow forecasts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Acquisition &amp; Loan Parameters</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Purchase Price (KES)
              </label>
              <input
                type="number"
                step="500000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Cash Down Payment ({depositPct}%)
              </label>
              <input
                type="number"
                value={deposit}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Expected Monthly Rent (KES)
              </label>
              <input
                type="number"
                step="5000"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                onChange={(e) => setServiceCharge(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Mortgage Rate (% p.a.)
              </label>
              <input
                type="number"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Loan Tenure (Years)
              </label>
              <input
                type="number"
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/5 p-6 sm:p-8 dark:border-emerald-500/20 dark:bg-slate-900 shadow-card flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Projected Net Rental Yield
            </span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-4">
              {netYield.toFixed(1)}% <span className="text-xs font-normal text-slate-400">({grossYield.toFixed(1)}% Gross)</span>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Monthly Mortgage</span>
                <span className="font-bold text-slate-900 dark:text-white">KES {Math.round(monthlyMortgagePayment).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Annual Net Cash Flow</span>
                <span className={`font-bold ${annualPreTaxCashFlow >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  KES {Math.round(annualPreTaxCashFlow).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Cash-on-Cash Return</span>
                <span className="font-bold text-slate-900 dark:text-white">{cashOnCashROI.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-100 p-3 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Projections are algorithmic estimates based on input parameters. Actual rental revenue and bank loan interest terms may vary.
          </div>
        </div>
      </div>

      {/* Scenario Simulator Matrix */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Scenario Simulator (Conservative • Expected • Optimistic)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {scenarios.map((sc) => {
            const scGross = sc.rent * 12;
            const scNet = scGross - (serviceCharge * 12) - (scGross * (sc.vacancy / 100)) - (scGross * 0.04);
            const scYield = (scNet / purchasePrice) * 100;
            return (
              <div
                key={sc.name}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-850"
              >
                <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                  {sc.name} Scenario
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  {scYield.toFixed(1)}% <span className="text-xs font-normal text-slate-400">Net Yield</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">{sc.desc}</p>
                <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Rent:</span>
                    <strong>KES {sc.rent.toLocaleString()}/mo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Vacancy:</span>
                    <strong>{sc.vacancy}%</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}