import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode'); // 'my' or 'directory'

    if (mode === 'my') {
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // If platform admin, return all organizations
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        const allOrgs = await db.organization.findMany({
          include: {
            _count: {
              select: { members: true, properties: true, leads: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
          organizations: allOrgs.map((org) => ({
            ...org,
            userRole: 'OWNER'
          }))
        });
      }

      // Return organizations user is a member of
      const memberships = await db.organizationMember.findMany({
        where: { userId: user.id, isActive: true },
        include: {
          organization: {
            include: {
              _count: {
                select: { members: true, properties: true, leads: true }
              }
            }
          }
        }
      });

      return NextResponse.json({
        organizations: memberships.map((m) => ({
          ...m.organization,
          userRole: m.role,
          memberTitle: m.title
        }))
      });
    }

    // Default: Public directory of verified real estate companies & developers
    const businessType = searchParams.get('type');
    const county = searchParams.get('county');

    const whereClause: any = {
      verificationStatus: { in: ['VERIFIED', 'UNDER_REVIEW'] }
    };

    if (businessType) {
      whereClause.businessType = businessType;
    }

    if (county) {
      whereClause.county = county;
    }

    const organizations = await db.organization.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        slug: true,
        businessType: true,
        description: true,
        logo: true,
        coverImage: true,
        phone: true,
        email: true,
        website: true,
        county: true,
        town: true,
        verificationStatus: true,
        verificationBadge: true,
        trustScore: true,
        subscriptionTier: true,
        _count: {
          select: { properties: true, members: true, developments: true }
        }
      },
      orderBy: [{ trustScore: 'desc' }, { createdAt: 'desc' }]
    });

    return NextResponse.json({ organizations });
  } catch (error: any) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to create a business profile' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.name || !body.businessType) {
      return NextResponse.json({ error: 'Business name and type are required' }, { status: 400 });
    }

    const {
      name,
      businessType,
      description,
      county,
      town,
      address,
      phone,
      email,
      website,
      logo,
      coverImage,
      registrationNumber,
      taxPin
    } = body;

    // Generate clean slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    let slug = baseSlug;
    let counter = 1;
    while (await db.organization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Default badge based on business type
    let verificationBadge = 'IDENTITY VERIFIED';
    if (businessType === 'REAL_ESTATE_COMPANY') {
      verificationBadge = 'REKSA VERIFIED COMPANY';
    } else if (businessType === 'DEVELOPER') {
      verificationBadge = 'REKSA VERIFIED DEVELOPER';
    }

    const organization = await db.organization.create({
      data: {
        name,
        slug,
        businessType,
        description,
        county: county || 'Nairobi',
        town: town || 'Nairobi',
        address,
        phone: phone || user.phone,
        email: email || user.email,
        website,
        logo: logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
        coverImage,
        registrationNumber,
        taxPin,
        verificationStatus: 'UNDER_REVIEW',
        verificationBadge,
        trustScore: 80,
        subscriptionTier: 'FREE',
        subscriptionStatus: 'ACTIVE',
        members: {
          create: {
            userId: user.id,
            role: 'OWNER',
            title: businessType === 'DEVELOPER' ? 'Principal Developer' : 'Managing Director / Owner',
            phone: user.phone || phone
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Business workspace successfully created',
      organization
    });
  } catch (error: any) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  }
}
