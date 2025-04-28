
export interface UserProfile {
  id?: string;
  full_name?: string;
  avatar_url?: string;
  organization_id?: string;
  department_id?: string;
  department?: string;
  role?: string;
  status?: string;
  assigned_facility_ids?: string[];
  preferred_language?: string;
  preferences?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface AppUser {
  id: string;
  email: string;
  role: string;
  profile?: UserProfile;
  full_name?: string;
  avatar_url?: string;
  user_metadata?: Record<string, any>;
}

// Extended User type for compatibility with components expecting profile property
export interface User {
  id: string;
  email: string;
  profile: {
    full_name?: string;
    avatar_url?: string;
    department?: string;
  };
  full_name?: string;
  avatar_url?: string;
}

// Convert AppUser to User format for component compatibility
export const adaptAppUserToUser = (appUser: AppUser): User => {
  return {
    id: appUser.id,
    email: appUser.email,
    full_name: appUser.full_name || appUser.profile?.full_name,
    avatar_url: appUser.avatar_url || appUser.profile?.avatar_url,
    profile: {
      full_name: appUser.full_name || appUser.profile?.full_name,
      avatar_url: appUser.avatar_url || appUser.profile?.avatar_url,
      department: appUser.profile?.department
    }
  };
};
