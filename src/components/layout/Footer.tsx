'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, Heart, ExternalLink, MapPin } from 'lucide-react';
import { KENYA_COUNTIES } from '@/lib/constants/kenya';

export function Footer() {
  const popularCounties = KENYA_COUNTIES.slice(0, 16);

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3.5 mb-3.5">
              <img
                src="/images/reksa-cube.png"
                alt="Ardhi & Estates Logo"
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain filter drop-shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                  <span>Ardhi</span>
                  <span className="text-[#D4A24C] font-serif font-black">&amp;</span>
                  <span>Estates</span>
                </span>
                <span className="text-[10px] font-bold text-[#c59228] tracking-wider uppercase mt-1">
                  Kenya&apos;s Intelligent Real Estate Platform
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Ardhi &amp; Estates is Kenya&apos;s premier digital property intelligence, search and verification platform. Providing algorithmic yield modeling, transparent verification signals, and market analysis across all 47 counties.
            </p>
            <div className="text-xs font-mono font-bold text-[#c59228]">
              SEARCH • VERIFY • ANALYSE • INVEST
            </div>
          </div>

          {/* Core Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/buy" className="hover:text-white transition-colors">Verified Residential Properties</Link></li>
              <li><Link href="/rent" className="hover:text-white transition-colors">Rental Yield Hub</Link></li>
              <li><Link href="/land" className="hover:text-white transition-colors">Land Intelligence & Beacon Maps</Link></li>
              <li><Link href="/developments" className="hover:text-white transition-colors">New Developments & Milestones</Link></li>
              <li><Link href="/map" className="hover:text-white transition-colors">Interactive GIS Property Map</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">AI Property Comparison Matrix</Link></li>
              <li><Link href="/professionals" className="hover:text-white transition-colors">Verified Inspectors & Valuers</Link></li>
            </ul>
          </div>

          {/* Intelligence & Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Intelligence & Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/ai-advisor" className="hover:text-white transition-colors">A&amp;E AI Property Advisor</Link></li>
              <li><Link href="/tools/affordability" className="hover:text-white transition-colors">Affordability Estimator</Link></li>
              <li><Link href="/tools/investment" className="hover:text-white transition-colors">Mortgage & Scenario Simulator</Link></li>
              <li><Link href="/tools/document-review" className="hover:text-white transition-colors">AI Deed & Plan Reviewer</Link></li>
              <li><Link href="/trust-safety" className="hover:text-white transition-colors">Trust & Safety Guidelines</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">User & Role Dashboard</Link></li>
            </ul>
          </div>

          {/* Transparency & Legal Notice */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Verification Transparency
            </h4>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] leading-relaxed text-slate-400">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Statutory Notice</span>
              </div>
              A&amp;E (Ardhi and Estates) is an independent property technology and intelligence platform. We never certify official title deeds or state land registers. All automated title analyses and trust scores are algorithmic signals intended to assist certified advocates, surveyors, and valuers.
            </div>
          </div>
        </div>

        {/* 47 Counties Quick Directory */}
        <div className="border-t border-slate-800 pt-8 pb-6">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span>Coverage Across All 47 Kenyan Counties</span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
            {popularCounties.map((c) => (
              <span key={c.code} className="hover:text-emerald-400 cursor-default">
                {c.name} ({c.code.toString().padStart(2, '0')}) •
              </span>
            ))}
            <span className="text-emerald-400 font-semibold">+ 31 more counties mapped</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 pt-6 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} A&amp;E (Ardhi and Estates). All rights reserved. Built for the Kenyan PropTech Ecosystem.
          </div>
          <div className="mt-2 sm:mt-0 flex gap-4">
            <Link href="/trust-safety" className="hover:text-slate-300">Trust Framework</Link>
            <Link href="/trust-safety" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/trust-safety" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}