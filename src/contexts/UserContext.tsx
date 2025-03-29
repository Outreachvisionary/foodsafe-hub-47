import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper function to build user profile to avoid code duplication
const buildUserProfile = (sessionUser: any, profileData: any): UserProfile => {
  return {
    id: sessionUser.id,
    email: sessionUser.email || '',
    full_name: profileData?.full_name,
    avatar_url: profileData?.avatar_url,
    role: profileData?.role,
    department: profileData?.department,
    // Set these properties if they exist in the profile
    organization_id: profileData?.organization_id,
    assigned_facility_ids: profileData?.assigned_facility_ids,
    preferred_language: profileData?.preferred_language,
    preferences: profileData?.preferences ? 
      (typeof profileData.preferences === 'object' ? profileData.preferences : {}) : {}
  };
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Add a safety timeout to prevent infinite loading
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Loading state timeout - forcing completion');
        setLoading(false);
      }
    }, 10000); // 10 second safety timeout
    
    return () => clearTimeout(safetyTimeout);
  }, [loading]);

  useEffect(() => {
    // Check for active session on mount
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          try {
            // Fetch user profile data
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error('Error fetching profile data:', profileError);
              // Set minimal user data if profile fetch fails
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                // Other fields will be undefined
              } as UserProfile);
            } else {
              setUser(buildUserProfile(session.user, profile));
            }
          } catch (profileError) {
            console.error('Exception fetching profile:', profileError);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
            } as UserProfile);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            try {
              // Fetch user profile data
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (profileError) {
                console.error('Error fetching profile data during auth change:', profileError);
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  // Other fields will be undefined
                } as UserProfile);
              } else {
                setUser(buildUserProfile(session.user, profile));
              }
            } catch (profileError) {
              console.error('Exception fetching profile during auth change:', profileError);
              setUser({
                id: session.user.id,
                email: session.user.email || '',
              } as UserProfile);
            }
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      // Note: don't setLoading(false) here, as the auth state change will handle that
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      // Note: don't setLoading(false) here, as the auth state change will handle that
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...updates });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  // Memoize the context value to prevent unnecessary rerenders
  const value = useMemo(() => ({
    user,
    loading,
    signIn,
    signOut,
    updateProfile,
    updateUser
  }), [user, loading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
