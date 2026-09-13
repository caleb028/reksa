import { NextRequest } from 'next/server';
import { db } from './db';
import { getAuthenticatedUser } from './auth';

export type OrganizationRole =
  | 'OWNER'
  | 'ADMIN'
  | 'BRANCH_MANAGER'
  | 'AGENT'
  | 'LISTING_MANAGER'
  | 'VIEWER';

export type OrgPermission =
  | 'organization.view'
  | 'organization.manage'
  | 'members.view'
  | 'members.manage'
  | 'listings.view'
  | 'listings.create'
  | 'listings.edit'
  | 'listings.delete'
  | 'leads.view'
  | 'leads.manage'
  | 'analytics.view'
  | 'billing.view'
  | 'billing.manage'
  | 'verification.request';

const ROLE_PERMISSIONS: Record<OrganizationRole, OrgPermission[]> = {
  OWNER: [
    'organization.view',
    'organization.manage',
    'members.view',
    'members.manage',
    'listings.view',
    'listings.create',
    'listings.edit',
    'listings.delete',
    'leads.view',
    'leads.manage',
    'analytics.view',
    'billing.view',
    'billing.manage',
    'verification.request'
  ],
  ADMIN: [
    'organization.view',
    'organization.manage',
    'members.view',
    'members.manage',
    'listings.view',
    'listings.create',
    'listings.edit',
    'listings.delete',
    'leads.view',
    'leads.manage',
    'analytics.view',
    'billing.view',
    'verification.request'
  ],
  BRANCH_MANAGER: [
    'organization.view',
    'members.view',
    'listings.view',
    'listings.create',
    'listings.edit',
    'leads.view',
    'leads.manage',
    'analytics.view',
    'verification.request'
  ],
  LISTING_MANAGER: [
    'organization.view',
    'listings.view',
    'listings.create',
    'listings.edit',
    'listings.delete',
    'verification.request'
  ],
  AGENT: [
    'organization.view',
    'listings.view',
    'listings.create',
    'listings.edit',
    'leads.view',
    'leads.manage'
  ],
  VIEWER: [
    'organization.view',
    'listings.view',
    'analytics.view'
  ]
};

export function hasOrgPermission(role: string, permission: OrgPermission): boolean {
  const allowed = ROLE_PERMISSIONS[role as OrganizationRole];
  if (!allowed) return false;
  return allowed.includes(permission);
}

export interface OrganizationContext {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
    businessType: string;
    verificationStatus: string;
    subscriptionTier: string;
  };
  member: {
    id: string;
    role: OrganizationRole;
    title?: string | null;
  };
  isPlatformAdmin: boolean;
}

/**
 * Resolves organization context safely server-side, enforcing tenant isolation.
 * Never trust organizationId supplied by client without membership check!
 */
export async function getOrganizationContext(
  req: NextRequest,
  organizationIdOrSlug: string
): Promise<OrganizationContext | null> {
  const user = await getAuthenticatedUser(req);
  if (!user) return null;

  const isPlatformAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

  // Find organization
  const organization = await db.organization.findFirst({
    where: {
      OR: [
        { id: organizationIdOrSlug },
        { slug: organizationIdOrSlug }
      ]
    }
  });

  if (!organization) return null;

  // If platform admin, grant access with OWNER level privileges
  if (isPlatformAdmin) {
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        businessType: organization.businessType,
        verificationStatus: organization.verificationStatus,
        subscriptionTier: organization.subscriptionTier
      },
      member: {
        id: `admin_${user.id}`,
        role: 'OWNER',
        title: 'Platform Administrator'
      },
      isPlatformAdmin: true
    };
  }

  // Check explicit organization membership
  const member = await db.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: user.id
      }
    }
  });

  if (!member || !member.isActive) {
    return null; // Access denied: Not a member of this tenant
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    organization: {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      businessType: organization.businessType,
      verificationStatus: organization.verificationStatus,
      subscriptionTier: organization.subscriptionTier
    },
    member: {
      id: member.id,
      role: member.role as OrganizationRole,
      title: member.title
    },
    isPlatformAdmin: false
  };
}
