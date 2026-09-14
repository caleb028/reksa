'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Send,
  CheckCircle2,
  Phone,
  User,
  Mail,
  Coins,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { useApp } from '@/components/layout/AppProviders';

interface PropertyInquiryCardProps {
  propertyId: string;
  propertyTitle: string;
  organizationId?: string | null;
  agent?: {
    name?: string | null;
    phone?: string | null;
    agencyName?: string | null;
    licenseNumber?: string | null;
  } | null;
}

export function PropertyInquiryCard({
  propertyId,
  propertyTitle,
  organizationId,
  agent
}: PropertyInquiryCardProps) {
  const { serverUser, notify } = useApp();
  const [tab, setTab] = useState<'VIEWING' | 'INQUIRY'>('VIEWING');

  // Form states
  const [name, setName] = useState(serverUser?.name || '');
  const [phone, setPhone] = useState(serverUser?.phone || '');
  const [email, setEmail] = useState(serverUser?.email || '');
  const [viewingDate, setViewingDate] = useState('');
  const [viewingTime, setViewingTime] = useState<'Morning (9:00 AM - 12:00 PM)' | 'Afternoon (1:00 PM - 4:00 PM)' | 'Evening (4:00 PM - 6:00 PM)'>('Morning (9:00 AM - 12:00 PM)');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please enter your full name and phone number.');
      return;
    }

    if (!consentAgreed) {
      setErrorMsg('Please confirm data protection consent to share your contact information.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const formattedMessage =
      tab === 'VIEWING'
        ? `[Private Viewing Request] Requested Date: ${viewingDate || 'Next available date'}, Slot: ${viewingTime}. Note: ${message || 'No additional notes provided.'}`
        : `[Marketplace Inquiry] ${message || 'Interested in this property. Please reach out with further details.'}`;

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          organizationId: organizationId || null,
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          message: formattedMessage,
          source: tab === 'VIEWING' ? 'VIEWING_REQUEST' : 'PROPERTY_DETAIL',
          budget: budget ? parseFloat(budget.replace(/[^0-9.]/g, '')) : undefined,
          consentGiven: consentAgreed
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send request. Please try again.');
      }

      setSubmittedLeadId(data.leadId || 'CONFIRMED');
      notify(
        tab === 'VIEWING' ? 'Viewing Scheduled' : 'Inquiry Submitted',
        'Your request has been routed directly to the property agent.',
        'success'
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedLeadId(null);
    setMessage('');
    setBudget('');
    setErrorMsg('');
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      {/* Agent Header */}
      <div className="mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
          Authorized Listing Representative
        </span>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {agent?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h5 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{agent?.name || 'Verified A&E Realtor'}</span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            </h5>
            <span className="text-xs text-slate-500 block">
              {agent?.agencyName || 'Pinnacle Urban Properties KE'}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              License: {agent?.licenseNumber || 'EARB/2023/8491'}
            </span>
          </div>
        </div>
      </div>

      {submittedLeadId ? (
        /* Confirmation State */
        <div className="py-4 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            {tab === 'VIEWING' ? 'Viewing Request Confirmed' : 'Inquiry Submitted'}
          </h4>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Your request for <strong className="text-slate-700 dark:text-slate-300">{propertyTitle}</strong> has been logged in the agent&apos;s CRM pipeline.
          </p>

          <div className="mt-4 inline-block rounded-xl bg-slate-50 px-3 py-1.5 text-[11px] font-mono font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Reference: {submittedLeadId.slice(-8).toUpperCase()}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <a
              href={`tel:${agent?.phone || '+254722890123'}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Agent Direct ({agent?.phone || '+254 722 890 123'})</span>
            </a>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white pt-1"
            >
              Submit another request
            </button>
          </div>
        </div>
      ) : (
        /* Active Booking / Inquiry Form */
        <div>
          {/* Form Tabs */}
          <div className="flex rounded-2xl bg-slate-100 p-1 mb-4 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => { setTab('VIEWING'); setErrorMsg(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                tab === 'VIEWING'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Book Viewing</span>
            </button>
            <button
              type="button"
              onClick={() => { setTab('INQUIRY'); setErrorMsg(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                tab === 'INQUIRY'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>Make Inquiry</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-3 rounded-xl bg-red-50 p-2.5 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {tab === 'VIEWING' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={viewingDate}
                    onChange={(e) => setViewingDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={viewingTime}
                    onChange={(e) => setViewingTime(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Morning (9:00 AM - 12:00 PM)">Morning (9AM - 12PM)</option>
                    <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1PM - 4PM)</option>
                    <option value="Evening (4:00 PM - 6:00 PM)">Evening (4PM - 6PM)</option>
                  </select>
                </div>
              </div>
            )}

            {tab === 'INQUIRY' && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Proposed Offer / Budget (KES) (Optional)
                </label>
                <div className="relative flex items-center">
                  <Coins className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 18,500,000"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samuel Ochieng"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone / WhatsApp
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 7..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email (Optional)
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {tab === 'VIEWING' ? 'Special Requests / Notes' : 'Message / Specific Question'}
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  tab === 'VIEWING'
                    ? 'e.g. Please confirm if weekend access is available or if security clearance is needed.'
                    : 'e.g. Are the service charges included? Can you share the latest sectional title copy?'
                }
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none"
              />
            </div>

            {/* Kenya Data Protection Act 2019 Consent */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/90 p-2.5 dark:border-slate-800 dark:bg-slate-800/60">
              <label className="flex items-start gap-2 cursor-pointer text-[10.5px] text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  required
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-forest-900 focus:ring-forest-700"
                />
                <span className="leading-tight">
                  <strong className="text-slate-900 dark:text-white">Data Protection Act (2019) Consent:</strong> I authorize A&amp;E to securely route my contact info to the verified lister solely for this inquiry. Phone numbers are masked until accepted.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-forest-900 py-3 font-bold text-white shadow-sm hover:bg-forest-800 active:scale-98 transition-all disabled:opacity-75"
            >
              {isSubmitting ? (
                <span>Routing to Agent CRM...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{tab === 'VIEWING' ? 'Schedule Private Viewing' : 'Send Formal Inquiry'}</span>
                </>
              )}
            </button>
          </form>

          {/* Direct Agent Contact Fallback */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Prefer direct call?</span>
            <a
              href={`tel:${agent?.phone || '+254722890123'}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
            >
              <Phone className="w-3 h-3" />
              <span>{agent?.phone || '+254 722 890 123'}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
