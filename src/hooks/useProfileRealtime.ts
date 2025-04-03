import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { useUser } from '@/contexts/UserContext';

export function useProfileRealtime() {
  const { user, updateUser } = useUser();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    // Set up a real-time listener for profile changes
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Profile updated:', payload);
          if (payload.new) {
            // Keep the email from the current user context
            const updatedProfile = {
              ...payload.new,
              email: user.email // Keep the existing email
            } as UserProfile;
            
            // Update the user context with the new profile data
            updateUser({
              ...user,
              ...updatedProfile
            });
          }
        }
      )
      .subscribe();

    setIsListening(true);

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
      setIsListening(false);
    };
  }, [user?.id, updateUser, user]);

  return { isListening };
}

export default useProfileRealtime;
