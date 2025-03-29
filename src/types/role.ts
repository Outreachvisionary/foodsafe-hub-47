
export type RoleLevel = 'organization' | 'facility' | 'department';

export interface Role {
  id: string;
  name: string;
  description?: string;
  level: RoleLevel;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  role_name?: string;
  role_level?: RoleLevel;
  permissions?: Record<string, boolean>;
  organization_id?: string;
  organization_name?: string;
  facility_id?: string;
  facility_name?: string;
  department_id?: string;
  department_name?: string;
  assigned_by?: string;
  assigned_at?: string;
}

export interface Permission {
  key: string;
  name: string;
  description: string;
  category: string;
}

export const PERMISSIONS: Record<string, Permission> = {
  'admin': {
    key: 'admin',
    name: 'Administrator Access',
    description: 'Full system access at the assigned level',
    category: 'System'
  },
  'users:manage': {
    key: 'users:manage',
    name: 'Manage Users',
    description: 'Invite, update, and manage user accounts',
    category: 'Administration'
  },
  'roles:manage': {
    key: 'roles:manage',
    name: 'Manage Roles',
    description: 'Create, edit and assign roles',
    category: 'Administration'
  },
  'organizations:manage': {
    key: 'organizations:manage',
    name: 'Manage Organizations',
    description: 'Create and edit organizations',
    category: 'Administration'
  },
  'facilities:manage': {
    key: 'facilities:manage',
    name: 'Manage Facilities',
    description: 'Create and edit facilities',
    category: 'Administration'
  },
  'departments:manage': {
    key: 'departments:manage',
    name: 'Manage Departments',
    description: 'Create and edit departments',
    category: 'Administration'
  },
  'documents:manage': {
    key: 'documents:manage',
    name: 'Manage Documents',
    description: 'Full access to document management',
    category: 'Quality'
  },
  'documents:create': {
    key: 'documents:create',
    name: 'Create Documents',
    description: 'Create new documents',
    category: 'Quality'
  },
  'documents:read': {
    key: 'documents:read',
    name: 'View Documents',
    description: 'Read-only access to documents',
    category: 'Quality'
  },
  'audits:manage': {
    key: 'audits:manage',
    name: 'Manage Audits',
    description: 'Full access to audit management',
    category: 'Quality'
  },
  'audits:create': {
    key: 'audits:create',
    name: 'Create Audits',
    description: 'Create new audits',
    category: 'Quality'
  },
  'audits:read': {
    key: 'audits:read',
    name: 'View Audits',
    description: 'Read-only access to audits',
    category: 'Quality'
  },
  'capa:manage': {
    key: 'capa:manage',
    name: 'Manage CAPA',
    description: 'Full access to CAPA management',
    category: 'Quality'
  },
  'capa:create': {
    key: 'capa:create',
    name: 'Create CAPA',
    description: 'Create new CAPA actions',
    category: 'Quality'
  },
  'capa:read': {
    key: 'capa:read',
    name: 'View CAPA',
    description: 'Read-only access to CAPA',
    category: 'Quality'
  },
  'nc:manage': {
    key: 'nc:manage',
    name: 'Manage Non-Conformances',
    description: 'Full access to non-conformance management',
    category: 'Quality'
  },
  'nc:create': {
    key: 'nc:create',
    name: 'Create Non-Conformances',
    description: 'Create new non-conformances',
    category: 'Quality'
  },
  'nc:read': {
    key: 'nc:read',
    name: 'View Non-Conformances',
    description: 'Read-only access to non-conformances',
    category: 'Quality'
  },
  'training:manage': {
    key: 'training:manage',
    name: 'Manage Training',
    description: 'Full access to training management',
    category: 'Quality'
  },
  'training:create': {
    key: 'training:create',
    name: 'Create Training',
    description: 'Create new training sessions',
    category: 'Quality'
  },
  'training:read': {
    key: 'training:read',
    name: 'View Training',
    description: 'Read-only access to training data',
    category: 'Quality'
  }
};

export const PERMISSION_CATEGORIES = [
  'System',
  'Administration',
  'Quality'
];
