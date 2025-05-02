
import { UserProfile } from "@/types/profile";

export interface User {
  id: string;
  email: string;
  created_at: string;
  profile?: UserProfile;
  role?: string;
  full_name?: string;
  preferences?: {
    reportLayout?: string;
    dashboardView?: string;
    theme?: string;
    [key: string]: any;
  };
  organization_id?: string;
}

export interface AppUser extends User {
  // Add any app-specific user properties here
}
