
import { DocumentStatus, CheckoutStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/enums';

// Re-export the types from enums for proper type compatibility
export { DocumentStatus, CheckoutStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating };

export type DocumentVersionType = 'major' | 'minor';

export interface User {
  id: string;
  email?: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  organization_id?: string;
  facility_ids?: string[];
  preferences?: {
    reportLayout?: string;
    dashboardView?: string;
    theme?: string;
    [key: string]: any;
  };
  status?: 'active' | 'inactive' | 'pending';
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
  preferences?: {
    reportLayout?: string;
    dashboardView?: string;
    theme?: string;
    [key: string]: any;
  };
}

export interface UserContextType {
  user: User | null;
  profile?: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
}
