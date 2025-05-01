
export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  organization_id?: string;
  facility_ids?: string[];
  preferences?: Record<string, any>; // Add preferences property
  status?: 'active' | 'inactive' | 'pending';
}

export interface UserProfile {
  id: string;
  full_name?: string;
  email?: string; // Add email property
  role?: string;
  department?: string;
  organization_id?: string;
  status?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
}

export interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>; // Add signIn method
  signOut: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>; // Add updateUser method
}
