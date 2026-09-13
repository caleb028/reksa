import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getOrganizationContext, hasOrgPermission } from '@/lib/tenancy';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if caller has private tenant access
    const context = await getOrganizationContext(req, id);

    if (context) {
      // Return full authenticated business tenant data
      const organization = await db.organization.findUnique({
        where: { id: context.organization.id },
        include: {
          members: {
            where: { isActive: true },
            include: {
              user: {
                select: { id: true, name: true, email: true, avatar: true }
              },
              _count: {
                select: { assignedListings: true, assignedLeads: true }
              }
            }
          },
          properties: {
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
              images: { take: 1 },
              assignedAgentMember: {
                include: { user: { select: { name: true } } }
              }
            }
          },
          leads: {
            take: 100,
            orderBy: { createdAt: 'desc' },
            include: {
              property: { select: { id: true, title: true, price: true } },
              assignedAgent: { include: { user: { select: { name: true } } } }
            }
          },
          viewingRequests: {
            take: 50,
            orderBy: { preferredDate: 'asc' },
            include: {
              property: { select: { id: true, title: true } }
            }
          },
          _count: {
            select: { members: true, properties: true, leads: true, developments: true }
          }
        }
      });

      return NextResponse.json({
        isAuthorizedTenant: true,
        callerRole: context.member.role,
        organization
      });
    }

    // Otherwise, return public profile information
    const publicOrg = await db.organization.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      },
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
        address: true,
        verificationStatus: true,
        verificationBadge: true,
        trustScore: true,
        subscriptionTier: true,
        members: {
          where: { isActive: true },
          select: {
            id: true,
            role: true,
            title: true,
            phone: true,
            user: { select: { id: true, name: true, avatar: true } }
          }
        },
        properties: {
          where: { status: 'ACTIVE' },
          include: {
            images: { take: 1 },
            county: { select: { name: true } }
          }
        },
        developments: {
          include: {
            county: { select: { name: true } }
          }
        }
      }
    });

    if (!publicOrg) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json({
      isAuthorizedTenant: false,
      organization: publicOrg
    });
  } catch (error: any) {
    console.error('Error fetching organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const context = await getOrganizationContext(req, id);

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized. You do not have access to this organization.' }, { status: 403 });
    }

    if (!hasOrgPermission(context.member.role, 'organization.manage') && !context.isPlatformAdmin) {
      return NextResponse.json({ error: 'Forbidden. Insufficient permissions to modify company settings.' }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Malformed request payload' }, { status: 400 });
    }

    const {
      name,
      description,
      phone,
      email,
      website,
      county,
      town,
      address,
      logo,
      coverImage,
      subscriptionTier
    } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (website !== undefined) updateData.website = website;
    if (county) updateData.county = county;
    if (town) updateData.town = town;
    if (address !== undefined) updateData.address = address;
    if (logo) updateData.logo = logo;
    if (coverImage) updateData.coverImage = coverImage;
    if (subscriptionTier && (context.isPlatformAdmin || context.member.role === 'OWNER')) {
      updateData.subscriptionTier = subscriptionTier;
    }

    const updated = await db.organization.update({
      where: { id: context.organization.id },
      data: updateData
    });

    return NextResponse.json({
      message: 'Organization updated successfully',
      organization: updated
    });
  } catch (error: any) {
    console.error('Error updating organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
