'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Compass,
  ShieldCheck,
  Bot,
  Sparkles,
  MapPin,
  Layers,
  Users,
  ChevronDown,
  Scale,
  User,
  Sun,
  Moon,
  Menu,
  X,
  KeyRound,
  TrendingUp,
  Hammer,
  LogIn,
  LogOut,
  Heart,
  LayoutDashboard
} from 'lucide-react';
import { useApp } from './AppProviders';
import { AuthModal } from '@/components/auth/AuthModal';

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme, comparisonList, savedPropertyIds, serverUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'PROPERTIES' | 'INTELLIGENCE' | 'TRUST' | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route change or click outside
  useEffect(() => {
    setActiveDropdown(null);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPropertiesActive = pathname?.startsWith('/apartments') || pathname === '/buy' || pathname === '/rent' || pathname === '/land' || pathname === '/developments';
  const isIntelligenceActive = pathname === '/map' || pathname?.startsWith('/neighbourhoods') || pathname?.startsWith('/tools');
  const isTrustActive = pathname === '/trust-safety' || pathname?.startsWith('/professionals');

  return (
    <>
      <header
        ref={navRef}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'border-b border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xs dark:border-slate-800/90 dark:bg-slate-950/95'
            : 'border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/80'
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
            isScrolled ? 'h-14 sm:h-15' : 'h-16'
          }`}
        >
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
            <img
              src="/images/reksa-cube.png"
              alt="REKSA PropTech Cube Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0a3871] dark:text-white">
                REKSA
              </span>
              <span className="hidden sm:block text-[8px] font-bold tracking-wider text-[#b37f1b] dark:text-amber-400 uppercase">
                Kenya&apos;s Intelligent Real Estate Platform
              </span>
            </div>
          </Link>

          {/* Streamlined Desktop Navigation: 3 Dropdowns + 1 Highlight */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {/* 1. PROPERTIES DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('PROPERTIES')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'PROPERTIES' ? null : 'PROPERTIES')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  isPropertiesActive || activeDropdown === 'PROPERTIES'
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-850 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Properties</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    activeDropdown === 'PROPERTIES' ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'PROPERTIES' && (
                <div className="absolute left-0 mt-1 w-72 rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Residential &amp; Commercial Portfolios
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/apartments-for-sale"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-emerald-300 transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold">Apartments for Sale</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Sectional title units &amp; penthouses</div>
                      </div>
                    </Link>

                    <Link
                      href="/apartments-for-rent"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-emerald-300 transition-colors"
                    >
                      <KeyRound className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold">Apartments for Rent</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Executive leases &amp; serviced units</div>
                      </div>
                    </Link>

                    <Link
                      href="/buy"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-emerald-300 transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <div>
                        <div className="font-bold">All Properties for Sale</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Villas, townhouses &amp; commercial</div>
                      </div>
                    </Link>

                    <Link
                      href="/land"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-emerald-300 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold">Land &amp; Plots</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Title-verified commercial &amp; residential</div>
                      </div>
                    </Link>

                    <Link
                      href="/developments"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-emerald-300 transition-colors"
                    >
                      <Hammer className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold">Master Developments</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Off-plan milestone tracking</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. INTELLIGENCE DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('INTELLIGENCE')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'INTELLIGENCE' ? null : 'INTELLIGENCE')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  isIntelligenceActive || activeDropdown === 'INTELLIGENCE'
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-850 dark:hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Intelligence</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    activeDropdown === 'INTELLIGENCE' ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'INTELLIGENCE' && (
                <div className="absolute left-0 mt-1 w-64 rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Spatial &amp; Market Insights
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/map"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-blue-300 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold">Intelligence Map</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">GIS zoning &amp; flood layers</div>
                      </div>
                    </Link>

                    <Link
                      href="/neighbourhoods"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-blue-300 transition-colors"
                    >
                      <Layers className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold">Micro-Markets</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Kilimani, Westlands, Nyali benchmarks</div>
                      </div>
                    </Link>

                    <Link
                      href="/tools/investment"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-blue-300 transition-colors"
                    >
                      <TrendingUp className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold">Investment Calculator</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Yields, mortgage &amp; cashflow</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. TRUST & NETWORK DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('TRUST')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'TRUST' ? null : 'TRUST')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  isTrustActive || activeDropdown === 'TRUST'
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-850 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Trust &amp; Network</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    activeDropdown === 'TRUST' ? 'rotate-180 text-teal-600' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'TRUST' && (
                <div className="absolute left-0 mt-1 w-64 rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Verification &amp; Governance
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/trust-safety"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-900 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold">Trust &amp; Verification</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">5-Tier verification standards</div>
                      </div>
                    </Link>

                    <Link
                      href="/professionals"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-900 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-colors"
                    >
                      <Users className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold">Licensed Professionals</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">ISK valuers &amp; EBK engineers</div>
                      </div>
                    </Link>

                    <Link
                      href="/onboarding/business"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-900 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold">Agency &amp; Seller Onboarding</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Join the REKSA operating network</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 4. AI ADVISOR DIRECT HIGHLIGHT */}
            <Link
              href="/ai-advisor"
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                pathname === '/ai-advisor'
                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 shadow-2xs'
                  : 'text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Advisor</span>
            </Link>
          </nav>

          {/* Right Actions: Comparison, Watchlist, Theme, Auth / Dashboard */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Comparison Matrix Link (Only shown when active items exist) */}
            {comparisonList.length > 0 && (
              <Link
                href="/compare"
                className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200 dark:border-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare ({comparisonList.length})</span>
              </Link>
            )}

            {/* Saved Watchlist Link */}
            {savedPropertyIds.length > 0 && (
              <Link
                href="/saved"
                className="flex items-center gap-1.5 rounded-xl bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 border border-rose-200 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
                title="View Saved Watchlist"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span className="hidden sm:inline">Saved</span>
                <span>({savedPropertyIds.length})</span>
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Authoritative User Authentication Area */}
            {serverUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 shadow-2xs transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white font-black text-xs">
                    {serverUser.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="font-bold text-[11px] text-slate-900 dark:text-white leading-tight truncate max-w-[100px]">
                      {serverUser.name?.split(' ')[0]}
                    </div>
                    <div className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 leading-tight">
                      {serverUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {serverUser.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {serverUser.email}
                      </p>
                      <span className="mt-1 inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {serverUser.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Platform Dashboard</span>
                      </Link>

                      <Link
                        href="/saved"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>Saved Watchlist</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sign In</span>
                </button>

                <Link
                  href="/onboarding/business"
                  className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>For Agencies</span>
                </Link>
              </div>
            )}

            {/* Dashboard Primary CTA */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition-all hover:bg-emerald-800 active:scale-95"
            >
              <span>Dashboard</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Clean Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden animate-in slide-in-from-top-2">
            <div className="space-y-3">
              {/* Properties Section */}
              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
                <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Properties
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <Link
                    href="/apartments-for-sale"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800"
                  >
                    Apts for Sale
                  </Link>
                  <Link
                    href="/apartments-for-rent"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800"
                  >
                    Apts for Rent
                  </Link>
                  <Link
                    href="/buy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800"
                  >
                    Buy Marketplace
                  </Link>
                  <Link
                    href="/land"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800"
                  >
                    Land &amp; Plots
                  </Link>
                </div>
              </div>

              {/* Intelligence & Trust */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/map"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-800 dark:border-slate-800 dark:text-slate-200"
                >
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>Spatial Map</span>
                </Link>
                <Link
                  href="/ai-advisor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs font-bold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Advisor</span>
                </Link>
                <Link
                  href="/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-xs font-bold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Watchlist ({savedPropertyIds.length})</span>
                </Link>
                <Link
                  href="/trust-safety"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-800 dark:border-slate-800 dark:text-slate-200"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Trust Standards</span>
                </Link>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                {serverUser ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out ({serverUser.name?.split(' ')[0]})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-800 dark:border-slate-800 dark:text-slate-200"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sign In / Register</span>
                  </button>
                )}

                <Link
                  href="/onboarding/business"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-700 dark:border-slate-800 dark:text-slate-300"
                >
                  Agency &amp; Seller Onboarding
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-xs"
                >
                  Open Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Authentication Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}