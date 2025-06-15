
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  department: string | null;
  organization_id: string | null;
  department_id: string | null;
  assigned_facility_ids: string[] | null;
  status: string | null;
  preferred_language: string | null;
  preferences: any;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Fetch user profile from the profiles table
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        // Don't throw error for missing profile, just return null
        return null;
      }
      
      console.log('Profile fetched successfully:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async (): Promise<void> => {
    if (!user) {
      console.log('No user available for profile refresh');
      return;
    }
    
    try {
      console.log('Refreshing profile for user:', user.id);
      const userProfile = await fetchProfile(user.id);
      setProfile(userProfile);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      console.log('Attempting to sign in user:', email);
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      if (data.user) {
        console.log('Sign in successful for user:', data.user.id);
        toast.success('Signed in successfully');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function  
  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>): Promise<void> => {
    try {
      console.log('Attempting to sign up user:', email);
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }
      
      console.log('Sign up successful');
      toast.success('Account created successfully! Please check your email to verify your account.');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      console.log('Attempting to sign out');
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      console.log('Sign out successful');
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {
    try {
      console.log('Attempting to reset password for:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }
      
      console.log('Password reset email sent');
      toast.success('Password reset email sent');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send reset email');
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user) {
      console.error('Cannot update profile: no user logged in');
      throw new Error('No user logged in');
    }

    try {
      console.log('Updating profile for user:', user.id);
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        console.error('Update profile error:', error);
        throw error;
      }

      console.log('Profile updated successfully');
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
      throw error;
    }
  };

  // Initialize auth state and set up listener
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
          return;
        }
        
        if (!mounted) return;
        
        console.log('Initial session check:', session ? 'Session found' : 'No session');
        
        if (session) {
          setSession(session);
          setUser(session.user);
          
          // Fetch profile with timeout to prevent hanging
          try {
            const profilePromise = fetchProfile(session.user.id);
            const timeoutPromise = new Promise<UserProfile | null>((_, reject) => {
              timeoutId = setTimeout(() => reject(new Error('Profile fetch timeout')), 10000);
            });
            
            const userProfile = await Promise.race([profilePromise, timeoutPromise]);
            clearTimeout(timeoutId);
            
            if (mounted) {
              setProfile(userProfile);
              console.log('Profile loading completed');
            }
          } catch (error) {
            console.error('Error fetching initial profile:', error);
            if (mounted) {
              setProfile(null);
            }
          }
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        if (mounted) {
          console.log('Auth initialization complete');
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session ? 'Session active' : 'No session');
        
        // Clear any existing timeouts
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile for authenticated user with timeout
          try {
            const profilePromise = fetchProfile(session.user.id);
            const timeoutPromise = new Promise<UserProfile | null>((_, reject) => {
              timeoutId = setTimeout(() => reject(new Error('Profile fetch timeout')), 10000);
            });
            
            const userProfile = await Promise.race([profilePromise, timeoutPromise]);
            clearTimeout(timeoutId);
            
            if (mounted) {
              setProfile(userProfile);
              console.log('Profile updated from auth state change');
            }
          } catch (error) {
            console.error('Error fetching profile during auth change:', error);
            if (mounted) {
              setProfile(null);
            }
          }
        } else {
          if (mounted) {
            setProfile(null);
          }
        }
        
        // Set loading to false after auth state change is processed
        if (mounted && initialized) {
          setLoading(false);
        }
      }
    );

    initializeAuth();

    return () => {
      console.log('Cleaning up auth context');
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user && !!session,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
  };

  console.log('AuthProvider rendering with state:', {
    hasUser: !!user,
    hasSession: !!session,
    hasProfile: !!profile,
    loading,
    initialized,
    isAuthenticated: !!user && !!session
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
