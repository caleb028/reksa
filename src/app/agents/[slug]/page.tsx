import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import {
  UserCheck,
  MapPin,
  Phone,
  Mail,
  Award,
  Home,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { PropertyCard } from '@/components/marketplace/PropertyCard';
import { TrustScore } from '@/components/ui/TrustScore';

interface Props {
  params: {
    slug: string;
  };
}

export default async function AgentProfilePage({ params }: Props) {
  const { slug } = params;

  // Search by organization slug (for independent agent orgs) or agent user id/slug
  const org = await db.organization.findFirst({
    where: {
      slug,
      businessType: { in: ['INDEPENDENT_AGENT', 'REAL_ESTATE_COMPANY'] }
    },
    include: {
      members: {
        include: {
          user: true,
          assignedListings: {
            where: { status: 'ACTIVE' },
            include: {
              county: true,
              neighbourhood: true,
              images: { take: 1, orderBy: { orderIndex: 'asc' } },
              passport: true
            }
          }
        }
      },
      properties: {
        where: { status: 'ACTIVE' },
        include: {
          county: true,
          neighbourhood: true,
          images: { take: 1, orderBy: { orderIndex: 'asc' } },
          passport: true
        }
      }
    }
  });

  if (!org) {
    notFound();
  }

  const primaryMember = org.members[0];
  const agentUser = primaryMember?.user;
  const isIndependent = org.businessType === 'INDEPENDENT_AGENT';
  const properties = org.properties.length > 0 ? org.properties : (primaryMember?.assignedListings || []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Agent Profile Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={agentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                alt={agentUser?.name || org.name}
                className="h-28 w-28 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-md flex-shrink-0"
              />

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-bold ${
                    isIndependent
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isIndependent ? 'Independent Agent' : 'Company Affiliated Agent'}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {org.verificationBadge || 'IDENTITY VERIFIED'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {agentUser?.name || org.name}
                </h1>

                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {primaryMember?.title || (isIndependent ? 'Licensed Independent Property Consultant' : `Associate at ${org.name}`)}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{org.town || 'Nairobi'}, {org.county || 'Nairobi'} County</span>
                  </div>
                  {org.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{org.phone}</span>
                    </div>
                  )}
                  {org.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{org.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
              {org.phone && (
                <a
                  href={`https://wa.me/${org.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Agent</span>
                </a>
              )}
              {org.phone && (
                <a
                  href={`tel:${org.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Call Direct</span>
                </a>
              )}
            </div>
          </div>

          {/* Bio & Details */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Professional Background</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {org.description ||
                'Licensed real estate practitioner dedicated to transparent advisory, clean title verifications, and professional representation for buyers, landlords, and investors.'}
            </p>
          </div>
        </div>

        {/* Listings Portfolio */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-emerald-600" />
                <span>Active Mandates &amp; Listings</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Properties directly represented by {agentUser?.name || org.name}</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">{properties.length} Listings</span>
          </div>

          {properties.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <Home className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No active listings available</h3>
              <p className="text-xs text-slate-500 mt-1">This agent is currently reviewing new property mandates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
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
                    sellerType: org.businessType,
                    organizationName: isIndependent ? null : org.name,
                    organizationSlug: isIndependent ? null : org.slug,
                    agentName: agentUser?.name
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
