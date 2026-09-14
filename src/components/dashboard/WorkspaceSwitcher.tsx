'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  ChevronDown,
  Check,
  Plus,
  User,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

export interface WorkspaceItem {
  id: string;
  name: string;
  slug?: string;
  type: 'PERSONAL' | 'INDIVIDUAL_SELLER' | 'INDEPENDENT_AGENT' | 'REAL_ESTATE_COMPANY' | 'DEVELOPER' | 'ADMIN';
  role?: string;
  badge?: string;
}

export const DEMO_WORKSPACES: WorkspaceItem[] = [
  {
    id: 'personal_user',
    name: 'My Personal Account',
    type: 'PERSONAL',
    role: 'Buyer / Investor',
    badge: 'Personal'
  },
  {
    id: 'abc_properties',
    name: 'ABC Properties Ltd',
    slug: 'abc-properties',
    type: 'REAL_ESTATE_COMPANY',
    role: 'Owner / Managing Broker',
    badge: 'Agency Pro'
  },
  {
    id: 'primeland_agency',
    name: 'PrimeLand Agency Ltd',
    slug: 'primeland-agency',
    type: 'REAL_ESTATE_COMPANY',
    role: 'Company Admin',
    badge: 'Business'
  },
  {
    id: 'emerald_developments',
    name: 'The Emerald Residences',
    slug: 'the-emerald-developments',
    type: 'DEVELOPER',
    role: 'Lead Developer',
    badge: 'Developer'
  },
  {
    id: 'john_mwangi_agent',
    name: 'John Mwangi — Realtor',
    slug: 'john-mwangi-realtor',
    type: 'INDEPENDENT_AGENT',
    role: 'Independent Agent',
    badge: 'Solo Agent'
  },
  {
    id: 'wanjiku_seller',
    name: 'Wanjiku Kamau (Karen Home)',
    type: 'INDIVIDUAL_SELLER',
    role: 'Property Owner',
    badge: 'Private Seller'
  },
  {
    id: 'ae_platform_admin',
    name: 'A&E Platform Console',
    type: 'ADMIN',
    role: 'Super Administrator',
    badge: 'Admin'
  }
];

interface Props {
  activeWorkspace: WorkspaceItem;
  onSelectWorkspace: (workspace: WorkspaceItem) => void;
}

export function WorkspaceSwitcher({ activeWorkspace, onSelectWorkspace }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: WorkspaceItem['type']) => {
    switch (type) {
      case 'REAL_ESTATE_COMPANY':
        return <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'DEVELOPER':
        return <Building className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'INDEPENDENT_AGENT':
        return <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'INDIVIDUAL_SELLER':
        return <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'ADMIN':
        return <ShieldCheck className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <User className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          {getIcon(activeWorkspace.type)}
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-[190px]">
              {activeWorkspace.name}
            </span>
            {activeWorkspace.badge && (
              <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-mono font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {activeWorkspace.badge}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block">{activeWorkspace.role}</span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Select Business Workspace
            </div>

            <div className="space-y-1 max-h-80 overflow-y-auto py-1">
              {DEMO_WORKSPACES.map((ws) => {
                const isSelected = activeWorkspace.id === ws.id;
                return (
                  <button
                    key={ws.id}
                    onClick={() => {
                      onSelectWorkspace(ws);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                        {getIcon(ws.type)}
                      </div>
                      <div>
                        <div className="font-bold">{ws.name}</div>
                        <div className="text-[10px] text-slate-400">{ws.role}</div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800">
              <Link
                href="/onboarding/business"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
              >
                <Plus className="w-4 h-4" />
                <span>+ Register New Business Profile</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
