'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Building2, KeyRound, Sparkles } from 'lucide-react';
import { ApartmentCard, ApartmentCardItem } from './ApartmentCard';

interface MarketplaceShowcaseProps {
  flagships: ApartmentCardItem[];
  saleApartments: ApartmentCardItem[];
  rentApartments: ApartmentCardItem[];
}

type TabType = 'FLAGSHIPS' | 'SALE' | 'RENT';

export function MarketplaceShowcase({
  flagships,
  saleApartments,
  rentApartments
}: MarketplaceShowcaseProps) {
  const [activeTab, setActiveTab] = useState<TabType>('FLAGSHIPS');

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; count: number; description: string; viewAllHref: string; viewAllText: string }[] = [
    {
      id: 'FLAGSHIPS',
      label: 'Verified Flagships',
      icon: ShieldCheck,
      count: flagships.length,
      description: 'Properties holding Level 3 to Level 5 engineering and physical title audits.',
      viewAllHref: '/buy',
      viewAllText: 'Explore Verified Marketplace'
    },
    {
      id: 'SALE',
      label: 'Apartments for Sale',
      icon: Building2,
      count: saleApartments.length,
      description: 'Sectional title units, audited service charges, and structural certifications.',
      viewAllHref: '/apartments-for-sale',
      viewAllText: 'View All Apartments for Sale'
    },
    {
      id: 'RENT',
      label: 'Apartments for Rent',
      icon: KeyRound,
      count: rentApartments.length,
      description: 'Executive leases and verified tenancy with backup power and water infrastructure.',
      viewAllHref: '/apartments-for-rent',
      viewAllText: 'View All Rental Apartments'
    }
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  const currentItems =
    activeTab === 'FLAGSHIPS'
      ? flagships
      : activeTab === 'SALE'
      ? saleApartments
      : rentApartments;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Section Header with Centered/Aligned Intent */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Curated Kenya PropTech Portfolios</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Marketplace Showcase
          </h2>
          <p className="mt-1 text-xs text-slate-500 max-w-xl">
            {currentTab.description}
          </p>
        </div>

        {/* Tab Controls Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-850 self-start lg:self-auto border border-slate-200/60 dark:border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Property Cards Grid with Fade-in Animation */}
      <div key={activeTab} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
        {currentItems.map((item) => (
          <ApartmentCard key={item.id} property={item} />
        ))}
      </div>

      {/* Bottom Footer Link */}
      <div className="mt-8 flex justify-center sm:justify-end">
        <Link
          href={currentTab.viewAllHref}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-emerald-400 shadow-2xs transition-all"
        >
          <span>{currentTab.viewAllText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
