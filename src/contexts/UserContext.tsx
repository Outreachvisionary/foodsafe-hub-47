
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  organization_id?: string;
  department?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: boolean;
    sidebar_collapsed?: boolean;
  };
  assigned_facility_ids?: string[];
  status?: 'active' | 'inactive' | 'pending';
  role?: string;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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
          
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url,
            organization_id: profileData.organization_id,
            department: profileData.department,
            preferences: profileData.preferences || {},
            assigned_facility_ids: profileData.assigned_facility_ids,
            status: profileData.status,
            role: profileData.role
          });
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(data)
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
      console.error('Error signing out:', err);
      setError(err as Error);
      throw err;
    }
  };
  
  const refreshUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
          
        if (profileError) throw profileError;
        
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          organization_id: profileData.organization_id,
          department: profileData.department,
          preferences: profileData.preferences || {},
          assigned_facility_ids: profileData.assigned_facility_ids,
          status: profileData.status,
          role: profileData.role
        });
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
      setError(err as Error);
      throw err;
    }
  };
  
  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      error, 
      updateProfile, 
      logout,
      refreshUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
