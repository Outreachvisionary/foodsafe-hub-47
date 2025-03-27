
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  preferences?: {
    dashboardLayout?: string;
    theme?: string;
    notificationsEnabled?: boolean;
    [key: string]: any;
  };
  // New additions for multi-facility support
  organization_id?: string;
  assigned_facility_ids?: string[];
  preferred_language?: string;
  status?: string;
  metadata?: Record<string, any>;
}
