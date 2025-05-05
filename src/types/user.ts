
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
  dashboardView?: string;
  [key: string]: any; // Allow for additional preference properties
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  organization_id?: string;
  facility_ids?: string[];
  status?: 'active' | 'inactive' | 'pending';
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

export interface UserContextType {
  user: User | null;
  profile?: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
}
