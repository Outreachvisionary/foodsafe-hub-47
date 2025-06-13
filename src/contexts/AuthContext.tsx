
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

  // Fetch user profile from the profiles table
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data as UserProfile;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const userProfile = await fetchProfile(user.id);
      setProfile(userProfile);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        toast.success('Signed in successfully');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
      throw error;
    }
  };

  // Sign up function  
  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
      
      toast.success('Account created successfully! Please check your email to verify your account.');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
      throw error;
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign out');
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw error;
      
      toast.success('Password reset email sent');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send reset email');
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user) throw new Error('No user logged in');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

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

    // Get initial session
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          return;
        }
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const userProfile = await fetchProfile(session.user.id);
            if (mounted) {
              setProfile(userProfile);
            }
          } catch (error) {
            console.error('Error fetching initial profile:', error);
          }
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const userProfile = await fetchProfile(session.user.id);
            if (mounted) {
              setProfile(userProfile);
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
        
        if (mounted && !loading) {
          setLoading(false);
        }
      }
    );

    initializeSession();

    return () => {
      mounted = false;
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
