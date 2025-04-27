
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { safeJsonAccess } from '@/utils/typeAdapters';

interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  sidebar_collapsed?: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  organization_id?: string;
  department?: string;
  preferences?: UserPreferences;
  assigned_facility_ids?: string[];
  status?: 'active' | 'inactive' | 'pending';
  role?: string;
  preferred_language?: string;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Alias for logout
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);
  
  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Convert preferences to proper type with type-safe access
        const defaultPreferences: UserPreferences = {
          theme: 'system',
          notifications: true,
          sidebar_collapsed: false
        };
        
        const preferences = safeJsonAccess<UserPreferences>(
          profileData.preferences, 
          defaultPreferences
        );
        
        // Safely determine status
        let status: 'active' | 'inactive' | 'pending' = 'active';
        if (profileData.status === 'inactive') status = 'inactive';
        if (profileData.status === 'pending') status = 'pending';
        
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          organization_id: profileData.organization_id,
          department: profileData.department,
          preferences: preferences,
          assigned_facility_ids: profileData.assigned_facility_ids,
          status: status,
          role: profileData.role,
          preferred_language: profileData.preferred_language
        });
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // Convert preferences to a JSON-safe object if included in update
      let updateData: any = { ...data };
      if (data.preferences) {
        updateData.preferences = JSON.stringify(data.preferences);
      }
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err as Error);
      throw err;
    }
  };
  
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error('Error during logout:', err);
      setError(err as Error);
    }
  };
  
  // Provide signOut as an alias for logout
  const signOut = logout;
  
  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        updateProfile, 
        logout, 
        signOut, 
        refreshUser 
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
