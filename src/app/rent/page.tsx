import React from 'react';
import { db } from '@/lib/db';
import { KENYA_COUNTIES } from '@/lib/constants/kenya';
import { PropertyCard } from '@/components/marketplace/PropertyCard';
import { TrendingUp, KeyRound, ShieldCheck } from 'lucide-react';

interface RentPageProps {
  searchParams: {
    county?: string;
    type?: string;
    maxRent?: string;
    bedrooms?: string;
  };
}

export default async function RentPage({ searchParams }: RentPageProps) {
  const { county, type, maxRent, bedrooms } = searchParams;

  const where: any = {
    status: 'ACTIVE',
    listingIntent: 'RENT'
  };

  if (county && county !== 'All Counties') {
    where.county = { name: { contains: county } };
  }
  if (type && type !== 'ALL') {
    where.propertyType = { contains: type };
  }
  if (maxRent) {
    where.price = { lte: parseFloat(maxRent) };
  }
  if (bedrooms && bedrooms !== 'Any') {
    where.bedrooms = { gte: parseInt(bedrooms) };
  }

  const properties = await db.property.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      county: true,
      neighbourhood: true,
      images: true,
      passport: true
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Tenant Protection &amp; Verified Leases
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Properties for Rent in Kenya
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Find fully verified rental homes, apartments, and commercial units with audited service charges and verified landlord ownership.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
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