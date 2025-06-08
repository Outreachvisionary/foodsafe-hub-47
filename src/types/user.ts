
export interface UserPreferences {
  reportLayout?: 'grid' | 'list';
  theme?: 'light' | 'dark';
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  timezone?: string;
}

export interface User {
  id: string;
  email?: string;
  full_name?: string;
  name?: string;
  avatar_url?: string;
  user_metadata?: any;
  preferences?: UserPreferences;
  role?: string;
  department?: string;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  full_name?: string | null;
  email?: string;
  role?: string | null;
  department?: string | null;
  organization_id?: string | null;
  status?: string | null;
  avatar_url?: string | null;
  preferences?: UserPreferences;
  assigned_facility_ids?: string[];
  department_id?: string | null;
  preferred_language?: string | null;
  created_at?: string;
  updated_at?: string;
}
