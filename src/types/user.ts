
export interface UserProfile {
  id: string;
  full_name?: string;
  displayName?: string;
  email?: string; // Add email property
  avatar_url?: string;
  role?: string;
  department?: string;
  organization_id?: string;
  preferences?: Record<string, any>;
  status?: string;
  preferred_language?: string;
}
