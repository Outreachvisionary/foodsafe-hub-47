
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { Session } from '@supabase/supabase-js';

interface UserContextType {
  user: UserProfile | null;
  session: Session | null;
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
      (typeof profileData.preferences === 'object' ? profileData.preferences : {}) : {},
    department_id: profileData?.department_id,
    status: profileData?.status,
    metadata: profileData?.metadata,
  };
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Add a safety timeout to prevent infinite loading
  useEffect(() => {
    if (!initialCheckDone) return; // Don't start safety timeout until initial check is done
    
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Loading state timeout - forcing completion');
        setLoading(false);
      }
    }, 5000); // 5 second safety timeout (reduced from 10s)
    
    return () => clearTimeout(safetyTimeout);
  }, [loading, initialCheckDone]);

  // Fetch user profile data - extracted as a separate function to avoid duplication
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile data:', profileError);
        return null;
      }
      
      return profile;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // IMPORTANT: First set up auth state listener before checking current session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          setLoading(true);
          
          // Use setTimeout to prevent potential Supabase callback deadlocks
          setTimeout(async () => {
            try {
              const profile = await fetchUserProfile(currentSession.user.id);
              
              if (profile) {
                setUser(buildUserProfile(currentSession.user, profile));
              } else {
                // Set minimal user data if profile fetch fails
                setUser({
                  id: currentSession.user.id,
                  email: currentSession.user.email || '',
                  // Other fields will be undefined
                } as UserProfile);
              }
            } catch (error) {
              console.error('Error in auth state change handler:', error);
              setUser(null);
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Now check for active session on mount
    const getInitialSession = async () => {
      try {
        console.log('Checking for initial session...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          const profile = await fetchUserProfile(currentSession.user.id);
          
          if (profile) {
            setUser(buildUserProfile(currentSession.user, profile));
          } else {
            // Set minimal user data if profile fetch fails
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              // Other fields will be undefined
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
        setInitialCheckDone(true);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign in with email:', email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      setLoading(false); // Important: set loading to false on error
      throw error;
    }
    // Note: we don't setLoading(false) here on success because
    // the auth state change will handle that when it fires
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      setLoading(false); // Important: set loading to false on error
      throw error;
    }
    // Note: we don't setLoading(false) here on success because
    // the auth state change will handle that when it fires
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
      // Ensure we're not removing the email field
      const updatedUser = {
        ...user,
        ...updates,
        email: updates.email || user.email // Ensure email is always available
      };
      
      setUser(updatedUser);
    }
  };

  // Memoize the context value to prevent unnecessary rerenders
  const value = useMemo(() => ({
    user,
    session,
    loading,
    signIn,
    signOut,
    updateProfile,
    updateUser
  }), [user, session, loading]);

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
