
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  organization_id?: string;
  assigned_facility_ids?: string[];
  department_id?: string;
  preferred_language?: string;
  status?: string;
  preferences?: any;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const queryClient = useQueryClient();

  console.log('AuthProvider rendering with state:', {
    hasUser: !!user,
    hasSession: !!session,
    hasProfile: !!profile,
    loading,
    initialized,
    isAuthenticated: !!user && !!session
  });

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000);
      });

      // Race the fetch against the timeout
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Profile fetch failed:', error);
      // Don't throw - return null to allow app to continue
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      queryClient.clear();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session with timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Session fetch timeout')), 3000);
        });

        const sessionPromise = supabase.auth.getSession();
        const { data: { session: initialSession }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]);

        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          // Try to fetch profile, but don't block on it
          if (initialSession?.user) {
            const profileData = await fetchProfile(initialSession.user.id);
            if (isMounted) {
              setProfile(profileData);
            }
          }

          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event, session ? 'Session active' : 'No session');
        
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Try to fetch profile, but don't block the UI
          const profileData = await fetchProfile(session.user.id);
          if (isMounted) {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }

        if (initialized) {
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [initialized]);

  // Set a maximum loading time to prevent infinite loading
  useEffect(() => {
    const maxLoadingTime = setTimeout(() => {
      if (loading && !initialized) {
        console.log('Max loading time reached, stopping loading state');
        setLoading(false);
        setInitialized(true);
      }
    }, 10000); // 10 seconds max loading

    return () => clearTimeout(maxLoadingTime);
  }, [loading, initialized]);

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user && !!session,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
