export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { propertyQuerySchema } from '@/lib/validation/schemas';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { toPublicPropertyListDTO } from '@/lib/dto';

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 60 requests per minute per IP
    const rateCheck = checkRateLimit(`properties:${ip}`, 60, 60 * 1000);
    if (!rateCheck.isAllowed) {
      return rateLimitResponse(rateCheck.retryAfterSeconds);
    }

    const { searchParams } = new URL(req.url);
    const rawParams = {
      county: searchParams.get('county') || undefined,
      ids: searchParams.get('ids') || undefined,
      intent: searchParams.get('intent') || undefined,
      type: searchParams.get('type') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      bedrooms: searchParams.get('bedrooms') || undefined,
      minSize: searchParams.get('minSize') || undefined,
      maxSize: searchParams.get('maxSize') || undefined,
      minTrustScore: searchParams.get('minTrustScore') || undefined,
      minVerification: searchParams.get('minVerification') || undefined,
      elevator: searchParams.get('elevator') || undefined,
      borehole: searchParams.get('borehole') || undefined,
      generator: searchParams.get('generator') || undefined,
      pool: searchParams.get('pool') || undefined,
      gym: searchParams.get('gym') || undefined,
      balcony: searchParams.get('balcony') || undefined,
      completionStatus: searchParams.get('completionStatus') || undefined,
      furnishingStatus: searchParams.get('furnishingStatus') || undefined,
      q: searchParams.get('q') || undefined,
      sort: searchParams.get('sort') || 'recommended',
      limit: searchParams.get('limit') || '20',
      page: searchParams.get('page') || '1'
    };

    const parsed = propertyQuerySchema.safeParse(rawParams);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      county,
      ids,
      intent,
      type,
      category,
      minPrice,
      maxPrice,
      bedrooms,
      minSize,
      maxSize,
      minTrustScore,
      minVerification,
      elevator,
      borehole,
      generator,
      pool,
      gym,
      balcony,
      completionStatus,
      furnishingStatus,
      q,
      sort,
      limit,
      page
    } = parsed.data;

    const where: any = { status: 'ACTIVE' };

    if (ids) {
      const idList = ids.split(',').map((id) => id.trim()).filter(Boolean);
      if (idList.length > 0) {
        where.id = { in: idList };
      }
    }

    if (county && county !== 'All Counties') {
      where.county = { name: { contains: county } };
    }
    if (intent && intent !== 'ALL') {
      where.listingIntent = intent;
    }
    if (category) {
      if (category === 'APARTMENT') {
        where.propertyType = { in: ['Apartment', 'Penthouse', 'Studio', 'Bedsitter'] };
      } else if (category === 'HOUSE') {
        where.propertyType = { in: ['Maisonette', 'Townhouse', 'House', 'Villa'] };
      } else if (category === 'LAND') {
        where.propertyType = 'Land';
      } else if (category === 'COMMERCIAL') {
        where.propertyType = 'Commercial';
      } else if (category === 'PENTHOUSE') {
        where.propertyType = 'Penthouse';
      }
    } else if (type && type !== 'ALL') {
      where.propertyType = { contains: type };
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { estate: { contains: q } },
        { town: { contains: q } }
      ];
    }

    if (minPrice !== undefined) {
      where.price = { ...(where.price || {}), gte: minPrice };
    }
    if (maxPrice !== undefined) {
      where.price = { ...(where.price || {}), lte: maxPrice };
    }
    if (bedrooms !== undefined) {
      where.bedrooms = { gte: bedrooms };
    }
    if (minSize !== undefined) {
      where.sizeSqm = { ...(where.sizeSqm || {}), gte: minSize };
    }
    if (maxSize !== undefined) {
      where.sizeSqm = { ...(where.sizeSqm || {}), lte: maxSize };
    }
    if (minTrustScore !== undefined) {
      where.trustScore = { gte: minTrustScore };
    }
    if (minVerification !== undefined) {
      where.verificationLevel = { gte: minVerification };
    }

    // Apartment amenity filters
    if (elevator) where.elevator = true;
    if (borehole) where.borehole = true;
    if (generator) where.backupGenerator = true;
    if (pool) where.swimmingPool = true;
    if (gym) where.gym = true;
    if (balcony) where.balcony = true;
    if (completionStatus) where.completionStatus = completionStatus;
    if (furnishingStatus) where.furnishingStatus = furnishingStatus;

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'lowest_price') orderBy = { price: 'asc' };
    else if (sort === 'highest_price') orderBy = { price: 'desc' };
    else if (sort === 'highest_yield') orderBy = { rentalYieldEstimate: 'desc' };
    else if (sort === 'trust_score') orderBy = { trustScore: 'desc' };

    const skip = (page - 1) * limit;

    const [total, properties] = await Promise.all([
      db.property.count({ where }),
      db.property.findMany({
        where,
        orderBy,
        take: limit,
        skip,
        include: {
          images: {
            take: 4,
            orderBy: { orderIndex: 'asc' }
          },
          county: {
            select: {
              id: true,
              name: true,
              code: true,
              capital: true
            }
          },
          neighbourhood: {
            select: {
              id: true,
              name: true,
              medianAskingPrice: true,
              rentalYieldAvg: true
            }
          },
          passport: {
            select: {
              passportNumber: true,
              riskLevel: true,
              structuralStatus: true,
              lastVerified: true
            }
          }
        }
      })
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      properties: toPublicPropertyListDTO(properties)
    });
  } catch (error: any) {
    console.error('Properties API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching properties' },
      { status: 500 }
    );
  }
}