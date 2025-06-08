
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ProfileData } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUserProfile: (userId: string) => Promise<User | null>;
  updateUserProfile: (userId: string, updates: Partial<User>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);

      // First, get the user data from auth
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      // Then get the profile data from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      if (profile && authUser.user) {
        const userData: User = {
          id: profile.id,
          email: authUser.user.email || '', // Get email from auth user
          full_name: profile.full_name || '',
          avatar_url: profile.avatar_url,
          role: profile.role || '',
          department: profile.department || '',
          organization_id: profile.organization_id || '',
          preferences: profile.preferences,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          status: (profile.status as 'active' | 'inactive' | 'pending') || 'active',
          preferred_language: profile.preferred_language || '',
          department_id: profile.department_id || '',
          assigned_facility_ids: profile.assigned_facility_ids || [],
        };

        setUser(userData);
        return userData;
      }

      return null;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name,
          avatar_url: updates.avatar_url,
          role: updates.role,
          department: updates.department,
          organization_id: updates.organization_id,
          preferences: updates.preferences,
          status: updates.status as 'active' | 'inactive' | 'pending',
          preferred_language: updates.preferred_language,
          department_id: updates.department_id,
          assigned_facility_ids: updates.assigned_facility_ids,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      // Update local user state
      if (user) {
        setUser({ ...user, ...updates });
      }

      return true;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      await fetchUserProfile(authUser.id);
    }
  };

  // Initialize user on mount
  useEffect(() => {
    const initializeUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await fetchUserProfile(authUser.id);
      } else {
        setLoading(false);
      }
    };

    initializeUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: UserContextType = {
    user,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    refreshUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
