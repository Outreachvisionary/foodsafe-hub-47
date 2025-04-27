
export interface UserProfile {
  id: string;
  full_name?: string;
  displayName?: string;
  email?: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  organization_id?: string;
  assigned_facility_ids?: string[];
  preferences?: Record<string, any>;
  status?: string;
  preferred_language?: string;
}
