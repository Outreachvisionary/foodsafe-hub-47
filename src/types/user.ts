
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  department: string;
  organization_id: string;
  preferences?: any;
  created_at: string;
  updated_at: string;
  status: string;
  preferred_language: string;
  department_id: string;
  assigned_facility_ids: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  department: string;
  organization_id: string;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'pending';
  preferred_language: string;
  department_id: string;
  assigned_facility_ids: string[];
}

export interface CreateUserRequest {
  email: string;
  full_name: string;
  role: string;
  department: string;
  organization_id: string;
  password?: string;
  avatar_url?: string;
  preferred_language?: string;
  department_id?: string;
  assigned_facility_ids?: string[];
}

export interface UpdateUserRequest {
  id: string;
  full_name?: string;
  role?: string;
  department?: string;
  avatar_url?: string;
  preferred_language?: string;
  preferences?: Record<string, any>;
  status?: 'active' | 'inactive' | 'pending';
  department_id?: string;
  assigned_facility_ids?: string[];
}
