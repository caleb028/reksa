export type UserRole =
  | 'USER'
  | 'BUYER'
  | 'INVESTOR'
  | 'AGENT'
  | 'LANDLORD'
  | 'DEVELOPER'
  | 'PROFESSIONAL'
  | 'MODERATOR'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export interface RolePermission {
  canCreateListings: boolean;
  canCreateDevelopments: boolean;
  canConductInspections: boolean;
  canAccessModerationQueue: boolean;
  canViewAdvancedAnalytics: boolean;
  canManageUsers: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermission> = {
  USER: {
    canCreateListings: false,
    canCreateDevelopments: false,
    canConductInspections: false,
    canAccessModerationQueue: false,
    canViewAdvancedAnalytics: false,
    canManageUsers: false
  },
  BUYER: {
    canCreateListings: false,
    canCreateDevelopments: false,
    canConductInspections: false,
    canAccessModerationQueue: false,
    canViewAdvancedAnalytics: false,
    canManageUsers: false
  },
  INVESTOR: {
    canCreateListings: false,
    canCreateDevelopments: false,
    canConductInspections: false,
    canAccessModerationQueue: false,
    canViewAdvancedAnalytics: true,
    canManageUsers: false
  },
  AGENT: {
    canCreateListings: true,
    canCreateDevelopments: false,
    canConductInspections: false,
    canAccessModerationQueue: false,
    canViewAdvancedAnalytics: true,
    canManageUsers: false
  },
  LANDLORD: {
    canCreateListings: true,
    canCreateDevelopments: false,
    canConductInspections: false,
    canAccessModerationQueue: false,
    canViewAdvancedAnalytics: false,
    canManageUsers: false
  },
  DEVELOPER: {
    canCreateListings: true,
    canCreateDevelopments: true,
    canConductInspections: false,
    canAccessModerationQueue: false,
    canViewAdvancedAnalytics: true,
    canManageUsers: false
  },
  PROFESSIONAL: {
    canCreateListings: false,
    canCreateDevelopments: false,
    canConductInspections: true,
    canAccessModerationQueue: false,
    canViewAdvancedAnalytics: true,
    canManageUsers: false
  },
  MODERATOR: {
    canCreateListings: false,
    canCreateDevelopments: false,
    canConductInspections: false,
    canAccessModerationQueue: true,
    canViewAdvancedAnalytics: true,
    canManageUsers: false
  },
  ADMIN: {
    canCreateListings: true,
    canCreateDevelopments: true,
    canConductInspections: true,
    canAccessModerationQueue: true,
    canViewAdvancedAnalytics: true,
    canManageUsers: true
  },
  SUPER_ADMIN: {
    canCreateListings: true,
    canCreateDevelopments: true,
    canConductInspections: true,
    canAccessModerationQueue: true,
    canViewAdvancedAnalytics: true,
    canManageUsers: true
  }
};