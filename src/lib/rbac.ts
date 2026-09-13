import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from './auth';
import { UserRole, ROLE_PERMISSIONS, RolePermission } from '@/auth/roles';

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number = 401) {
    super(message);
    this.status = status;
    this.name = 'AuthError';
  }
}

export async function requireAuth(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    throw new AuthError('Authentication required. Please log in.', 401);
  }
  return user;
}

export async function requireRole(req: NextRequest, allowedRoles: UserRole[]) {
  const user = await requireAuth(req);
  const role = user.role as UserRole;
  if (!allowedRoles.includes(role)) {
    throw new AuthError(`Forbidden: Role '${user.role}' is not authorized to perform this operation.`, 403);
  }
  return user;
}

export async function requirePermission(req: NextRequest, permission: keyof RolePermission) {
  const user = await requireAuth(req);
  const role = user.role as UserRole;
  const perms = ROLE_PERMISSIONS[role];
  if (!perms || !perms[permission]) {
    throw new AuthError(`Forbidden: User does not hold the '${String(permission)}' permission.`, 403);
  }
  return user;
}

export async function requireOwnership(req: NextRequest, resourceOwnerId: string) {
  const user = await requireAuth(req);
  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
  if (user.id !== resourceOwnerId && !isAdmin) {
    throw new AuthError('Forbidden: You do not have permission to access or modify this resource.', 403);
  }
  return user;
}

export async function requireAdmin(req: NextRequest) {
  return requireRole(req, ['ADMIN', 'SUPER_ADMIN']);
}

export function handleAuthError(error: any) {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }
  console.error('Unhandled authorization error:', error);
  return NextResponse.json(
    { error: 'Internal server authorization error' },
    { status: 500 }
  );
}