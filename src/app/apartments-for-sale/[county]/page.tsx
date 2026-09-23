import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ApartmentCard } from '@/components/marketplace/ApartmentCard';
import { KENYA_COUNTIES } from '@/lib/constants/kenya';
import { getFallbackApartmentsForSale } from '@/lib/fallbackData';
import { Building2, MapPin, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: {
    county: string;
  };
}

export default async function CountyApartmentsForSalePage({ params }: PageProps) {
  const decodedCounty = decodeURIComponent(params.county);

  let countyRecord: any = null;
  let apartments: any[] = [];

  try {
    countyRecord = await db.county.findFirst({
      where: { name: { equals: decodedCounty } }
    });

    if (countyRecord) {
      apartments = await db.property.findMany({
        where: {
          status: 'ACTIVE',
          listingIntent: 'SALE',
          propertyType: { in: ['Apartment', 'Penthouse', 'Studio'] },
          countyId: countyRecord.id
        },
        include: {
          county: true,
          neighbourhood: true,
          images: { take: 1, orderBy: { orderIndex: 'asc' } },
          passport: true
        },
        orderBy: { trustScore: 'desc' }
      });
    }
  } catch (error) {
    console.warn('[CountyApartmentsForSalePage] Database query notice, using fallback data:', error);
  }

  if (!countyRecord) {
    const matchedCounty = KENYA_COUNTIES.find(
      (c) => c.name.toLowerCase() === decodedCounty.toLowerCase()
    );
    if (!matchedCounty) {
      notFound();
    }
    countyRecord = {
      id: matchedCounty.code.toString(),
      name: matchedCounty.name,
      capital: matchedCounty.capital
    };
  }

  if (!apartments || apartments.length === 0) {
    apartments = getFallbackApartmentsForSale({
      county: countyRecord.name
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/apartments-for-sale" className="hover:text-slate-900 dark:hover:text-white">Apartments for Sale</Link>
        <span>/</span>
        <span className="font-bold text-slate-900 dark:text-white">{countyRecord.name} County</span>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>{countyRecord.name} County Regional Market</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Apartments for Sale in {countyRecord.name} County
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Explore verified apartment inventory, sectional title developments, and rental yield projections in {countyRecord.name}.
        </p>
      </div>

      {apartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((apt) => (
            <ApartmentCard
              key={apt.id}
              property={{
                id: apt.id,
                passportId: apt.passportId,
                title: apt.title,
                slug: apt.slug,
                propertyType: apt.propertyType,
                listingIntent: apt.listingIntent,
                price: apt.price,
                monthlyRent: apt.monthlyRent,
                serviceCharge: apt.serviceCharge,
                rentalYieldEstimate: apt.rentalYieldEstimate,
                bedrooms: apt.bedrooms,
                bathrooms: apt.bathrooms,
                sizeSqm: apt.sizeSqm,
                floorNumber: apt.floorNumber,
                totalFloors: apt.totalFloors,
                parkingSpaces: apt.parkingSpaces,
                balcony: apt.balcony,
                elevator: apt.elevator,
                borehole: apt.borehole,
                backupGenerator: apt.backupGenerator,
                swimmingPool: apt.swimmingPool,
                gym: apt.gym,
                completionStatus: apt.completionStatus,
                furnishingStatus: apt.furnishingStatus,
                town: apt.town,
                estate: apt.estate,
                countyName: apt.county?.name || countyRecord.name,
                trustScore: apt.trustScore,
                verificationLevel: apt.verificationLevel,
                imageUrl: apt.images?.[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
                isFeatured: apt.isFeatured
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
          <Building2 className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No apartments listed in {countyRecord.name} yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Check back soon or explore neighbouring counties for verified apartment inventory.
          </p>
          <div className="mt-4">
            <Link href="/apartments-for-sale" className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500">
              Browse All Apartments
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}