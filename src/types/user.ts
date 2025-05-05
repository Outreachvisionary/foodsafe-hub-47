
// Define types related to user accounts and profiles

export interface UserPreferences {
  reportLayout?: string;
  theme?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    desktop?: boolean;
  };
  defaultView?: string;
  [key: string]: any; // Allow for additional preference properties
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  preferences?: UserPreferences;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  role?: string;
  department?: string;
  organization_id?: string;
  status?: string;
  avatar_url?: string;
  preferences?: UserPreferences;
}
