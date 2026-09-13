'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  Scale,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  TrendingUp,
  Building,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { TrustScore } from '@/components/ui/TrustScore';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { useApp } from '@/components/layout/AppProviders';

export interface ApartmentCardItem {
  id: string;
  passportId: string;
  title: string;
  slug: string;
  propertyType: string;
  listingIntent: string; // SALE or RENT
  price: number;
  monthlyRent?: number | null;
  serviceCharge?: number | null;
  rentalYieldEstimate?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sizeSqm?: number | null;
  floorNumber?: number | null;
  totalFloors?: number | null;
  parkingSpaces?: number | null;
  balcony?: boolean;
  elevator?: boolean;
  borehole?: boolean;
  backupGenerator?: boolean;
  swimmingPool?: boolean;
  gym?: boolean;
  completionStatus?: string | null;
  furnishingStatus?: string | null;
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

export function ApartmentCard({ property }: { property: ApartmentCardItem }) {
  const { comparisonList, toggleCompare, isSaved, toggleSaveProperty } = useApp();
  const isCompared = comparisonList.includes(property.id);
  const saved = isSaved(property.id);

  const fallbackImage = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
  const displayImage = property.imageUrl || fallbackImage;

  const isRent = property.listingIntent === 'RENT';
  const pricePerSqm = property.sizeSqm && property.price && !isRent
    ? Math.round(property.price / property.sizeSqm)
    : null;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-premium dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Media Aspect Ratio Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={displayImage}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Soft Contrast Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        {/* Top Badges (Intent + Verification + Featured) */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm ${
              isRent ? 'bg-indigo-600' : 'bg-emerald-700'
            }`}
          >
            {isRent ? 'For Rent' : 'For Sale'}
          </span>
          <VerificationBadge level={property.verificationLevel} size="sm" />
          {property.isFeatured && (
            <span className="rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-sm">
              Verified Lead
            </span>
          )}
        </div>

        {/* Save & Compare Floating Action Buttons */}
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
            <Scale className={`w-3.5 h-3.5 transition-transform ${isCompared ? 'scale-110' : ''}`} />
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
            <Heart className={`w-3.5 h-3.5 transition-transform ${saved ? 'fill-current scale-110 text-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Passport Number */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white z-10">
          <span className="rounded-md bg-slate-950/80 px-2 py-0.5 font-mono text-[10px] backdrop-blur-md">
            {property.passportId}
          </span>
          {property.floorNumber && (
            <span className="rounded-md bg-slate-950/80 px-2 py-0.5 font-medium text-[10px] backdrop-blur-md flex items-center gap-1">
              <Layers className="w-3 h-3 text-emerald-400" />
              <span>Floor {property.floorNumber}{property.totalFloors ? ` of ${property.totalFloors}` : ''}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Price & Rent Header */}
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-400 mr-1">KES</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {property.price.toLocaleString()}
            </span>
            {isRent && <span className="text-xs text-slate-500 font-medium"> / mo</span>}
          </div>

          {/* Observed Yield or Price/Sqm Metric */}
          {property.rentalYieldEstimate && (
            <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <TrendingUp className="w-3 h-3" />
              <span>{property.rentalYieldEstimate.toFixed(1)}% Yield</span>
            </div>
          )}
          {pricePerSqm && !property.rentalYieldEstimate && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              KES {pricePerSqm.toLocaleString()} / sqm
            </span>
          )}
        </div>

        {/* Location Info */}
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
          <span className="truncate">
            {property.estate ? `${property.estate}, ` : ''}{property.town} • {property.countyName}
          </span>
        </div>

        {/* Title Link */}
        <Link href={`/properties/${property.id}`} className="mt-2 group-hover:text-emerald-600 transition-colors">
          <h3 className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-white leading-snug">
            {property.title}
          </h3>
        </Link>

        {/* Seller / Business Attribution */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
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
              <Building className="w-3 h-3 text-blue-600 flex-shrink-0" />
              <span className="truncate">{property.organizationName}</span>
            </Link>
          ) : (
            <span>Verified Listing</span>
          )}

          <span className="font-medium text-slate-400">
            {property.listingIntent === 'SALE' ? 'Sale' : 'Rent'}
          </span>
        </div>

        {/* Key Specs Row (Beds, Baths, Sqm, Parking) */}
        <div className="mt-3.5 grid grid-cols-4 gap-2 border-t border-slate-100 py-2.5 text-center text-xs dark:border-slate-800">
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
              <Bed className="h-3.5 w-3.5 text-slate-400" />
              {property.bedrooms || '—'}
            </span>
            <span className="text-[10px] text-slate-400">Beds</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
              <Bath className="h-3.5 w-3.5 text-slate-400" />
              {property.bathrooms || '—'}
            </span>
            <span className="text-[10px] text-slate-400">Baths</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
              <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
              {property.sizeSqm || '—'}
            </span>
            <span className="text-[10px] text-slate-400">sqm</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
              <Building className="h-3.5 w-3.5 text-slate-400" />
              {property.parkingSpaces || 1}
            </span>
            <span className="text-[10px] text-slate-400">Parking</span>
          </div>
        </div>

        {/* Card Footer: Trust Meter & View Link */}
        <div className="mt-3 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <TrustScore score={property.trustScore} size="sm" />

          <Link
            href={`/properties/${property.id}`}
            className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-emerald-400"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}