'use client';

import React from 'react';
import { CheckCircle2, Shield, AlertCircle, Building, CheckCheck } from 'lucide-react';

interface VerificationBadgeProps {
  level: number; // 0 - 5
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadge({ level, showText = true, size = 'md' }: VerificationBadgeProps) {
  const configs = [
    {
      label: 'Unverified (Level 0)',
      short: 'Unverified',
      bg: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      icon: AlertCircle,
      description: 'Preliminary self-listing. No platform verification completed.'
    },
    {
      label: 'Profile Reviewed (Level 1)',
      short: 'Tier 1 Verified',
      bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
      icon: Shield,
      description: 'Seller / Agent identity & credentials checked.'
    },
    {
      label: 'Location Confirmed (Level 2)',
      short: 'Tier 2 Verified',
      bg: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800',
      icon: Building,
      description: 'GPS boundary coordinates spatially confirmed.'
    },
    {
      label: 'Documentation Reviewed (Level 3)',
      short: 'Tier 3 Verified',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
      icon: CheckCircle2,
      description: 'Title deeds and sectional plans scanned and reviewed.'
    },
    {
      label: 'Inspected (Level 4)',
      short: 'Tier 4 Inspected',
      bg: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
      icon: CheckCheck,
      description: 'On-site physical inspection performed by licensed professional.'
    },
    {
      label: 'Official Registry Verified (Level 5)',
      short: 'Tier 5 Official',
      bg: 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
      icon: CheckCheck,
      description: 'Officially cross-referenced with Ministry of Lands / ArdhiSasa registry.'
    }
  ];

  const current = configs[Math.min(level, 5)] || configs[0];
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3.5 py-1.5 gap-2'
  };

  return (
    <div
      title={current.description}
      className={`inline-flex items-center rounded-full border transition-all ${sizeClasses[size]} ${current.bg}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {showText && <span>{current.short}</span>}
    </div>
  );
}