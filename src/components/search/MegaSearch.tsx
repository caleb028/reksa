'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import { KENYA_COUNTIES } from '@/lib/constants/kenya';

interface Suggestion {
  title: string;
  category: string;
  href: string;
  county?: string;
  intent?: string;
}

const POPULAR_SUGGESTIONS: Suggestion[] = [
  { title: 'Apartments in Kilimani', category: 'Popular Search', href: '/apartments-for-sale?county=Nairobi&q=Kilimani', county: 'Nairobi', intent: 'SALE' },
  { title: '2 bedroom apartments in Kileleshwa', category: 'Apartments', href: '/apartments-for-sale?county=Nairobi&bedrooms=2&q=Kileleshwa', county: 'Nairobi', intent: 'SALE' },
  { title: 'Apartments for rent in Westlands', category: 'Rentals', href: '/apartments-for-rent?county=Nairobi&q=Westlands', county: 'Nairobi', intent: 'RENT' },
  { title: 'Modern 2-Bedroom in Ruiru', category: 'Submarket Investment', href: '/apartments-for-sale?county=Kiambu&bedrooms=2', county: 'Kiambu', intent: 'SALE' },
  { title: 'Beachfront villas in Nyali', category: 'Coast Luxury', href: '/buy?county=Mombasa&type=Villa', county: 'Mombasa', intent: 'SALE' },
  { title: 'Serviced plots along Eastern Bypass', category: 'Land', href: '/land?county=Kiambu', county: 'Kiambu', intent: 'SALE' }
];

export function MegaSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<'SALE' | 'RENT' | 'DEVELOPMENTS'>('SALE');
  const [selectedCounty, setSelectedCounty] = useState('All Counties');
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedCounty !== 'All Counties') params.set('county', selectedCounty);

    let targetRoute = '/buy';
    if (selectedIntent === 'RENT') {
      targetRoute = '/apartments-for-rent';
    } else if (selectedIntent === 'DEVELOPMENTS') {
      targetRoute = '/developments';
    } else {
      targetRoute = '/apartments-for-sale';
    }

    setIsFocused(false);
    router.push(`${targetRoute}?${params.toString()}`);
  };

  const filteredSuggestions = POPULAR_SUGGESTIONS.filter((s) =>
    query.trim() === '' || s.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto z-40">
      {/* Clean Intent Switcher */}
      <div className="flex items-center gap-1.5 mb-3 bg-slate-900/40 p-1 rounded-2xl w-fit backdrop-blur-md border border-white/10">
        {[
          { label: 'Buy Property', val: 'SALE' },
          { label: 'Rent Property', val: 'RENT' },
          { label: 'Developments', val: 'DEVELOPMENTS' }
        ].map((tab) => {
          const isActive = selectedIntent === tab.val;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setSelectedIntent(tab.val as any)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Search Bar Box */}
      <form
        onSubmit={handleSearch}
        className={`flex flex-col sm:flex-row items-stretch gap-2 rounded-2xl border bg-white p-2.5 shadow-premium transition-all duration-300 dark:bg-slate-900 ${
          isFocused
            ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-2xl scale-[1.01]'
            : 'border-slate-200/90 hover:border-slate-300 dark:border-slate-800'
        }`}
      >
        {/* Search Keyword Input */}
        <div className="relative flex-1 flex items-center pl-3">
          <Search className={`h-5 w-5 transition-colors ${isFocused ? 'text-emerald-600' : 'text-slate-400'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search county, neighbourhood, estate, or project name..."
            className="w-full bg-transparent px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white dark:placeholder-slate-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2 transition-transform hover:scale-110 active:scale-90"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* County Selector */}
        <div className="flex items-center border-t sm:border-t-0 sm:border-l border-slate-200/80 px-3 py-1.5 dark:border-slate-800">
          <MapPin className="h-4 w-4 text-emerald-600 mr-2 flex-shrink-0" />
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none dark:text-slate-200 cursor-pointer py-2"
          >
            <option value="All Counties">All 47 Counties</option>
            {KENYA_COUNTIES.map((c) => (
              <option key={c.name} value={c.name} className="dark:bg-slate-900">
                {c.name} County
              </option>
            ))}
          </select>
        </div>

        {/* Search Submit CTA Button */}
        <button
          type="submit"
          disabled={isSearching}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-75"
        >
          {isSearching ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <span>Search</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Autocomplete & Suggestions Dropdown with Staggered Items */}
      {isFocused && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 animate-scale-in z-50">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Intelligent Suggestions</span>
            </span>
            <span>Kenya PropTech Directory</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredSuggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                style={{ animationDelay: `${idx * 40}ms` }}
                onMouseDown={() => {
                  router.push(s.href);
                  setIsFocused(false);
                }}
                className="flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all hover:translate-x-1 group animate-fade-up"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {s.title}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {s.category} • {s.county || 'Kenya'}
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}