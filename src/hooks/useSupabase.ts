
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useSupabase = () => {
  const { user } = useAuth();

  // Generic query function with error handling
  const query = useCallback(async <T>(
    queryFn: () => Promise<{ data: T | null; error: any }>
  ): Promise<T | null> => {
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        console.error('Supabase query error:', error);
        toast.error(`Database error: ${error.message}`);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Unexpected error in query:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  }, []);

  // Generic mutation function with error handling
  const mutate = useCallback(async <T>(
    mutateFn: () => Promise<{ data: T | null; error: any }>,
    successMessage?: string
  ): Promise<T | null> => {
    try {
      const { data, error } = await mutateFn();
      
      if (error) {
        console.error('Supabase mutation error:', error);
        toast.error(`Database error: ${error.message}`);
        return null;
      }
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      return data;
    } catch (error) {
      console.error('Unexpected error in mutation:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  }, []);

  // Check if user is authenticated
  const ensureAuth = useCallback(() => {
    if (!user) {
      toast.error('You must be logged in to perform this action');
      return false;
    }
    return true;
  }, [user]);

  return {
    supabase,
    user,
    query,
    mutate,
    ensureAuth,
  };
};

export default useSupabase;
