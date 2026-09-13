'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Scale, MapPin, Bed, Bath, Maximize2, ShieldCheck, TrendingUp, ArrowRight, Building2 } from 'lucide-react';
import { TrustScore } from '@/components/ui/TrustScore';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { useApp } from '@/components/layout/AppProviders';

export interface PropertyCardItem {
  id: string;
  passportId: string;
  title: string;
  slug: string;
  propertyType: string;
  listingIntent: string;
  price: number;
  rentalYieldEstimate?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sizeSqm?: number | null;
  landAcreage?: number | null;
  town: string;
  estate?: string | null;
  countyName: string;
  trustScore: number;
  verificationLevel: number;
  imageUrl?: string;
  isFeatured?: boolean;
  sellerType?: string | null;
  organizationName?: string | null;
  organizationSlug?: string | null;
  agentName?: string | null;
}

export function PropertyCard({ property }: { property: PropertyCardItem }) {
  const { comparisonList, toggleCompare, isSaved, toggleSaveProperty } = useApp();
  const isCompared = comparisonList.includes(property.id);
  const saved = isSaved(property.id);

  const fallbackImage = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
  const displayImage = property.imageUrl || fallbackImage;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-premium dark:border-slate-800 dark:bg-slate-900">
      {/* Media & Top Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={displayImage}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 transition-transform duration-300 group-hover:translate-x-0.5">
          <VerificationBadge level={property.verificationLevel} size="sm" />
          {property.isFeatured && (
            <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Passport Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-md bg-slate-950/80 px-2 py-1 text-xs font-mono font-medium text-white backdrop-blur-md">
            ID: {property.passportId}
          </span>
        </div>

        {/* Action buttons (Save & Compare) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(property.id, {
                title: property.title,
                price: property.price,
                imageUrl: displayImage,
                town: property.town
              });
            }}
            title={isCompared ? 'Remove from AI comparison' : 'Add to AI comparison matrix'}
            className={`rounded-full p-2 backdrop-blur-md transition-all duration-200 active:scale-90 hover:scale-110 shadow-sm ${
              isCompared
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/85 text-slate-700 hover:bg-white dark:bg-slate-900/85 dark:text-slate-300'
            }`}
          >
            <Scale className={`w-4 h-4 transition-transform ${isCompared ? 'scale-110' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleSaveProperty(property.id, property.title);
            }}
            title={saved ? 'Remove from saved' : 'Save property'}
            className={`rounded-full p-2 backdrop-blur-md transition-all duration-200 active:scale-90 hover:scale-110 shadow-sm ${
              saved
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white/85 text-slate-700 hover:bg-white dark:bg-slate-900/85 dark:text-slate-300'
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform ${saved ? 'fill-current scale-110 text-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Price & Intent */}
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              KES {property.price.toLocaleString()}
            </span>
            {property.listingIntent === 'RENT' && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">/month</span>
            )}
          </div>
          {property.rentalYieldEstimate && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <TrendingUp className="w-3 h-3" />
              {property.rentalYieldEstimate}% Yield
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/properties/${property.id}`} className="hover:underline">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-900 transition-colors hover:text-emerald-700 dark:text-slate-100 dark:hover:text-emerald-400">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{property.estate ? `${property.estate}, ` : ''}{property.town}, {property.countyName}</span>
        </div>

        {/* Seller & Business Attribution */}
        <div className="mt-2.5 flex items-center justify-between border-t border-slate-100/80 pt-2 text-[11px] text-slate-500 dark:text-slate-400 dark:border-slate-800/80">
          {property.sellerType === 'INDIVIDUAL_SELLER' ? (
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Direct Owner
            </span>
          ) : property.sellerType === 'INDEPENDENT_AGENT' ? (
            <Link
              href={property.organizationSlug ? `/agents/${property.organizationSlug}` : '#'}
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-400 truncate max-w-[150px]"
            >
              Agent: {property.agentName || 'Verified Agent'}
            </Link>
          ) : property.organizationName ? (
            <Link
              href={`/companies/${property.organizationSlug || ''}`}
              className="font-medium text-slate-700 hover:underline dark:text-slate-300 truncate max-w-[160px] flex items-center gap-1"
            >
              <Building2 className="w-3 h-3 text-blue-600 flex-shrink-0" />
              <span className="truncate">{property.organizationName}</span>
            </Link>
          ) : (
            <span>Verified Listing</span>
          )}

          <span className="font-medium text-slate-400">
            {property.listingIntent === 'SALE' ? 'Sale' : 'Rent'}
          </span>
        </div>

        {/* Specs */}
        <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
          {property.bedrooms !== null && property.bedrooms !== undefined && (
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms !== null && property.bathrooms !== undefined && (
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          {property.sizeSqm && (
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.sizeSqm} sqm</span>
            </div>
          )}
          {property.landAcreage && (
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.landAcreage} Acres</span>
            </div>
          )}
        </div>

        {/* Footer: Trust Score & Link */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <TrustScore score={property.trustScore} size="sm" />
          <Link
            href={`/properties/${property.id}`}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            View Passport →
          </Link>
        </div>
      </div>
    </div>
  );
}