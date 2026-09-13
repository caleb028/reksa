import Link from 'next/link';
import React from 'react';
import { db } from '@/lib/db';
import { KENYA_COUNTIES } from '@/lib/constants/kenya';
import { PropertyCard } from '@/components/marketplace/PropertyCard';
import { PropertyMap } from '@/components/map/PropertyMap';
import { ShieldCheck, Filter, ArrowUpDown, LayoutGrid, Map, SlidersHorizontal } from 'lucide-react';

interface BuyPageProps {
  searchParams: {
    county?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    minTrustScore?: string;
    sort?: string;
    view?: string;
  };
}

export default async function BuyPage({ searchParams }: BuyPageProps) {
  const {
    county,
    type,
    minPrice,
    maxPrice,
    bedrooms,
    minTrustScore,
    sort = 'recommended',
    view = 'grid'
  } = searchParams;

  const where: any = {
    status: 'ACTIVE',
    listingIntent: { in: ['SALE', 'INVEST'] }
  };

  if (county && county !== 'All Counties') {
    where.county = { name: { contains: county } };
  }
  if (type && type !== 'ALL') {
    where.propertyType = { contains: type };
  }
  if (minPrice) {
    where.price = { ...(where.price || {}), gte: parseFloat(minPrice) };
  }
  if (maxPrice) {
    where.price = { ...(where.price || {}), lte: parseFloat(maxPrice) };
  }
  if (bedrooms && bedrooms !== 'Any') {
    where.bedrooms = { gte: parseInt(bedrooms) };
  }
  if (minTrustScore) {
    where.trustScore = { gte: parseInt(minTrustScore) };
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'lowest_price') orderBy = { price: 'asc' };
  else if (sort === 'highest_price') orderBy = { price: 'desc' };
  else if (sort === 'highest_yield') orderBy = { rentalYieldEstimate: 'desc' };
  else if (sort === 'trust_score') orderBy = { trustScore: 'desc' };

  const properties = await db.property.findMany({
    where,
    orderBy,
    include: {
      county: true,
      neighbourhood: true,
      images: true,
      passport: true
    }
  });

  const mapProperties = properties.map((p) => ({
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
    latitude: p.latitude,
    longitude: p.longitude
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Verified Residential &amp; Investment
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {properties.length} Properties Found
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Properties for Sale in Kenya
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Every property features a permanent Property Passport, verified title audit trail, and algorithmic Trust Score.
          </p>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-2">
          <Link
            href={`/buy?${new URLSearchParams({ ...searchParams, view: 'grid' }).toString()}`}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              view !== 'map'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>List View</span>
          </Link>
          <Link
            href={`/buy?${new URLSearchParams({ ...searchParams, view: 'map' }).toString()}`}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              view === 'map'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Map View</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <form method="GET" action="/buy" className="my-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <input type="hidden" name="view" value={view} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* County */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              County
            </label>
            <select
              name="county"
              defaultValue={county || 'All Counties'}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="All Counties">All Counties</option>
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Type
            </label>
            <select
              name="type"
              defaultValue={type || 'ALL'}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="ALL">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Mansionette">Mansionette</option>
              <option value="Villa">Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Land">Land</option>
            </select>
          </div>

          {/* Max Price */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Max Price
            </label>
            <select
              name="maxPrice"
              defaultValue={maxPrice || ''}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Any Budget</option>
              <option value="10000000">Under KES 10M</option>
              <option value="15000000">Under KES 15M</option>
              <option value="25000000">Under KES 25M</option>
              <option value="50000000">Under KES 50M</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Bedrooms
            </label>
            <select
              name="bedrooms"
              defaultValue={bedrooms || 'Any'}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="Any">Any Beds</option>
              <option value="1">1+ Beds</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Sort By
            </label>
            <select
              name="sort"
              defaultValue={sort}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="recommended">Recommended</option>
              <option value="lowest_price">Lowest Price</option>
              <option value="highest_price">Highest Price</option>
              <option value="highest_yield">Highest Rental Yield</option>
              <option value="trust_score">Best Trust Score</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-700 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
            >
              Filter
            </button>
          </div>
        </div>
      </form>

      {/* Main Content Area: Map View or Grid View */}
      {view === 'map' ? (
        <div className="mb-12">
          <PropertyMap properties={mapProperties} selectedCounty={county || 'All Kenya'} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
                isFeatured: p.isFeatured
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}