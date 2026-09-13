'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Heart,
  Scale,
  Building2,
  TrendingUp,
  ShieldCheck,
  Coins,
  ArrowRight,
  Trash2,
  Search,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/components/layout/AppProviders';
import { PropertyCard, PropertyCardItem } from '@/components/marketplace/PropertyCard';

export default function SavedPropertiesPage() {
  const { savedPropertyIds, toggleSaveProperty, notify } = useApp();
  const [properties, setProperties] = useState<PropertyCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'yield' | 'trust'>('trust');

  useEffect(() => {
    async function loadSavedProperties() {
      if (savedPropertyIds.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const idsParam = savedPropertyIds.join(',');
        const res = await fetch(`/api/properties?ids=${encodeURIComponent(idsParam)}&limit=50`);
        const data = await res.json();
        if (data.properties) {
          // Format DTO for PropertyCard
          const formatted: PropertyCardItem[] = data.properties.map((p: any) => ({
            id: p.id,
            passportId: p.passportId || `PASSPORT-${p.id.slice(0, 6)}`,
            title: p.title,
            slug: p.slug || p.id,
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
            countyName: p.countyName || p.county?.name || 'Nairobi',
            trustScore: p.trustScore || 85,
            verificationLevel: p.verificationLevel || 3,
            imageUrl: p.imageUrl || p.images?.[0]?.url,
            isFeatured: p.isFeatured,
            sellerType: p.sellerType,
            organizationName: p.organizationName,
            agentName: p.agentName
          }));
          setProperties(formatted);
        }
      } catch (err) {
        console.error('Failed to load saved properties:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSavedProperties();
  }, [savedPropertyIds]);

  // Derived portfolio statistics
  const stats = useMemo(() => {
    if (properties.length === 0) return { totalValue: 0, avgYield: 0, avgTrust: 0 };
    const totalValue = properties.reduce((acc, p) => acc + (p.price || 0), 0);
    const validYields = properties.filter((p) => (p.rentalYieldEstimate || 0) > 0);
    const avgYield =
      validYields.length > 0
        ? validYields.reduce((acc, p) => acc + (p.rentalYieldEstimate || 0), 0) / validYields.length
        : 0;
    const avgTrust = Math.round(
      properties.reduce((acc, p) => acc + (p.trustScore || 0), 0) / properties.length
    );
    return { totalValue, avgYield: avgYield.toFixed(1), avgTrust };
  }, [properties]);

  // Sorting
  const sortedProperties = useMemo(() => {
    return [...properties].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'yield') return (b.rentalYieldEstimate || 0) - (a.rentalYieldEstimate || 0);
      return b.trustScore - a.trustScore;
    });
  }, [properties, sortBy]);

  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all properties from your watchlist?')) {
      savedPropertyIds.forEach((id) => toggleSaveProperty(id));
      notify('Watchlist Cleared', 'All properties removed from your saved list.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      {/* Top Banner */}
      <div className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                  <Heart className="h-4 w-4 fill-rose-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Private Watchlist &amp; Portfolio Tracker
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Saved Properties &amp; Pipeline
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Track real-time valuations, projected rental yields, and verified compliance passports for properties you are actively monitoring.
              </p>
            </div>

            {properties.length > 0 && (
              <div className="flex items-center gap-2">
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Open Comparison Matrix</span>
                </Link>
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            )}
          </div>

          {/* Portfolio Metric Indicators */}
          {properties.length > 0 && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-850">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Watchlist Count</span>
                <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block">
                  {properties.length} {properties.length === 1 ? 'Unit' : 'Units'}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-850">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Pipeline Value</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block truncate">
                  KES {stats.totalValue.toLocaleString()}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-850">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg. Projected Yield</span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5 block">
                  {stats.avgYield}% p.a.
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-850">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg. REKSA Trust Score</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {stats.avgTrust}/100
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mb-3" />
            <span className="text-xs font-bold text-slate-500">Loading your portfolio watchlist...</span>
          </div>
        ) : properties.length === 0 ? (
          /* Empty State */
          <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900 shadow-card">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/50">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Your Watchlist is Currently Empty
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              When browsing properties across Nairobi, Mombasa, and Kiambu, click the heart icon on any listing to save it here for investment comparison, viewing scheduling, and price alerts.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              <Link
                href="/apartments-for-sale"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Apartments for Sale</span>
              </Link>
              <Link
                href="/apartments-for-rent"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition-colors"
              >
                <span>Rental Units</span>
              </Link>
              <Link
                href="/land"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition-colors"
              >
                <span>Land &amp; Plots</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Populated Watchlist Grid */
          <div>
            {/* Filter / Sort Controls */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Showing {sortedProperties.length} saved {sortedProperties.length === 1 ? 'property' : 'properties'}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  <option value="trust">Highest Trust Score</option>
                  <option value="yield">Highest Rental Yield</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
