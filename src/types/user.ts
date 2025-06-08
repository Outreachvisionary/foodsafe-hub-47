
// User types
export interface UserPreferences {
  theme?: string;
  notifications?: boolean;
  language?: string;
  preferred_language?: string;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  organization_id?: string;
  department_id?: string;
  assigned_facility_ids?: string[];
  preferences?: UserPreferences;
  preferred_language?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: any;
  app_metadata?: any;
  created_at?: string;
  updated_at?: string;
}
