import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  ShieldCheck,
  Award,
  Users,
  Home,
  CheckCircle2,
  Star,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { TrustScore } from '@/components/ui/TrustScore';
import { PropertyCard } from '@/components/marketplace/PropertyCard';

interface Props {
  params: {
    slug: string;
  };
}

export default async function CompanyProfilePage({ params }: Props) {
  const { slug } = params;

  const company = await db.organization.findUnique({
    where: { slug },
    include: {
      members: {
        where: { isActive: true },
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, avatar: true }
          },
          _count: {
            select: { assignedListings: true }
          }
        }
      },
      properties: {
        where: { status: 'ACTIVE' },
        include: {
          county: true,
          neighbourhood: true,
          images: { take: 1, orderBy: { orderIndex: 'asc' } },
          passport: true,
          assignedAgentMember: {
            include: { user: { select: { name: true } } }
          }
        },
        orderBy: { trustScore: 'desc' }
      },
      developments: {
        include: {
          county: true,
          units: true
        }
      }
    }
  });

  if (!company) {
    notFound();
  }

  const activeCount = company.properties.length;
  const agentsCount = company.members.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* 1. BRAND COVER BANNER */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
        <img
          src={company.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80'}
          alt={company.name}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      {/* 2. COMPANY HEADER PROFILE CARD */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-2 border-white dark:border-slate-800 bg-white p-2 shadow-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img
                  src={company.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80'}
                  alt={company.name}
                  className="h-full w-full object-contain rounded-xl"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    {company.verificationBadge || 'REKSA VERIFIED COMPANY'}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {company.businessType.replace(/_/g, ' ')}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {company.name}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{company.address || `${company.town}, ${company.county} County`}</span>
                  </div>
                  {company.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{company.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Trust Gauge & Actions */}
            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 dark:border-slate-800">
              <div className="text-center">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">Company Trust</span>
                <TrustScore score={company.trustScore} size="md" />
              </div>

              <div className="flex flex-col gap-2">
                {company.phone && (
                  <a
                    href={`tel:${company.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Agency</span>
                  </a>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Official Website</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Active Listings</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">{activeCount}</span>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Licensed Agents</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">{agentsCount}</span>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Primary County</span>
              <span className="text-xl font-black text-emerald-600">{company.county}</span>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Registration</span>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block truncate">
                {company.registrationNumber || 'Verified BORAQS/CPR'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: LISTINGS & AGENTS */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Active Properties */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-emerald-600" />
                  <span>Verified Portfolio by {company.name}</span>
                </h2>
                <span className="text-xs text-slate-500 font-medium">{activeCount} available properties</span>
              </div>

              {activeCount === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                  <Home className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">No active listings currently</h3>
                  <p className="text-xs text-slate-500 mt-1">This agency is currently updating its inventory.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {company.properties.map((p) => (
                    <PropertyCard
                      key={p.id}
                      property={{
                        id: p.id,
                        passportId: p.passportId,
                        title: p.title,
                        slug: p.slug,
                        propertyType: p.propertyType,
                        listingIntent: p.listingIntent,
                        price: p.price,
                        rentalYieldEstimate: p.rentalYieldEstimate,
                        bedrooms: p.bedrooms,
                        bathrooms: p.bathrooms,
                        sizeSqm: p.sizeSqm,
                        landAcreage: p.landAcreage,
                        town: p.town,
                        estate: p.estate,
                        countyName: p.county.name,
                        trustScore: p.trustScore,
                        verificationLevel: p.verificationLevel,
                        imageUrl: p.images[0]?.url,
                        isFeatured: p.isFeatured,
                        sellerType: p.sellerType,
                        organizationName: company.name,
                        organizationSlug: company.slug,
                        agentName: p.assignedAgentMember?.user?.name
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Team Roster & Direct Agency Contact */}
          <div className="space-y-6">
            {/* About Agency */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">About {company.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {company.description ||
                  `${company.name} is a verified Kenyan real estate agency operating under national professional standards, offering transparent conveyancing and property investments.`}
              </p>
            </div>

            {/* Meet The Team */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Licensed Team</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">{agentsCount} Agents</span>
              </div>

              <div className="space-y-3">
                {company.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={m.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={m.user.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <span className="block text-xs font-bold text-slate-900 dark:text-white">{m.user.name}</span>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400">{m.title || m.role}</span>
                      </div>
                    </div>

                    {m.phone && (
                      <a
                        href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                      >
                        Chat
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Inquiry Form */}
            <div className="rounded-3xl border border-blue-200/80 bg-gradient-to-b from-blue-50/50 to-white p-6 dark:border-blue-900/40 dark:from-blue-950/20 dark:to-slate-900 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Direct Agency Inquiry</h3>
              <p className="text-xs text-slate-500 mb-4">Send a direct mandate request to {company.name}.</p>

              <form className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Samuel Mutiso"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Property or Inquiry Details</label>
                  <textarea
                    rows={3}
                    placeholder="I am looking for a 3-bedroom apartment in Kilimani with ready sectional title..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  className="w-full rounded-xl bg-blue-700 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-sm"
                >
                  Submit Inquiry to CRM
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
