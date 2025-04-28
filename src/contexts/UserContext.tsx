
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { UserProfile, AppUser } from '@/types/user';

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: true,
  signOut: async () => {},
  updateProfile: async () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const session = supabase.auth.getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      setIsAuthenticated(!!session?.user);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    const fetchProfile = async (userId: string) => {
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(profileData as UserProfile || null);
        }
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if ((session as any)?.data?.session?.user) {
      setUser((session as any)?.data?.session?.user);
      setIsAuthenticated(true);
      fetchProfile((session as any)?.data?.session?.user.id);
    } else {
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
      } else if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
    }
  };

  const value = {
    user,
    profile,
    isAuthenticated,
    loading,
    signOut,
    updateProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
