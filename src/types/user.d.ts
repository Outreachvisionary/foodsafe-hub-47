
// Import these if needed
// import { Facility } from './facility';
// import { Organization } from './organization';

export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  department_id?: string;
  organization_id?: string;
  assigned_facility_ids?: string[];
  preferred_language?: string;
  status?: string;
  metadata?: Record<string, any>;
  email?: string; // Add this missing property
  preferences?: Record<string, any>; // Add this missing property
}

export interface AppUser extends UserProfile {
  email: string; // Required in AppUser
  roles?: Array<string>;
  permissions?: Array<string>;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  preferences?: Record<string, any>; // Add this missing property
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  organizationId?: string;
}

export interface PaginatedUsers {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserWithRoles extends UserProfile {
  roles: string[];
}
