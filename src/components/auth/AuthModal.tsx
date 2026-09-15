'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, Building2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/components/layout/AppProviders';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'SIGN_IN' | 'REGISTER' | 'DEMO';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'SIGN_IN' }: AuthModalProps) {
  const { refreshUser, notify } = useApp();
  const [activeTab, setActiveTab] = useState<'SIGN_IN' | 'REGISTER' | 'DEMO'>(defaultTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'BUYER' | 'INVESTOR' | 'AGENT' | 'DEVELOPER' | 'PROFESSIONAL'>('BUYER');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (loginEmail?: string, loginPassword?: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail || email,
          password: loginPassword || password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in. Please verify your credentials.');
      }

      await refreshUser();
      notify('Signed In Successfully', `Welcome back, ${data.user?.name || 'User'}!`, 'success');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please check your details.');
      }

      notify('Account Created', 'Your account was created. Signing you in...', 'success');
      // Automatically log in
      await handleLogin(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: 'SUPER_ADMIN',
      title: 'Platform Administrator',
      desc: 'Complete control, audit logs, system verification & compliance',
      email: 'admin@malitrace.co.ke',
      badge: 'Admin'
    },
    {
      role: 'REAL_ESTATE_COMPANY',
      title: 'ABC Properties Ltd (Agency)',
      desc: 'Multi-agent CRM pipeline, inventory & performance dashboard',
      email: 'kariuki@abcproperties.co.ke',
      badge: 'Agency Owner'
    },
    {
      role: 'AGENT',
      title: 'Brian Mwangi (Licensed Realtor)',
      desc: 'Assigned listings, viewing requests, client inquiries',
      email: 'agent@malitrace.co.ke',
      badge: 'Agent'
    },
    {
      role: 'DEVELOPER',
      title: 'The Emerald Developments',
      desc: 'Master developments, milestone progress, unit inventory',
      email: 'developer@malitrace.co.ke',
      badge: 'Developer'
    },
    {
      role: 'BUYER',
      title: 'Wanjiku Kamau (Investor/Buyer)',
      desc: 'Watchlist, due diligence requests, mortgage calculator',
      email: 'buyer@malitrace.co.ke',
      badge: 'Buyer'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <img src="/images/reksa-cube.png" alt="Ardhi & Estates" className="h-10 w-10 object-contain filter drop-shadow-xs" />
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-[#0B3D2E] dark:text-emerald-400 flex items-center gap-1 leading-none">
              <span>Ardhi</span>
              <span className="text-[#D4A24C] font-serif font-black">&amp;</span>
              <span>Estates</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
              Account Security Portal
            </span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 ml-auto">
            Secure Auth
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-slate-100 p-1 mb-5 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => { setActiveTab('SIGN_IN'); setErrorMsg(''); }}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === 'SIGN_IN'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('REGISTER'); setErrorMsg(''); }}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === 'REGISTER'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('DEMO'); setErrorMsg(''); }}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'DEMO'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Demo Access</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900">
            {errorMsg}
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {activeTab === 'SIGN_IN' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-3.5"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., yourname@domain.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-800 active:scale-98 transition-all disabled:opacity-75"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In to A&amp;E</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {activeTab === 'REGISTER' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name / Business Contact
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Mwangi"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 7..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Account Type
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                <option value="BUYER">Property Buyer / Tenant / Private Owner</option>
                <option value="INVESTOR">Institutional / Diaspora Real Estate Investor</option>
                <option value="AGENT">Licensed Realtor / Property Agent</option>
                <option value="DEVELOPER">Property Development Company</option>
                <option value="PROFESSIONAL">Licensed Valuer / Structural Inspector / Surveyor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Set Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-800 active:scale-98 transition-all disabled:opacity-75"
            >
              {isLoading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account &amp; Access Platform</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 3. QUICK DEMO ACCESS FOR REVIEW & TESTING */}
        {activeTab === 'DEMO' && (
          <div className="space-y-2">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              One-click access to seeded production accounts for staging testing without manual password entry:
            </p>
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleLogin(acc.email, 'MaliTrace@2026!')}
                disabled={isLoading}
                className="flex w-full items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-500 hover:shadow-xs transition-all text-left dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      {acc.title}
                    </span>
                    <span className="rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 text-[9px] font-bold">
                      {acc.badge}
                    </span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {acc.desc}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
