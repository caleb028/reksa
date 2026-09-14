'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  User,
  UserCheck,
  Building,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Sparkles,
  Layers
} from 'lucide-react';
import { KENYA_COUNTIES } from '@/lib/constants/kenya';
import { useApp } from '@/components/layout/AppProviders';

export default function BusinessOnboardingPage() {
  const router = useRouter();
  const { notify } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<
    'REAL_ESTATE_COMPANY' | 'INDEPENDENT_AGENT' | 'INDIVIDUAL_SELLER' | 'DEVELOPER'
  >('REAL_ESTATE_COMPANY');

  const [name, setName] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [town, setTown] = useState('Nairobi');
  const [phone, setPhone] = useState('+254 7');
  const [email, setEmail] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const businessTypes = [
    {
      type: 'REAL_ESTATE_COMPANY' as const,
      title: 'Real Estate Agency / Company',
      badge: 'Multi-Agent Workspace',
      desc: 'For registered brokerages and property firms managing multiple agents, listings, team leads CRM, and business branding.',
      icon: Building2,
      color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
    },
    {
      type: 'INDEPENDENT_AGENT' as const,
      title: 'Independent Real Estate Agent',
      badge: 'Solo Professional',
      desc: 'For licensed individual agents who operate autonomously. Manage your own mandates, viewing requests, and direct client communications.',
      icon: UserCheck,
      color: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
    },
    {
      type: 'DEVELOPER' as const,
      title: 'Property Developer',
      badge: 'Master Projects',
      desc: 'For residential, mixed-use, and commercial property developers marketing off-plan towers, unit inventories, and construction milestones.',
      icon: Building,
      color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
    },
    {
      type: 'INDIVIDUAL_SELLER' as const,
      title: 'Independent Property Owner / Seller',
      badge: 'Private Seller',
      desc: 'Selling or renting your own private home, land, or apartment. Streamlined personal seller dashboard without agency overhead.',
      icon: User,
      color: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      notify('Missing Information', 'Please enter your business or trading name.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          businessType: selectedType,
          county,
          town,
          phone,
          email,
          registrationNumber,
          description
        })
      });

      const data = await res.json();
      if (res.ok && data.organization) {
        notify('Workspace Created', `Welcome to ${data.organization.name}!`, 'success');
        // Save active workspace locally
        localStorage.setItem(
          'mali_active_workspace',
          JSON.stringify({
            id: data.organization.id,
            name: data.organization.name,
            slug: data.organization.slug,
            type: data.organization.businessType,
            role: 'OWNER'
          })
        );
        router.push('/dashboard');
      } else {
        notify('Registration Error', data.error || 'Failed to create workspace', 'error');
      }
    } catch (err) {
      notify('Network Error', 'Could not complete registration', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Progress Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            A&E Business Operating System
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Create Your Real Estate Workspace
          </h1>
          <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto">
            Zero initial fees. Build your brand, manage listings, and receive verified leads in your dedicated SaaS console.
          </p>
        </div>

        {step === 1 ? (
          /* STEP 1: SELECT SELLER / BUSINESS TYPE */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businessTypes.map((item) => {
                const isSelected = selectedType === item.type;
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setSelectedType(item.type)}
                    className={`rounded-3xl border-2 p-6 text-left transition-all duration-300 relative flex flex-col justify-between ${
                      isSelected
                        ? `${item.color} border-slate-900 shadow-md dark:border-white`
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-800">
                          <Icon className="h-6 w-6 text-slate-900 dark:text-white" />
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{item.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Select Option</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-800 transition-all active:scale-95"
              >
                <span>Continue to Business Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: BUSINESS INFORMATION */
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedType === 'REAL_ESTATE_COMPANY'
                    ? 'Agency / Company Profile'
                    : selectedType === 'DEVELOPER'
                    ? 'Developer Profile'
                    : selectedType === 'INDEPENDENT_AGENT'
                    ? 'Independent Realtor Profile'
                    : 'Owner Seller Profile'}
                </h3>
                <p className="text-xs text-slate-500">Provide your official public business identity.</p>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                ← Change Type
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {selectedType === 'REAL_ESTATE_COMPANY'
                  ? 'Company / Agency Name *'
                  : selectedType === 'DEVELOPER'
                  ? 'Development Company Name *'
                  : 'Full Name / Trading Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Landmark Properties Ltd"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Primary County</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} County
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Town / Suburb</label>
                <input
                  type="text"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  placeholder="e.g. Westlands, Nairobi"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Official Business Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Official Contact Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@agency.co.ke"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Registration / License Number (Optional)
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. CPR/2023/12345 or ISK Member ID"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Business Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of your specialities, service areas, and property portfolio..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Includes free initial listing tier &amp; CRM</span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-emerald-700 px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-all disabled:opacity-75"
              >
                {isSubmitting ? 'Configuring Workspace...' : 'Launch Business Workspace'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
