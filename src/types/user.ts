
export interface User {
  id: string;
  email?: string;
  avatar_url?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
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
  preferences?: Record<string, any>;
}
