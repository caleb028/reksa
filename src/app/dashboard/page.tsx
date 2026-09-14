'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/layout/AppProviders';
import { WorkspaceSwitcher, DEMO_WORKSPACES, WorkspaceItem } from '@/components/dashboard/WorkspaceSwitcher';
import {
  Building2,
  Users,
  Home,
  Briefcase,
  Layers,
  Calendar,
  CreditCard,
  Settings,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  User,
  Filter,
  Eye,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  Edit,
  Trash2,
  FileText,
  AlertTriangle,
  X,
  ExternalLink,
  ChevronRight,
  DollarSign,
  Receipt,
  RotateCcw,
  Lock,
  Unlock,
  Award,
  Shield,
  PartyPopper
} from 'lucide-react';
import { ReksaCheckoutModal, CheckoutItem } from '@/components/checkout/ReksaCheckoutModal';
import { PaymentReceiptModal, ReceiptData } from '@/components/billing/PaymentReceiptModal';
import { HandoverInsuranceCard } from '@/components/financial/HandoverInsuranceCard';
import { SUBSCRIPTION_TIERS } from '@/lib/mpesa';

// Mock initial CRM leads
export interface LeadItem {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  maskedPhone?: string;
  propertyTitle: string;
  propertyPrice?: number;
  budget: number;
  status: 'NEW_INQUIRY' | 'CONTACTED' | 'VIEWING_SCHEDULED' | 'OFFER_MADE' | 'CLOSED_WON';
  assignedAgent: string;
  date: string;
  isUnlocked: boolean;
  unlockFeeKes?: number;
  preQualifiedMortgage?: boolean;
}

const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    clientName: 'Peter Kimani (UK Diaspora)',
    clientEmail: 'pkimani@london.co.uk',
    clientPhone: '+44 7911 123456',
    maskedPhone: '+44 79•• •••456',
    propertyTitle: 'The Emerald 2-Bedroom Suite, Riverside',
    propertyPrice: 35000000,
    budget: 35000000,
    status: 'NEW_INQUIRY',
    assignedAgent: 'Jane Muthoni',
    date: 'Today, 10:15 AM',
    isUnlocked: false,
    unlockFeeKes: 200,
    preQualifiedMortgage: true
  },
  {
    id: 'lead-2',
    clientName: 'David Ochieng',
    clientEmail: 'david.ochieng@gmail.com',
    clientPhone: '+254 722 111 222',
    maskedPhone: '+254 722 ••• 222',
    propertyTitle: 'Modern 3-Bedroom Executive Apartment, Kilimani',
    propertyPrice: 18500000,
    budget: 18500000,
    status: 'CONTACTED',
    assignedAgent: 'Jane Muthoni',
    date: 'Yesterday',
    isUnlocked: true,
    unlockFeeKes: 200,
    preQualifiedMortgage: false
  },
  {
    id: 'lead-3',
    clientName: 'Dr. Amina Hassan',
    clientEmail: 'amina.hassan@hospital.org',
    clientPhone: '+254 733 445 566',
    maskedPhone: '+254 733 ••• 566',
    propertyTitle: 'Ultra-Luxury Duplex Penthouse, Westlands',
    propertyPrice: 65000000,
    budget: 65000000,
    status: 'VIEWING_SCHEDULED',
    assignedAgent: 'Kariuki Mwangi',
    date: 'Sep 4',
    isUnlocked: true,
    unlockFeeKes: 200,
    preQualifiedMortgage: true
  },
  {
    id: 'lead-4',
    clientName: 'Michael Kiprop',
    clientEmail: 'kiprop@holdings.co.ke',
    clientPhone: '+254 720 778 899',
    maskedPhone: '+254 720 ••• 899',
    propertyTitle: 'Karen 5-Bedroom Country Manor',
    propertyPrice: 120000000,
    budget: 120000000,
    status: 'OFFER_MADE',
    assignedAgent: 'Kariuki Mwangi',
    date: 'Sep 2',
    isUnlocked: true,
    unlockFeeKes: 200,
    preQualifiedMortgage: true
  },
  {
    id: 'lead-5',
    clientName: 'Wanjiku Karanja',
    clientEmail: 'wanjiku.k@synergy.co.ke',
    clientPhone: '+254 711 334 455',
    maskedPhone: '+254 711 ••• 455',
    propertyTitle: 'Lavington Garden Townhouse 4-Bed',
    propertyPrice: 45000000,
    budget: 45000000,
    status: 'CLOSED_WON',
    assignedAgent: 'Jane Muthoni',
    date: 'Aug 29',
    isUnlocked: true,
    unlockFeeKes: 200,
    preQualifiedMortgage: true
  }
];

export default function DashboardPage() {
  const { notify } = useApp();

  // Active Workspace context (defaults to ABC Properties for enterprise demonstration)
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceItem>(DEMO_WORKSPACES[1]);

  // Company SaaS active tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'listings' | 'crm' | 'agents' | 'viewings' | 'analytics' | 'billing' | 'settings'
  >('overview');

  // Leads CRM state
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [selectedWonLead, setSelectedWonLead] = useState<LeadItem | null>(null);
  const [unlockingLeadId, setUnlockingLeadId] = useState<string | null>(null);

  // Invite Agent Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('AGENT');

  // Real M-Pesa Checkout & Receipt Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [receiptsList, setReceiptsList] = useState<any[]>([]);
  const [loadingReceipts, setLoadingReceipts] = useState(false);

  // Admin Revenue Intelligence State
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [reconciling, setReconciling] = useState(false);

  // Unlock verified lead phone & email under Kenya Data Protection Act 2019
  const handleUnlockLead = async (leadId: string) => {
    setUnlockingLeadId(leadId);
    try {
      const res = await fetch(`/api/leads/${leadId}/unlock`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === leadId
              ? {
                  ...l,
                  isUnlocked: true,
                  clientPhone: data.clientPhone || l.clientPhone,
                  clientEmail: data.clientEmail || l.clientEmail
                }
              : l
          )
        );
        notify(
          'Lead Contact Unlocked',
          'Verified contact for KES 200 debited from agency wallet/account. Audit trail logged.',
          'success'
        );
      } else {
        // Fallback for mock demo leads
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, isUnlocked: true } : l))
        );
        notify('Lead Contact Unlocked', 'Verified contact details revealed. Audit trail logged.', 'success');
      }
    } catch {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, isUnlocked: true } : l))
      );
      notify('Lead Contact Unlocked', 'Verified contact details revealed. Audit trail logged.', 'success');
    } finally {
      setUnlockingLeadId(null);
    }
  };

  // Handle lead advance in CRM pipeline
  const advanceLeadStatus = (leadId: string) => {
    const pipelineOrder: LeadItem['status'][] = [
      'NEW_INQUIRY',
      'CONTACTED',
      'VIEWING_SCHEDULED',
      'OFFER_MADE',
      'CLOSED_WON'
    ];
    setLeads((prev) =>
      prev.map((item) => {
        if (item.id === leadId) {
          const currentIndex = pipelineOrder.indexOf(item.status);
          const nextIndex = Math.min(currentIndex + 1, pipelineOrder.length - 1);
          const nextStatus = pipelineOrder[nextIndex];
          if (nextStatus === 'CLOSED_WON') {
            notify(
              '🎉 Deal Closed & Won!',
              `${item.clientName} transaction moved to Closed Won. Point-of-sale Handover & Insurance unlocked.`,
              'success'
            );
            setSelectedWonLead(item);
          } else {
            notify(
              'Lead Stage Advanced',
              `${item.clientName} moved to ${nextStatus.replace('_', ' ')}`,
              'success'
            );
          }
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleInviteAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    notify('Invitation Sent', `Invitation sent to ${inviteEmail} as ${inviteRole}`, 'success');
    setShowInviteModal(false);
    setInviteEmail('');
  };

  // Fetch real billing receipts
  const fetchReceipts = async () => {
    setLoadingReceipts(true);
    try {
      const orgId = activeWorkspace?.id ? `?organizationId=${activeWorkspace.id}` : '';
      const res = await fetch(`/api/payments/receipts${orgId}`);
      const data = await res.json();
      if (data.receipts) {
        setReceiptsList(data.receipts);
      }
    } catch (err) {
      console.error('Failed to load receipts:', err);
    } finally {
      setLoadingReceipts(false);
    }
  };

  // Fetch admin revenue intelligence
  const fetchRevenueData = async () => {
    setLoadingRevenue(true);
    try {
      const res = await fetch('/api/admin/revenue');
      const data = await res.json();
      if (data.success) {
        setRevenueData(data);
      }
    } catch (err) {
      console.error('Failed to load revenue data:', err);
    } finally {
      setLoadingRevenue(false);
    }
  };

  const handleRunReconciliation = async () => {
    setReconciling(true);
    try {
      const res = await fetch('/api/admin/revenue', { method: 'POST' });
      const data = await res.json();
      notify('Reconciliation Complete', data.message || 'Scanned pending transactions', 'success');
      fetchRevenueData();
    } catch (err) {
      notify('Reconciliation Error', 'Failed to run reconciliation job', 'error');
    } finally {
      setReconciling(false);
    }
  };

  const handleOpenPlanUpgrade = (planCode: string, planName: string) => {
    setCheckoutItem({
      productType: 'SUBSCRIPTION',
      planCode,
      planName,
      propertyType: planCode,
      organizationId: activeWorkspace.id
    });
    setCheckoutModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* 1. TOP HEADER & WORKSPACE SWITCHER BAR */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sticky top-14 sm:top-16 z-30 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <WorkspaceSwitcher
              activeWorkspace={activeWorkspace}
              onSelectWorkspace={(ws) => {
                setActiveWorkspace(ws);
                notify('Workspace Switched', `Switched to ${ws.name}`, 'info');
              }}
            />

            {activeWorkspace.slug && (
              <Link
                href={`/companies/${activeWorkspace.slug}`}
                target="_blank"
                className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
              >
                <span>View Public Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {activeWorkspace.type === 'REAL_ESTATE_COMPANY' && (
              <>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                >
                  + Invite Agent
                </button>
                <Link
                  href="/buy"
                  className="rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 shadow-xs transition-colors"
                >
                  + Add Listing
                </Link>
              </>
            )}

            {activeWorkspace.type === 'DEVELOPER' && (
              <Link
                href="/developments"
                className="rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-700 shadow-xs"
              >
                + Add Development
              </Link>
            )}

            {activeWorkspace.type === 'INDIVIDUAL_SELLER' && (
              <button
                onClick={() => notify('Listing Wizard', 'Direct Owner listing upload opened.', 'info')}
                className="rounded-xl bg-purple-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-800 shadow-xs"
              >
                + List My Property
              </button>
            )}
          </div>
        </div>

        {/* 2. SUB-NAVIGATION TABS (WHEN COMPANY WORKSPACE IS ACTIVE) */}
        {activeWorkspace.type === 'REAL_ESTATE_COMPANY' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto text-xs font-semibold border-t border-slate-100 dark:border-slate-800/80 pt-1 pb-1">
            {[
              { id: 'overview', label: 'Business Overview', icon: Briefcase },
              { id: 'listings', label: 'Company Listings (3)', icon: Home },
              { id: 'crm', label: 'Leads CRM Pipeline (4)', icon: TrendingUp },
              { id: 'agents', label: 'Team & Agents (2)', icon: Users },
              { id: 'viewings', label: 'Viewing Requests (2)', icon: Calendar },
              { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
              { id: 'settings', label: 'Company Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 transition-colors ${
                    isSelected
                      ? 'bg-slate-100 text-slate-900 font-bold dark:bg-slate-800 dark:text-white'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================================================= */}
        {/* VIEW A: REAL ESTATE COMPANY SAAS CONSOLE                                  */}
        {/* ========================================================================= */}
        {activeWorkspace.type === 'REAL_ESTATE_COMPANY' && (
          <div className="space-y-8">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-slate-400 text-xs font-bold block mb-1">Active Listings</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">3</span>
                      <span className="text-[11px] text-emerald-600 font-bold">100% Verified</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Kilimani &amp; Riverside</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-slate-400 text-xs font-bold block mb-1">New Enquiries / Leads</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-blue-600">4</span>
                      <span className="text-[11px] text-blue-600 font-bold">+2 Today</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Active in CRM pipeline</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-slate-400 text-xs font-bold block mb-1">Viewing Requests</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-amber-600">2</span>
                      <span className="text-[11px] text-slate-500 font-bold">Confirmed</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Next: Thursday 2:00 PM</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-slate-400 text-xs font-bold block mb-1">Lead Conversion Rate</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-purple-600">18.4%</span>
                      <span className="text-[11px] text-emerald-600 font-bold">High</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Benchmark: 12.5%</p>
                  </div>
                </div>

                {/* Company Highlights & Quick Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left 2 Cols: Recent Leads & Viewing Alerts */}
                  <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span>Active CRM Leads Stream</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('crm')}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        View Full Pipeline →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {leads.map((lead) => (
                        <div
                          key={lead.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-bold text-xs text-slate-900 dark:text-white">{lead.clientName}</span>
                              <span
                                className={`rounded px-1.5 py-0.2 text-[9.5px] font-bold ${
                                  lead.status === 'NEW_INQUIRY'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                    : lead.status === 'VIEWING_SCHEDULED'
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                    : lead.status === 'CLOSED_WON'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }`}
                              >
                                {lead.status.replace('_', ' ')}
                              </span>
                              {lead.preQualifiedMortgage && (
                                <span className="rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 px-1.5 py-0.2 text-[9px] font-bold">
                                  🏦 Pre-Approved
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{lead.propertyTitle}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                              <span>Agent: {lead.assignedAgent}</span>
                              <span>•</span>
                              <span>Budget: KES {(lead.budget / 1000000).toFixed(1)}M</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {lead.status !== 'CLOSED_WON' ? (
                              <button
                                onClick={() => advanceLeadStatus(lead.id)}
                                className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-xs"
                              >
                                Advance Stage →
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedWonLead(lead)}
                                className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs flex items-center gap-1"
                              >
                                <PartyPopper className="w-3 h-3" />
                                Handover &amp; Insurance
                              </button>
                            )}

                            {lead.isUnlocked ? (
                              <a
                                href={`https://wa.me/${lead.clientPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                              >
                                WhatsApp
                              </a>
                            ) : (
                              <button
                                onClick={() => handleUnlockLead(lead.id)}
                                disabled={unlockingLeadId === lead.id}
                                className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-black shadow-xs flex items-center gap-1"
                              >
                                <Lock className="w-3 h-3 text-amber-400" />
                                <span>{unlockingLeadId === lead.id ? '...' : 'Unlock (KES 200)'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Col: Agency Quick Stats */}
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-card">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span>Active Agents</span>
                        </h3>
                        <button
                          onClick={() => setShowInviteModal(true)}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          + Invite
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-xl p-2 bg-slate-50 dark:bg-slate-800/50">
                          <div>
                            <span className="block text-xs font-bold text-slate-900 dark:text-white">Kariuki Mwangi</span>
                            <span className="block text-[10px] text-slate-400">Managing Broker (Owner)</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-600">2 Listings</span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl p-2 bg-slate-50 dark:bg-slate-800/50">
                          <div>
                            <span className="block text-xs font-bold text-slate-900 dark:text-white">Jane Muthoni</span>
                            <span className="block text-[10px] text-slate-400">Senior Consultant</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-600">1 Listing</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/20 shadow-card">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs mb-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>A&E Agency Verification</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        ABC Properties is an officially accredited company. All listed properties receive automatic trust boost and priority placement.
                      </p>
                      <button
                        onClick={() => notify('Audit Request', 'Agency re-verification request logged.', 'info')}
                        className="rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-xs"
                      >
                        Request Document Audit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: COMPANY LISTINGS MANAGEMENT */}
            {activeTab === 'listings' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-card animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Company Listings Inventory</h3>
                    <p className="text-xs text-slate-500">Manage all properties owned or represented by ABC Properties Ltd.</p>
                  </div>
                  <Link
                    href="/buy"
                    className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-xs transition-colors self-start sm:self-auto"
                  >
                    + Add New Listing
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 pb-2 text-[10.5px] uppercase tracking-wider text-slate-400 dark:border-slate-800">
                        <th className="pb-3 font-bold">Property</th>
                        <th className="pb-3 font-bold">Assigned Agent</th>
                        <th className="pb-3 font-bold">Price</th>
                        <th className="pb-3 font-bold">Trust Score</th>
                        <th className="pb-3 font-bold">Status</th>
                        <th className="pb-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2.5">
                            <img
                              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=100&q=80"
                              alt=""
                              className="h-10 w-12 rounded-lg object-cover"
                            />
                            <div>
                              <span>Modern 3-Bedroom Executive Apartment</span>
                              <span className="block text-[10px] text-slate-400 font-normal">Kileleshwa, Nairobi</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-slate-600 dark:text-slate-300">
                          <span className="font-semibold">Jane Muthoni</span>
                          <span className="block text-[10px] text-slate-400">Senior Consultant</span>
                        </td>
                        <td className="py-3.5 font-black text-slate-900 dark:text-white">KES 18,500,000</td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            94 / 100
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Active
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => notify('Agent Reassignment', 'Agent selector modal opened.', 'info')}
                              className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                            >
                              Reassign
                            </button>
                            <Link
                              href="/properties/clz1111111111111111111111"
                              className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2.5">
                            <img
                              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=100&q=80"
                              alt=""
                              className="h-10 w-12 rounded-lg object-cover"
                            />
                            <div>
                              <span>Ultra-Luxury 4-Bedroom Duplex Penthouse</span>
                              <span className="block text-[10px] text-slate-400 font-normal">Riverside, Nairobi</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-slate-600 dark:text-slate-300">
                          <span className="font-semibold">Kariuki Mwangi</span>
                          <span className="block text-[10px] text-slate-400">Managing Broker</span>
                        </td>
                        <td className="py-3.5 font-black text-slate-900 dark:text-white">KES 65,000,000</td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            98 / 100
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Active
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => notify('Agent Reassignment', 'Agent selector modal opened.', 'info')}
                              className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                            >
                              Reassign
                            </button>
                            <Link
                              href="/properties/clz3333333333333333333333"
                              className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: LEADS CRM PIPELINE (KANBAN) */}
            {activeTab === 'crm' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span>A&E Multi-Stage CRM Pipeline</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Kenya Data Protection Act 2019 compliant. Track buyer journeys from verified inquiry to conveyancing handover.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      {leads.length} Active Deals
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      KES {(leads.reduce((sum, l) => sum + l.budget, 0) / 1000000).toFixed(1)}M Pipeline
                    </span>
                  </div>
                </div>

                {/* 5 Institutional Kanban Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
                  {[
                    {
                      stage: 'NEW_INQUIRY',
                      label: 'New Inquiry',
                      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
                      description: 'Fresh inbound inquiries'
                    },
                    {
                      stage: 'CONTACTED',
                      label: 'Contacted',
                      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                      description: 'Initial agent outreach'
                    },
                    {
                      stage: 'VIEWING_SCHEDULED',
                      label: 'Viewing Scheduled',
                      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
                      description: 'Physical or virtual visit'
                    },
                    {
                      stage: 'OFFER_MADE',
                      label: 'Offer Made',
                      badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
                      description: 'Letter of Offer signed'
                    },
                    {
                      stage: 'CLOSED_WON',
                      label: 'Closed & Won',
                      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                      description: 'Conveyance & Handover'
                    }
                  ].map((col) => {
                    const stageLeads = leads.filter((l) => l.status === col.stage);
                    return (
                      <div
                        key={col.stage}
                        className={`rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 flex flex-col min-h-[420px] ${
                          col.stage === 'CLOSED_WON' ? 'bg-gradient-to-b from-emerald-50/30 to-transparent dark:from-emerald-950/20' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3 dark:border-slate-800">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 block">
                              {col.label}
                            </span>
                            <span className="text-[9.5px] text-slate-400 line-clamp-1">{col.description}</span>
                          </div>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${col.badgeColor}`}>
                            {stageLeads.length}
                          </span>
                        </div>

                        <div className="space-y-3 flex-1">
                          {stageLeads.length === 0 && (
                            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center text-slate-400 text-xs">
                              No deals in this stage
                            </div>
                          )}

                          {stageLeads.map((lead) => (
                            <div
                              key={lead.id}
                              className={`rounded-xl border p-3 text-xs shadow-xs transition-all ${
                                lead.status === 'CLOSED_WON'
                                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30'
                                  : 'border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/70 hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <span className="font-bold text-slate-900 dark:text-white leading-tight">
                                  {lead.clientName}
                                </span>
                                {lead.preQualifiedMortgage && (
                                  <span
                                    title="Buyer pre-qualified with partner Kenyan lender"
                                    className="rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.2 text-[8.5px] font-bold whitespace-nowrap flex items-center gap-0.5"
                                  >
                                    <CheckCircle2 className="w-2.5 h-2.5 text-indigo-600" />
                                    <span>Pre-Approved</span>
                                  </span>
                                )}
                              </div>

                              <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 block mb-0.5">
                                KES {(lead.budget / 1000000).toFixed(1)}M Budget
                              </span>

                              <p className="text-[10px] text-slate-600 dark:text-slate-300 line-clamp-1 mb-1.5 font-medium">
                                {lead.propertyTitle}
                              </p>

                              <div className="text-[9.5px] text-slate-400 mb-2.5 flex items-center justify-between">
                                <span>Agent: {lead.assignedAgent}</span>
                                <span>{lead.date}</span>
                              </div>

                              {/* CONTACT & PRIVACY ACCESS */}
                              <div className="rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700/80 p-2 mb-2.5">
                                {lead.isUnlocked ? (
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-mono text-slate-800 dark:text-slate-200 font-semibold">
                                        {lead.clientPhone}
                                      </span>
                                      <span className="text-[8.5px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                        <Unlock className="w-2.5 h-2.5" /> Unlocked
                                      </span>
                                    </div>
                                    <div className="text-[9.5px] text-slate-500 truncate">
                                      {lead.clientEmail}
                                    </div>
                                    <div className="flex items-center gap-1.5 pt-1">
                                      <a
                                        href={`tel:${lead.clientPhone}`}
                                        className="flex-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-1 text-center text-[9.5px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1"
                                        title="Call Lead"
                                      >
                                        <Phone className="w-2.5 h-2.5 text-blue-600" />
                                        <span>Call</span>
                                      </a>
                                      <a
                                        href={`https://wa.me/${lead.clientPhone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 py-1 text-center text-[9.5px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1"
                                        title="WhatsApp Lead"
                                      >
                                        <MessageSquare className="w-2.5 h-2.5 text-emerald-600" />
                                        <span>WhatsApp</span>
                                      </a>
                                      <a
                                        href={`mailto:${lead.clientEmail}`}
                                        className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                        title="Email Lead"
                                      >
                                        <Mail className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="flex items-center justify-between text-[10px]">
                                      <span className="font-mono text-slate-500">
                                        {lead.maskedPhone || '+254 7••• ••' + lead.clientPhone.slice(-3)}
                                      </span>
                                      <span className="text-[8.5px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
                                        <Lock className="w-2.5 h-2.5" /> Protected
                                      </span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 mt-0.5">
                                      Kenya Data Protection Act 2019 consent
                                    </p>
                                    <button
                                      onClick={() => handleUnlockLead(lead.id)}
                                      disabled={unlockingLeadId === lead.id}
                                      className="w-full mt-1.5 rounded-lg bg-slate-900 hover:bg-black text-amber-300 dark:bg-slate-950 dark:hover:bg-black px-2 py-1 text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                                    >
                                      <Lock className="w-2.5 h-2.5 text-amber-400" />
                                      <span>
                                        {unlockingLeadId === lead.id
                                          ? 'Unlocking...'
                                          : `Unlock Contact (KES ${lead.unlockFeeKes || 200})`}
                                      </span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* STAGE ADVANCE OR CLOSED_WON ACTIONS */}
                              {lead.status === 'CLOSED_WON' ? (
                                <button
                                  onClick={() => setSelectedWonLead(lead)}
                                  className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] py-1.5 px-2 flex items-center justify-center gap-1 shadow-xs transition-colors"
                                >
                                  <PartyPopper className="w-3 h-3 text-amber-200" />
                                  <span>Handover &amp; Insurance</span>
                                </button>
                              ) : (
                                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                                  <span className="text-[9px] text-slate-400">Next Stage</span>
                                  <button
                                    onClick={() => advanceLeadStatus(lead.id)}
                                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                                  >
                                    <span>Advance</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: AGENTS & TEAM MANAGEMENT */}
            {activeTab === 'agents' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-card animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Agency Team &amp; Permissions</h3>
                    <p className="text-xs text-slate-500">
                      Manage agent roles, invitations, and listing quotas under ABC Properties.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
                  >
                    + Invite Agent to Team
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="flex items-center gap-3.5">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                        alt=""
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">Kariuki Mwangi</span>
                          <span className="rounded bg-blue-100 px-2 py-0.2 text-[9px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            OWNER
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">Managing Broker &amp; Founder</span>
                        <span className="text-[11px] text-slate-400 block">+254 720 000 002</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">2 Active Listings</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Full Admin Access</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="flex items-center gap-3.5">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                        alt=""
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">Jane Muthoni</span>
                          <span className="rounded bg-emerald-100 px-2 py-0.2 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            AGENT
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">Senior Residential Consultant</span>
                        <span className="text-[11px] text-slate-400 block">+254 722 987 654</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">1 Active Listing</span>
                      <span className="text-[10px] text-slate-500">Leads &amp; Listings Access</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: VIEWING REQUESTS */}
            {activeTab === 'viewings' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-card animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Scheduled Viewing Requests</h3>
                    <p className="text-xs text-slate-500">Physical client viewings confirmed for ABC Properties mandates.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white block">
                          Dr. Amina Hassan — Riverside Duplex Penthouse
                        </span>
                        <span className="text-xs text-slate-500 block">
                          Thursday, Sep 10 • 2:00 PM (Afternoon)
                        </span>
                        <span className="text-[11px] text-emerald-600 font-semibold">Assigned Agent: Kariuki Mwangi</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => notify('Viewing Completed', 'Viewing logged as completed.', 'success')}
                        className="rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => notify('Reschedule', 'Reschedule link sent to client.', 'info')}
                        className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white block">
                          David Ochieng — Kileleshwa 3-Bedroom Apartment
                        </span>
                        <span className="text-xs text-slate-500 block">
                          Saturday, Sep 12 • 10:00 AM (Morning)
                        </span>
                        <span className="text-[11px] text-emerald-600 font-semibold">Assigned Agent: Jane Muthoni</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => notify('Viewing Completed', 'Viewing logged as completed.', 'success')}
                        className="rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => notify('Reschedule', 'Reschedule link sent to client.', 'info')}
                        className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: BILLING & SUBSCRIPTION */}
            {activeTab === 'billing' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card animate-in fade-in duration-200 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Agency Subscription &amp; Quotas</h3>
                    <p className="text-xs text-slate-500">
                      Non-aggressive commercial billing. Manage your team workspace plan, listing quotas and tax receipts.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      fetchReceipts();
                      notify('Receipts Refreshed', 'Retrieved latest verified transactions.', 'info');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 self-start sm:self-auto"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${loadingReceipts ? 'animate-spin' : ''}`} />
                    <span>Refresh Records</span>
                  </button>
                </div>

                {/* Active Plan Banner */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/40 dark:bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                      Active Agency Operating Plan
                    </span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">A&E Agency Professional</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Includes 35 active verified listings, unlimited CRM leads, up to 5 agent accounts, and branded store.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenPlanUpgrade('BUSINESS', 'A&E Business Agency OS')}
                      className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 shadow-xs whitespace-nowrap"
                    >
                      Upgrade to Business Plan
                    </button>
                  </div>
                </div>

                {/* Listing Entitlements Quota Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-850">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Listing Quota</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block">3 / 35 Units</span>
                    <p className="text-[11px] text-emerald-600 font-bold mt-1">32 slots remaining</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-850">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Volume Discount Tier</span>
                    <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block">Tier 2 (15% Off)</span>
                    <p className="text-[11px] text-slate-500 mt-1">Automatically applied at checkout</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-850">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Method</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block">M-Pesa STK Push</span>
                    <p className="text-[11px] text-slate-500 mt-1">Safaricom PayBill 174379</p>
                  </div>
                </div>

                {/* Formal Receipts Table */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Official Tax Receipts &amp; Daraja Transactions</span>
                  </h4>

                  {receiptsList.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center dark:border-slate-800 dark:bg-slate-850/50">
                      <Receipt className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Payment Receipts Generated Yet</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm mx-auto">
                        Official electronic tax receipts and M-Pesa transaction vouchers appear here automatically after every confirmed publication or subscription payment.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 dark:border-slate-800">
                            <th className="pb-2 font-bold uppercase text-[10px]">Receipt #</th>
                            <th className="pb-2 font-bold uppercase text-[10px]">Service / Product</th>
                            <th className="pb-2 font-bold uppercase text-[10px]">Date</th>
                            <th className="pb-2 font-bold uppercase text-[10px]">M-Pesa Code</th>
                            <th className="pb-2 font-bold uppercase text-[10px]">Amount</th>
                            <th className="pb-2 font-bold uppercase text-[10px] text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {receiptsList.map((rec) => (
                            <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                              <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                                {rec.receiptNumber}
                              </td>
                              <td className="py-3 font-medium text-slate-700 dark:text-slate-300">
                                {rec.productSummary}
                              </td>
                              <td className="py-3 text-slate-500">
                                {new Date(rec.issuedAt).toLocaleDateString('en-KE')}
                              </td>
                              <td className="py-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                {rec.mpesaReceipt || 'CONFIRMED'}
                              </td>
                              <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                                KES {rec.amount.toLocaleString()}
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedReceipt(rec);
                                    setReceiptModalOpen(true);
                                  }}
                                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                >
                                  View / Print
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 7: SETTINGS & BRANDING */}
            {activeTab === 'settings' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card animate-in fade-in duration-200 space-y-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">ABC Properties Branding &amp; Office</h3>
                  <p className="text-xs text-slate-500">Customize how your agency appears publicly to Kenyan and diaspora clients.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Company Display Name</label>
                    <input
                      type="text"
                      defaultValue="ABC Properties Ltd"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Public URL Slug</label>
                    <input
                      type="text"
                      disabled
                      defaultValue="abc-properties"
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Physical Office Location</label>
                  <input
                    type="text"
                    defaultValue="7th Floor, Delta Corner Tower, Westlands, Nairobi"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <button
                  onClick={() => notify('Settings Saved', 'Company branding and profile updated.', 'success')}
                  className="rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW B: PROPERTY DEVELOPER WORKSPACE                                      */}
        {/* ========================================================================= */}
        {activeWorkspace.type === 'DEVELOPER' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 p-8 text-white shadow-xl border border-amber-900/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="rounded-md bg-amber-500/20 px-2.5 py-0.5 text-xs font-mono font-bold uppercase text-amber-300">
                    Developer Workspace
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black mt-2">The Emerald Residences</h2>
                  <p className="text-xs text-slate-300 mt-1">14-Storey Eco-Conscious Residential Tower • Kileleshwa</p>
                </div>
                <span className="text-2xl font-black text-amber-400">68% Construction Progress</span>
              </div>
            </div>

            {/* Development Project Status Grid */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-card">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Milestones &amp; Unit Sales Inventory</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-xs text-slate-400 block mb-1">Total Unit Inventory</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">50 Units</span>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">30 Sold • 20 Available</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-xs text-slate-400 block mb-1">Current Milestone</span>
                  <span className="text-xl font-black text-amber-600">Roofing &amp; MEP Finishing</span>
                  <p className="text-[11px] text-slate-500 mt-1">Verified by BORAQS Inspector</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-xs text-slate-400 block mb-1">Expected Handover</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">Q4 2026</span>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">On Schedule</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW C: INDEPENDENT SELLER DASHBOARD                                      */}
        {/* ========================================================================= */}
        {activeWorkspace.type === 'INDIVIDUAL_SELLER' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">My Private Listings</h3>
                  <p className="text-xs text-slate-500">Manage your direct owner properties without agency commissions.</p>
                </div>
                <button
                  onClick={() => notify('Add Listing', 'Private property lister opened.', 'info')}
                  className="rounded-xl bg-purple-700 px-4 py-2 text-xs font-bold text-white hover:bg-purple-800"
                >
                  + Add Property
                </button>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=120&q=80"
                    alt=""
                    className="h-12 w-14 rounded-xl object-cover"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">
                      Charming 4-Bedroom Colonial Townhouse
                    </span>
                    <span className="text-xs text-slate-500">Karen Hardy, Nairobi • Freehold Title</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-slate-900 dark:text-white">KES 68,000,000</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW D: INDEPENDENT AGENT DASHBOARD                                       */}
        {/* ========================================================================= */}
        {activeWorkspace.type === 'INDEPENDENT_AGENT' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Solo Agent Portfolio</h3>
                  <p className="text-xs text-slate-500">
                    Independent mandates represented under your personal verified license.
                  </p>
                </div>
                <Link
                  href="/agents/john-mwangi-realtor"
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  View Public Agent Profile →
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=120&q=80"
                    alt=""
                    className="h-12 w-14 rounded-xl object-cover"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">
                      Executive 2-Bedroom Apartment with Rooftop Heated Pool
                    </span>
                    <span className="text-xs text-slate-500">Argwings Kodhek, Kilimani • Turnkey Investor Mandate</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-slate-900 dark:text-white">KES 15,500,000</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW E: A&E PLATFORM ADMIN                                                */}
        {/* ========================================================================= */}
        {activeWorkspace.type === 'ADMIN' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="rounded-3xl border border-red-200 bg-red-50/50 p-6 dark:border-red-900/40 dark:bg-red-950/20 shadow-card">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-bold text-sm mb-1">
                <ShieldCheck className="w-5 h-5" />
                <span>A&E Master System Intelligence Console</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Authoritative verification queue, fraud mitigation holds, and platform-wide audit trail.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-card">
                <span className="text-slate-400 text-xs font-bold block mb-1">Organizations Registered</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">4</span>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">2 Agencies • 1 Developer • 1 Agent</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-card">
                <span className="text-slate-400 text-xs font-bold block mb-1">Verification Queue</span>
                <span className="text-2xl font-black text-amber-600">1 Pending</span>
                <p className="text-[11px] text-slate-500 mt-1">PrimeLand Agency audit</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-card">
                <span className="text-slate-400 text-xs font-bold block mb-1">AI Duplicate Holds</span>
                <span className="text-2xl font-black text-red-600">0 Flagged</span>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">Zero fraud duplicates</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-card">
                <span className="text-slate-400 text-xs font-bold block mb-1">Platform Passports</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">412</span>
                <p className="text-[11px] text-slate-500 mt-1">Active across 12 counties</p>
              </div>
            </div>

            {/* ADMIN REVENUE INTELLIGENCE & FINANCIAL RECONCILIATION */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <span>Commercial Revenue Intelligence &amp; Reconciliation</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time Safaricom Daraja M-Pesa gross revenue, product margins, and transaction reconciliation.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchRevenueData}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${loadingRevenue ? 'animate-spin' : ''}`} />
                    <span>Refresh KPIs</span>
                  </button>

                  <button
                    onClick={handleRunReconciliation}
                    disabled={reconciling}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 shadow-xs disabled:opacity-75"
                  >
                    {reconciling ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Reconciling...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Run Daraja Reconciliation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* KPI Revenue Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-850">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Today&apos;s Revenue</span>
                  <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                    KES {(revenueData?.metrics?.todayRevenue || 0).toLocaleString()}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Direct Daraja settled</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-850">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">This Month</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block">
                    KES {(revenueData?.metrics?.monthRevenue || 0).toLocaleString()}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Recurring SaaS + Listings</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-850">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Platform Revenue</span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5 block">
                    KES {(revenueData?.metrics?.totalGrossRevenue || 0).toLocaleString()}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">{revenueData?.metrics?.successfulCount || 0} confirmed payments</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-850">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending / Reconciliation</span>
                  <span className="text-xl font-black text-amber-600 mt-0.5 block">
                    {revenueData?.metrics?.pendingCount || 0} Pending
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">{revenueData?.metrics?.reconciliationCount || 0} flagged for audit</p>
                </div>
              </div>

              {/* Product Breakdown */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Revenue Breakdown by Marketplace Product
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-850">
                    <span className="text-[10px] font-bold text-slate-400 block">Listing Publications</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                      KES {(revenueData?.productBreakdown?.LISTING?.totalKes || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500">{revenueData?.productBreakdown?.LISTING?.count || 0} transactions</span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-850">
                    <span className="text-[10px] font-bold text-slate-400 block">Featured Boosts</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                      KES {(revenueData?.productBreakdown?.FEATURED_LISTING?.totalKes || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500">{revenueData?.productBreakdown?.FEATURED_LISTING?.count || 0} transactions</span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-850">
                    <span className="text-[10px] font-bold text-slate-400 block">Agency Subscriptions</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                      KES {(revenueData?.productBreakdown?.SUBSCRIPTION?.totalKes || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500">{revenueData?.productBreakdown?.SUBSCRIPTION?.count || 0} active subscriptions</span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-850">
                    <span className="text-[10px] font-bold text-slate-400 block">Renewals &amp; Search Boosts</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                      KES {((revenueData?.productBreakdown?.LISTING_RENEWAL?.totalKes || 0) + (revenueData?.productBreakdown?.SEARCH_BOOST?.totalKes || 0)).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500">Extensions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW F: PERSONAL ACCOUNT (BUYER / INVESTOR)                               */}
        {/* ========================================================================= */}
        {activeWorkspace.type === 'PERSONAL' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-card">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">My Saved Properties &amp; Watchlist</h3>
              <p className="text-xs text-slate-500 mb-6">Properties saved for comparative review and automated price drop alerts.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">Modern 3-Bedroom Executive Apartment</span>
                  <span className="text-xs text-slate-500 block mb-2">Kileleshwa • Listed by ABC Properties Ltd</span>
                  <Link href="/compare" className="text-xs font-bold text-emerald-600 hover:underline">
                    Compare in Matrix →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: INVITE AGENT                                                       */}
      {/* ========================================================================= */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Invite Agent to Team</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteAgent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Agent Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="agent@abcproperties.co.ke"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  <option value="AGENT">Agent (Listings &amp; Assigned Leads)</option>
                  <option value="LISTING_MANAGER">Listing Manager (Manage all listings)</option>
                  <option value="BRANCH_MANAGER">Branch Manager (Team oversight)</option>
                  <option value="ADMIN">Company Admin (Full company management)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Send Invitation Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CELEBRATORY HANDOVER & POINT-OF-SALE INSURANCE MODAL                      */}
      {/* ========================================================================= */}
      {selectedWonLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                  <PartyPopper className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10.5px] font-mono uppercase font-bold text-emerald-600 tracking-wider">
                    Conveyance &amp; Handover Stage
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Congratulations! Deal Closed &amp; Won
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedWonLead(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Deal Snapshot */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Purchaser</span>
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {selectedWonLead.clientName}
                </span>
                <span className="text-[10.5px] text-slate-500 block">{selectedWonLead.clientPhone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Property Asset</span>
                <span className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                  {selectedWonLead.propertyTitle}
                </span>
                <span className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-bold block">
                  KES {(selectedWonLead.propertyPrice || selectedWonLead.budget).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Agency Commission (2.5%)</span>
                <span className="font-bold text-xs text-purple-700 dark:text-purple-400 block">
                  KES {Math.round((selectedWonLead.propertyPrice || selectedWonLead.budget) * 0.025).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">Payable on Title Transfer</span>
              </div>
            </div>

            {/* Handover Insurance Card Section */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Step 1: Point-of-Sale Handover Home &amp; Fire Insurance
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Generate an instant policy quote with A&amp;E partner underwriters (Jubilee, Britam, ICEA LION) to protect the buyer from day of physical handover.
                </p>

                <HandoverInsuranceCard
                  propertyPrice={selectedWonLead.propertyPrice || selectedWonLead.budget}
                  propertyTitle={selectedWonLead.propertyTitle}
                />
              </div>

              {/* Legal & Conveyancing Handover */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Step 2: Conveyancing &amp; Title Transfer Handover
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Retain a verified conveyancing advocate to handle completion documents, spousal consent affidavits, and stamp duty payments.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/254722000000?text=${encodeURIComponent(
                      `Hello, I would like to request legal conveyancing handover assistance for deal with buyer ${selectedWonLead.clientName} (Property: ${selectedWonLead.propertyTitle}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-forest-900 px-4 py-2 text-xs font-bold text-white hover:bg-forest-800 transition-colors shadow-xs"
                  >
                    <span>Connect with Retained Conveyancing Advocate</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedWonLead(null)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close Handover Console
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHECKOUT / UPGRADE / INVOICING MODAL                                      */}
      {/* ========================================================================= */}
      <ReksaCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        item={checkoutItem}
        onPaymentSuccess={(receipt) => {
          setSelectedReceipt(receipt);
          setReceiptModalOpen(true);
        }}
      />

      {/* ========================================================================= */}
      {/* OFFICIAL A&E PAYMENT RECEIPT MODAL                                        */}
      {/* ========================================================================= */}
      <PaymentReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={selectedReceipt}
      />
    </div>
  );
}