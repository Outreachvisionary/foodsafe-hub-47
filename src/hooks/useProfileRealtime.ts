
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

export default function useProfileRealtime() {
  const { user } = useUser();
  const [isListening, setIsListening] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    // Set up real-time listener for profile updates
    setIsListening(true);
    const channel = supabase
      .channel(`profile-updates-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        () => {
          // Refresh the user data when profile is updated
          // Note: We've removed the refreshUser call as it doesn't exist
          console.log('Profile updated, refresh recommended');
        }
      )
      .subscribe();

    return () => {
      setIsListening(false);
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { isListening };
}
