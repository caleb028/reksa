import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { KENYA_COUNTIES } from '@/lib/constants/kenya';
import { PropertyCard } from '@/components/marketplace/PropertyCard';
import { Compass, ShieldCheck, MapPin, CheckCircle, FileCheck, Layers } from 'lucide-react';

export default async function LandPage() {
  const landListings = await db.property.findMany({
    where: {
      propertyType: 'Land',
      status: 'ACTIVE'
    },
    include: {
      county: true,
      neighbourhood: true,
      images: true,
      passport: true
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-8 text-white mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-300">
            Kenya Land Intelligence Hub
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Verified Land, Acreage &amp; Plot Marketplace
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
          Ground-truthed perimeter beacons, Registry Index Map (RIM) cross-checks, soil classification, and municipal zoning intelligence across all 47 counties.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs">
          <span className="rounded-lg bg-emerald-900/60 px-3 py-1.5 font-semibold text-emerald-200 border border-emerald-500/30">
            ✓ Ready Freehold &amp; Leasehold Titles
          </span>
          <span className="rounded-lg bg-emerald-900/60 px-3 py-1.5 font-semibold text-emerald-200 border border-emerald-500/30">
            ✓ Beacons Ground-Truthed
          </span>
          <span className="rounded-lg bg-emerald-900/60 px-3 py-1.5 font-semibold text-emerald-200 border border-emerald-500/30">
            ✓ Water &amp; Power Access Audited
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {landListings.map((p) => (
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
              landAcreage: p.landAcreage,
              sizeSqm: p.sizeSqm,
              town: p.town,
              estate: p.estate,
              countyName: p.county.name,
              trustScore: p.trustScore,
              verificationLevel: p.verificationLevel,
              imageUrl: p.images[0]?.url
            }}
          />
        ))}
      </div>
    </div>
  );
}