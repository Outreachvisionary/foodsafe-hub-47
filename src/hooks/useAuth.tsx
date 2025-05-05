
import { useState, useEffect, useContext, createContext } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn?: (email: string, password: string) => Promise<void>;
  signUp?: (email: string, password: string, userData?: any) => Promise<void>;
  signOut?: () => Promise<void>;
  updateUserProfile?: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on initial load
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || undefined,
            full_name: session.user.user_metadata?.full_name,
            name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            user_metadata: session.user.user_metadata,
            preferences: {
              reportLayout: 'grid', // Default preferences
              theme: 'light',
            }
          };
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || undefined,
            full_name: session.user.user_metadata?.full_name,
            name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            user_metadata: session.user.user_metadata,
            preferences: {
              reportLayout: 'grid', // Default preferences
              theme: 'light',
            }
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Auth functions can be implemented here for actual functionality
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    // Update user preferences
    if (updates.preferences) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          ...updates.preferences
        }
      };
      setUser(updatedUser);
      
      // Here you would typically save to a profiles table in Supabase
      // For now, we're just updating the local state
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
