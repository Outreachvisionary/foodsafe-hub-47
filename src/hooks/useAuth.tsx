import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { updateUser } = useUser();

  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth event:', event);
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // If session/user changed, sync with user context
        if (currentSession?.user) {
          // Use setTimeout to prevent potential deadlocks with Supabase
          setTimeout(() => {
            updateUser({
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              // Other fields will be populated by UserContext
            });
          }, 0);
        }
      }
    );

    // Then check for initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session?.user) {
          // Use setTimeout to prevent potential deadlocks with Supabase
          setTimeout(() => {
            updateUser({
              id: data.session.user.id,
              email: data.session.user.email || '',
              // Other fields will be populated by UserContext
            });
          }, 0);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [updateUser]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'You are now signed in',
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      toast({
        title: 'Error signing in',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Record<string, any>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Please check your email for a confirmation link',
      });
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      toast({
        title: 'Error signing up',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/');
      
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        title: 'Error signing out',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for a password reset link',
      });
    } catch (error: any) {
      console.error('Error resetting password:', error.message);
      toast({
        title: 'Error resetting password',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully',
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating password:', error.message);
      toast({
        title: 'Error updating password',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
