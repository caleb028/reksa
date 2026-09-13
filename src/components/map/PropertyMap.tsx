'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Layers, School, Building, Hospital, Bus, AlertTriangle, ShieldCheck, Eye } from 'lucide-react';
import { PropertyCardItem } from '@/components/marketplace/PropertyCard';

interface PropertyMapProps {
  properties: (PropertyCardItem & { latitude: number; longitude: number })[];
  selectedCounty?: string;
}

export function PropertyMap({ properties, selectedCounty = 'All Kenya' }: PropertyMapProps) {
  const [activeProperty, setActiveProperty] = useState<PropertyCardItem | null>(properties[0] || null);
  const [activeLayer, setActiveLayer] = useState<'prices' | 'yields' | 'infrastructure' | 'floodRisk'>('prices');
  const [filterType, setFilterType] = useState<'ALL' | 'SALE' | 'RENT' | 'LAND'>('ALL');

  const filteredProperties = properties.filter((p) => {
    if (filterType === 'ALL') return true;
    return p.listingIntent === filterType;
  });

  return (
    <div className="relative flex flex-col lg:flex-row h-[700px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950 shadow-soft">
      {/* Map Canvas / Simulated GIS Layer */}
      <div className="relative flex-1 bg-[#e8ecef] dark:bg-[#131b2e] overflow-hidden">
        {/* OpenStreetMap background pattern / tile grid */}
        <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-[radial-gradient(#064e3b_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Map Header & Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
          {/* Layer Selector */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white/90 p-1 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
            <button
              onClick={() => setActiveLayer('prices')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                activeLayer === 'prices'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Prices</span>
            </button>
            <button
              onClick={() => setActiveLayer('yields')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                activeLayer === 'yields'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <span>Rental Yields</span>
            </button>
            <button
              onClick={() => setActiveLayer('infrastructure')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                activeLayer === 'infrastructure'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Schools & Transit</span>
            </button>
            <button
              onClick={() => setActiveLayer('floodRisk')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                activeLayer === 'floodRisk'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Flood Risk</span>
            </button>
          </div>

          {/* Type Filter */}
          <div className="hidden sm:flex items-center rounded-xl border border-slate-200 bg-white/90 p-1 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
            {(['ALL', 'SALE', 'RENT', 'LAND'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  filterType === t
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Geo Information Badge */}
        <div className="absolute bottom-4 left-4 z-20 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs font-medium shadow-md backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Geo Extent: <strong>Kenya Spatial Index</strong> (47 Counties)</span>
          </div>
          {activeLayer === 'floodRisk' && (
            <div className="mt-1 text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Hydrology overlay: Nairobi River & Lake Basin drainage zones</span>
            </div>
          )}
        </div>

        {/* Interactive Property Markers Visualizer */}
        <div className="relative h-full w-full p-12 flex items-center justify-center">
          {/* Spatial Grid simulation */}
          <div className="relative w-full max-w-2xl h-[480px] rounded-3xl border border-slate-300 dark:border-slate-800 bg-slate-200/50 dark:bg-slate-900/40 p-6 flex flex-wrap items-center justify-around gap-6">
            {filteredProperties.map((prop, idx) => {
              const isSelected = activeProperty?.id === prop.id;
              let bubbleText = `KES ${(prop.price / 1000000).toFixed(1)}M`;
              if (prop.listingIntent === 'RENT') bubbleText = `KES ${(prop.price / 1000).toFixed(0)}k/m`;
              if (activeLayer === 'yields' && prop.rentalYieldEstimate) {
                bubbleText = `${prop.rentalYieldEstimate}% Yield`;
              }

              return (
                <button
                  key={prop.id}
                  onClick={() => setActiveProperty(prop)}
                  className={`group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold shadow-md transition-all duration-300 hover:scale-110 ${
                    isSelected
                      ? 'bg-emerald-700 text-white ring-4 ring-emerald-500/30 scale-110 z-30'
                      : 'bg-white text-slate-900 hover:bg-emerald-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 z-10'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                  <span>{bubbleText}</span>
                  {prop.verificationLevel >= 3 && (
                    <ShieldCheck className="w-3 h-3 text-gold-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Property Sidebar / Mini Card */}
      {activeProperty && (
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-mono uppercase">ID: {activeProperty.passportId}</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Tier {activeProperty.verificationLevel} Verified
              </span>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 mb-4">
              <img
                src={activeProperty.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                alt={activeProperty.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-xs font-bold text-white">
                KES {activeProperty.price.toLocaleString()}
              </div>
            </div>

            <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
              {activeProperty.title}
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {activeProperty.estate ? `${activeProperty.estate}, ` : ''}{activeProperty.town}, {activeProperty.countyName}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">REKSA Trust Score</span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{activeProperty.trustScore} / 100</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Estimated Yield</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {activeProperty.rentalYieldEstimate ? `${activeProperty.rentalYieldEstimate}% p.a.` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href={`/properties/${activeProperty.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-800"
            >
              <Eye className="w-4 h-4" />
              <span>Explore Full Property Passport</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}