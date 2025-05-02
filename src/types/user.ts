
export interface User {
  id: string;
  email?: string;
  avatar_url?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  name?: string;
  role?: string;
  department?: string;
  organization_id?: string;
  facility_ids?: string[];
  full_name?: string; 
  profile?: UserProfile;
  status?: 'active' | 'inactive' | 'pending';
  preferences?: {
    theme?: string;
    notifications?: boolean;
    defaultView?: string;
    reports?: {
      favoriteReports?: string[];
      recentReports?: string[];
      defaultTimeRange?: string;
      defaultChartType?: string;
    };
  };
}

export interface UserProfile {
  id: string;
  user_id?: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  organization_id?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  preferred_language?: string;
  preferences?: Record<string, any>;
}

export interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
}
