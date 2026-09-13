import React from 'react';
import { db } from '@/lib/db';
import { PropertyMap } from '@/components/map/PropertyMap';
import { COMMUTE_HUBS, calculateHaversineDistance, estimateTravelTimeMinutes } from '@/lib/geo';
import { Compass, Navigation, Clock, Search, MapPin } from 'lucide-react';

interface MapPageProps {
  searchParams: {
    hub?: string;
    maxMinutes?: string;
  };
}

export default async function MapPage({ searchParams }: MapPageProps) {
  const { hub = 'Nairobi CBD (Kenyatta Ave / City Hall)', maxMinutes = '45' } = searchParams;

  const allProperties = await db.property.findMany({
    where: { status: 'ACTIVE' },
    include: {
      county: true,
      neighbourhood: true,
      images: true,
      passport: true
    }
  });

  const selectedHub = COMMUTE_HUBS.find((h) => h.name === hub) || COMMUTE_HUBS[0];
  const maxMinsNum = parseInt(maxMinutes) || 45;

  // Filter properties along commute route
  const mapProperties = allProperties
    .map((p) => {
      const distance = calculateHaversineDistance(
        { lat: p.latitude, lng: p.longitude },
        { lat: selectedHub.lat, lng: selectedHub.lng }
      );
      const estMinutes = estimateTravelTimeMinutes(distance, 'Normal');
      return {
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
        longitude: p.longitude,
        distanceKm: distance,
        estMinutes
      };
    })
    .filter((p) => p.estMinutes <= maxMinsNum);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Navigation className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Kenya Spatial Intelligence &amp; GIS
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Interactive Property Intelligence Map
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Analyze spatial price clusters, rental yields, school catchment corridors, hydrology flood-risk zones, and commute times.
        </p>
      </div>

      {/* "FIND PROPERTY ALONG MY ROUTE" Commute Filter Bar */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Find Property Along My Commute Route
          </h2>
        </div>

        <form method="GET" action="/map" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Work / University Destination Hub
            </label>
            <select
              name="hub"
              defaultValue={hub}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {COMMUTE_HUBS.map((h) => (
                <option key={h.name} value={h.name}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Maximum Commute Duration
            </label>
            <select
              name="maxMinutes"
              defaultValue={maxMinutes}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="20">Within 20 Minutes</option>
              <option value="35">Within 35 Minutes</option>
              <option value="45">Within 45 Minutes</option>
              <option value="60">Within 60 Minutes</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Filter Properties along Route</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Map Component */}
      <PropertyMap properties={mapProperties} />
    </div>
  );
}