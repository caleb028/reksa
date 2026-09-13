'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle2, Building, ArrowRight, Phone, Mail } from 'lucide-react';
import { useApp } from '@/components/layout/AppProviders';

interface HandoverInsuranceCardProps {
  propertyId?: string;
  propertyPrice: number;
  propertyTitle?: string;
}

export function HandoverInsuranceCard({
  propertyId,
  propertyPrice,
  propertyTitle = 'Property'
}: HandoverInsuranceCardProps) {
  const { serverUser, notify } = useApp();
  const [selectedInsurer, setSelectedInsurer] = useState<'JUBILEE' | 'BRITAM' | 'ICEA_LION'>('JUBILEE');
  const [clientName, setClientName] = useState(serverUser?.name || '');
  const [clientPhone, setClientPhone] = useState(serverUser?.phone || '');
  const [clientEmail, setClientEmail] = useState(serverUser?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState<any | null>(null);

  const estimatedPremium = Math.max(7500, Math.round(propertyPrice * 0.0015));
  const monthlyPremium = Math.round(estimatedPremium / 12);

  const handleRequestQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      notify('Missing Information', 'Please enter your name and phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/insurance/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          propertyValue: propertyPrice,
          clientName,
          clientPhone,
          clientEmail,
          selectedInsurer,
          insuranceType: 'HOME_AND_FIRE'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate quote');

      setQuoteSuccess(data);
      notify('Insurance Quote Ready', `Quote ${data.quoteNumber} generated with ${selectedInsurer}`, 'success');
    } catch (err: any) {
      notify('Quote Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-forest-200/80 bg-gradient-to-br from-forest-50/40 via-white to-ochre-50/20 p-6 dark:border-forest-900/60 dark:from-forest-950/20 dark:via-slate-900 dark:to-slate-900 shadow-card">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-900 text-ochre-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Handover Home &amp; Fire Protection
            </h3>
            <span className="text-[11px] text-slate-500">
              Institutional underwriting via licensed Kenyan insurers
            </span>
          </div>
        </div>
        <span className="rounded-full bg-ochre-100 dark:bg-ochre-950 px-2.5 py-0.5 text-[10px] font-bold text-ochre-800 dark:text-ochre-300">
          Partner Rates
        </span>
      </div>

      {quoteSuccess ? (
        <div className="rounded-2xl border border-forest-300 bg-forest-50 p-4 dark:border-forest-800 dark:bg-forest-950/40 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-forest-800 dark:text-forest-300 font-bold">
            <CheckCircle2 className="w-4 h-4 text-forest-600" />
            <span>Quote #{quoteSuccess.quoteNumber} Dispatched</span>
          </div>
          <p className="text-forest-900 dark:text-forest-200">
            Estimated Annual Premium: <strong>KES {quoteSuccess.estimatedAnnualPremiumKes.toLocaleString()}</strong> (~KES {quoteSuccess.monthlyInstallmentKes.toLocaleString()}/mo).
          </p>
          <p className="text-slate-500 text-[11px]">
            A policy officer from <strong>{selectedInsurer}</strong> has received your handover schedule and will reach out via WhatsApp/Phone to issue the formal policy cover note.
          </p>
        </div>
      ) : (
        <form onSubmit={handleRequestQuote} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'JUBILEE', name: 'Jubilee Insurance', badge: 'Fastest Payout' },
              { id: 'BRITAM', name: 'Britam Kenya', badge: 'All-Risk' },
              { id: 'ICEA_LION', name: 'ICEA LION', badge: 'Comprehensive' },
            ].map((ins) => (
              <button
                type="button"
                key={ins.id}
                onClick={() => setSelectedInsurer(ins.id as any)}
                className={`rounded-2xl border p-2.5 text-left transition-all ${
                  selectedInsurer === ins.id
                    ? 'border-forest-800 bg-forest-50/60 dark:border-forest-500 dark:bg-forest-950/40 ring-1 ring-forest-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800'
                }`}
              >
                <span className="font-bold text-slate-900 dark:text-white block text-[11px] truncate">
                  {ins.name}
                </span>
                <span className="text-[9.5px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  {ins.badge}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                Estimated Annual Cover
              </span>
              <span className="text-base font-black text-forest-900 dark:text-forest-300">
                KES {estimatedPremium.toLocaleString()} / year
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              ~KES {monthlyPremium.toLocaleString()} / mo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Your Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <input
              type="tel"
              required
              placeholder="Phone (07... / 01...)"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-forest-900 py-2.5 text-xs font-bold text-white hover:bg-forest-800 active:scale-98 transition-all disabled:opacity-75"
          >
            {isSubmitting ? (
              <span>Requesting Cover Note...</span>
            ) : (
              <>
                <span>Get 1-Click Handover Insurance Quote</span>
                <ArrowRight className="w-3.5 h-3.5 text-ochre-400" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
