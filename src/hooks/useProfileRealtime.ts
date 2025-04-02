import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

export function useProfileRealtime() {
  const { user, updateUser } = useUser();
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    // Set up a real-time listener for profile changes
    const channel = supabase
      .channel(`profile-changes-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Profile updated in real-time:', payload);
          try {
            if (payload.new) {
              // Keep the email from the current user context since it's not in the profiles table
              const updatedProfile = {
                ...payload.new,
                email: user.email 
              } as UserProfile;
              
              // Update the user context with the new profile data
              updateUser({
                ...updatedProfile
              });
              
              // Show a notification for important profile changes
              if (payload.new.role !== payload.old?.role) {
                toast({
                  title: 'Profile updated',
                  description: 'Your user role has been updated',
                });
              }
            }
          } catch (err) {
            console.error('Error handling profile update:', err);
            setError(err instanceof Error ? err : new Error('Unknown error updating profile'));
          }
        }
      )
      .subscribe();

    setIsListening(true);
    console.log('Profile real-time listener activated for user', user.id);

    // Cleanup
    return () => {
      console.log('Removing profile real-time listener');
      supabase.removeChannel(channel);
      setIsListening(false);
    };
  }, [user?.id, updateUser, user?.email]);

  return { isListening, error };
}

export default useProfileRealtime;
