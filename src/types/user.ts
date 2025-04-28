export interface UserProfile {
  id?: string;
  full_name?: string;
  avatar_url?: string;
  organization_id?: string;
  department_id?: string;
  department?: string;
  role?: string;
  status?: string;
  assigned_facility_ids?: string[];
  preferred_language?: string;
  preferences?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface AppUser {
  id: string;
  email: string;
  role: string;
  profile?: UserProfile;
}
