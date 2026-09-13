'use client';

import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Building2,
  AlertTriangle,
  ArrowRight,
  Landmark,
  User,
  Phone,
  Mail,
  Sparkles,
  Percent
} from 'lucide-react';
import { useApp } from '@/components/layout/AppProviders';

interface LenderOption {
  id: string;
  name: string;
  type: 'COMMERCIAL_BANK' | 'SACCO' | 'GOVERNMENT_SCHEME';
  rate: number;
  maxTenure: number;
  badge: string;
  minDownPaymentPercent: number;
}

const LENDER_BENCHMARKS: LenderOption[] = [
  {
    id: 'KMRC_AFFORDABLE',
    name: 'KMRC Affordable Housing Scheme',
    type: 'GOVERNMENT_SCHEME',
    rate: 9.5,
    maxTenure: 25,
    badge: 'Lowest Rate (Capped at KES 8M)',
    minDownPaymentPercent: 10
  },
  {
    id: 'STIMA_SACCO',
    name: 'Stima SACCO Makao Bora',
    type: 'SACCO',
    rate: 12.0,
    maxTenure: 20,
    badge: 'Member Co-op Rate',
    minDownPaymentPercent: 10
  },
  {
    id: 'NCBA_BANK',
    name: 'NCBA Bank Home Loan',
    type: 'COMMERCIAL_BANK',
    rate: 13.0,
    maxTenure: 25,
    badge: 'Up to 105% Financing',
    minDownPaymentPercent: 15
  },
  {
    id: 'KCB_BANK',
    name: 'KCB Bank Kenya Mortgages',
    type: 'COMMERCIAL_BANK',
    rate: 13.5,
    maxTenure: 25,
    badge: 'Widest Network',
    minDownPaymentPercent: 15
  },
  {
    id: 'STANBIC_BANK',
    name: 'Stanbic Bank Kenya',
    type: 'COMMERCIAL_BANK',
    rate: 13.8,
    maxTenure: 20,
    badge: 'Diaspora Specialist',
    minDownPaymentPercent: 20
  }
];

export default function AffordabilityPage() {
  const { notify, serverUser } = useApp();
  const [monthlyIncome, setMonthlyIncome] = useState<number>(250000);
  const [savingsDeposit, setSavingsDeposit] = useState<number>(2000000);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(30000);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [selectedLenderId, setSelectedLenderId] = useState<string>('KCB_BANK');

  // Modal states for 1-click pre-qualification
  const [showPreQualModal, setShowPreQualModal] = useState(false);
  const [fullName, setFullName] = useState(serverUser?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(serverUser?.phone || '');
  const [email, setEmail] = useState(serverUser?.email || '');
  const [employmentType, setEmploymentType] = useState('SALARIED');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preQualResult, setPreQualResult] = useState<any | null>(null);

  const activeLender = LENDER_BENCHMARKS.find((l) => l.id === selectedLenderId) || LENDER_BENCHMARKS[3];
  const interestRate = activeLender.rate;

  // Max 40% of net disposable income for monthly housing payment
  const maxMonthlyPayment = Math.max(0, (monthlyIncome - monthlyDebts) * 0.4);
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTenureYears * 12;

  // Present value of mortgage annuity: P = PMT * (1 - (1+r)^-n) / r
  const maxLoanAmount = monthlyRate > 0
    ? maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate)
    : 0;

  const maxPropertyPrice = maxLoanAmount + savingsDeposit;
  const recommendedConservativePrice = maxPropertyPrice * 0.85;

  const handlePreQualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber) {
      notify('Missing Information', 'Full name and mobile number are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/mortgages/pre-qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phoneNumber,
          email,
          employmentType,
          monthlyNetIncome: monthlyIncome,
          existingMonthlyDebts: monthlyDebts,
          downPaymentAmount: savingsDeposit,
          maxLoanAmount: Math.round(maxLoanAmount),
          targetPropertyPrice: Math.round(maxPropertyPrice),
          preferredLender: activeLender.name
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit pre-qualification');

      setPreQualResult(data);
      notify('Pre-Qualification Submitted', `Reference: ${data.referenceNumber}`, 'success');
    } catch (err: any) {
      notify('Submission Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-forest-900 text-ochre-400">
            <Calculator className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-forest-800 dark:text-forest-400">
            Institutional Financial Funnel
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Mortgage &amp; SACCO Affordability Engine
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Calculate your maximum home purchasing power against live Central Bank of Kenya lending rates and partner SACCO terms.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Sliders & Lender Options */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Household Financial Profile</h2>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Gross Monthly Household Income</span>
                <span className="text-forest-900 dark:text-forest-400 font-bold font-mono">KES {monthlyIncome.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="1500000"
                step="25000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full accent-forest-800"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Available Savings for Down Payment</span>
                <span className="text-forest-900 dark:text-forest-400 font-bold font-mono">KES {savingsDeposit.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="200000"
                max="15000000"
                step="100000"
                value={savingsDeposit}
                onChange={(e) => setSavingsDeposit(Number(e.target.value))}
                className="w-full accent-forest-800"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Existing Monthly Debt Obligations</span>
                <span className="text-slate-600 font-bold font-mono">KES {monthlyDebts.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="300000"
                step="5000"
                value={monthlyDebts}
                onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                className="w-full accent-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Loan Tenure
                </label>
                <select
                  value={loanTenureYears}
                  onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="10">10 Years</option>
                  <option value="15">15 Years</option>
                  <option value="20">20 Years (Standard)</option>
                  <option value="25">25 Years (Extended)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Selected Interest Rate
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black font-mono text-forest-900 dark:border-slate-700 dark:bg-slate-800 dark:text-forest-400">
                  <Percent className="w-3.5 h-3.5 text-ochre-500" />
                  <span>{interestRate.toFixed(1)}% p.a.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Lender Benchmark Cards */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-forest-700 dark:text-forest-400" />
              <span>Compare Live Lender Benchmarks (Click to apply rate)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LENDER_BENCHMARKS.map((lender) => (
                <button
                  type="button"
                  key={lender.id}
                  onClick={() => setSelectedLenderId(lender.id)}
                  className={`rounded-2xl border p-3.5 text-left transition-all ${
                    selectedLenderId === lender.id
                      ? 'border-forest-800 bg-forest-50/70 dark:border-forest-500 dark:bg-forest-950/40 ring-1 ring-forest-700'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {lender.name}
                    </span>
                    <span className="font-mono font-black text-xs text-forest-800 dark:text-forest-400">
                      {lender.rate.toFixed(1)}%
                    </span>
                  </div>
                  <span className="inline-block rounded bg-ochre-100 dark:bg-ochre-950 px-2 py-0.5 text-[9.5px] font-bold text-ochre-800 dark:text-ochre-300">
                    {lender.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Sidebar & Pre-Qualification CTA */}
        <div className="rounded-3xl border border-forest-200/80 bg-gradient-to-br from-forest-50/50 via-white to-ochre-50/20 p-6 sm:p-8 dark:border-forest-900/60 dark:from-forest-950/30 dark:via-slate-900 dark:to-slate-900 shadow-card flex flex-col justify-between">
          <div>
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Estimated Safe Purchasing Power
            </span>
            <div className="text-3xl sm:text-4xl font-black text-forest-900 dark:text-forest-300 mb-4 font-mono">
              KES {Math.round(maxPropertyPrice).toLocaleString()}
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Max Monthly Repayment</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">KES {Math.round(maxMonthlyPayment).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Qualifying Mortgage Loan</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">KES {Math.round(maxLoanAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Down Payment Ratio</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  {Math.round((savingsDeposit / maxPropertyPrice) * 100)}%
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Selected Lender</span>
                <span className="font-bold text-forest-900 dark:text-forest-400">{activeLender.name}</span>
              </div>
            </div>

            {/* Pre-Qualification Referral Funnel CTA */}
            <button
              onClick={() => setShowPreQualModal(true)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-forest-900 py-3.5 px-4 text-xs font-bold text-white hover:bg-forest-800 shadow-md active:scale-98 transition-all mb-4"
            >
              <Sparkles className="w-4 h-4 text-ochre-400" />
              <span>Fast-Track Mortgage Pre-Approval</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl bg-amber-50 p-3 text-[11px] text-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
            <div className="flex items-center gap-1 font-bold mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Prudential Lending Guidelines</span>
            </div>
            Calculated under Central Bank of Kenya 40% debt-to-income caps. Actual terms depend on credit bureau (CRB) score and formal valuation.
          </div>
        </div>
      </div>

      {/* 1-Click Mortgage Pre-Qualification Modal */}
      {showPreQualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-900 text-ochre-400">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Apply for Bank Pre-Approval
                  </h3>
                  <span className="text-xs text-slate-500">Direct introduction to {activeLender.name}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPreQualModal(false);
                  setPreQualResult(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {preQualResult ? (
              <div className="rounded-2xl border border-forest-300 bg-forest-50 p-4 dark:border-forest-800 dark:bg-forest-950/40 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-forest-800 dark:text-forest-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-forest-600" />
                  <span>Pre-Qualification #{preQualResult.referenceNumber} Logged</span>
                </div>
                <p className="text-forest-900 dark:text-forest-200">
                  Maximum Qualifying Loan: <strong>KES {Math.round(maxLoanAmount).toLocaleString()}</strong> with an estimated monthly commitment of <strong>KES {Math.round(maxMonthlyPayment).toLocaleString()}</strong>.
                </p>
                <p className="text-slate-500 text-[11px]">
                  Your application has been submitted to the mortgage desk at <strong>{activeLender.name}</strong>. A credit relationship manager will contact you within 24 business hours to request proof of income documents.
                </p>
                <button
                  onClick={() => {
                    setShowPreQualModal(false);
                    setPreQualResult(null);
                  }}
                  className="w-full rounded-xl bg-forest-900 py-2.5 font-bold text-white text-xs hover:bg-forest-800 mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handlePreQualSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. David Mwangi Karanja"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone (+254)</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0712345678"
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="david@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Employment Category</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="SALARIED">Salaried Employee (Paye / Payslip)</option>
                    <option value="SELF_EMPLOYED">Self-Employed / Business Owner</option>
                    <option value="DIASPORA">Diaspora Earner (USD / GBP / EUR)</option>
                  </select>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                  By submitting, you consent to REKSA sharing your preliminary pre-qualification profile with {activeLender.name} under the Kenya Data Protection Act, 2019.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-forest-900 py-3 text-xs font-bold text-white hover:bg-forest-800 disabled:opacity-75"
                >
                  {isSubmitting ? <span>Processing Pre-Qualification...</span> : <span>Submit to {activeLender.name} Desk →</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}