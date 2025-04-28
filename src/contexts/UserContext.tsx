import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  department?: string;
}

interface UserContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: any) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  resetPassword: async () => {},
  updateUserProfile: async () => {},
  refreshSession: async () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        if (currentUser) {
          // If user exists in auth, fetch their profile
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
          }
          
          // Set user with combined auth and profile data
          setUser({
            id: currentUser.id,
            email: currentUser.email,
            full_name: data?.full_name || currentUser.user_metadata?.full_name,
            avatar_url: data?.avatar_url,
            role: data?.role,
            department: data?.department
          });
        } else {
          setUser(null);
        }
      } catch (error: any) {
        console.error('Error fetching user:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial fetch
    fetchUser();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser();
      } else {
        setUser(null);
      }
    });
    
    // Clean up subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error logging in:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
    } catch (error: any) {
      console.error('Error logging out:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signUp({ email, password }, { data: metadata });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserProfile = async (updates: any) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) throw new Error('No user logged in');
      
      // Update auth user_metadata if needed
      if (updates.full_name) {
        await supabase.auth.updateUser({
          data: { full_name: updates.full_name }
        });
      }
      
      // Update profile record
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name || user.full_name,
          avatar_url: updates.avatar_url || user.avatar_url,
          role: updates.role || user.role,
          department: updates.department || user.department,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setUser({ ...user, ...updates });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const refreshSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (currentUser) {
        // If user exists in auth, fetch their profile
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        }
        
        // Set user with combined auth and profile data
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          full_name: data?.full_name || currentUser.user_metadata?.full_name,
          avatar_url: data?.avatar_url,
          role: data?.role,
          department: data?.department
        });
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.error('Error refreshing session:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updateUserProfile,
    refreshSession
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
