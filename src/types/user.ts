
import { UserProfile } from "@/types/user";

export interface User {
  id: string;
  email: string;
  created_at: string;
  profile?: UserProfile;
  role?: string;
  full_name?: string;
  department?: string; // Add missing department property
  avatar_url?: string; // Add missing avatar_url property
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

export interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  role?: string;
  department?: string;
  organization_id?: string;
  status?: string;
  avatar_url?: string;
  preferred_language?: string; // Add missing property
  preferences?: Record<string, any>;
}
