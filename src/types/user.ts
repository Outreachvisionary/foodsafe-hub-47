
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
    language?: string;
    [key: string]: any;
  };
  // These fields are from the existing type
  organization_id?: string;
  assigned_facility_ids?: string[];
  preferred_language?: string;
  status?: string;
  metadata?: Record<string, any>;
  
  // New fields
  department_id?: string;
}
