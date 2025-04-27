
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

export default function useProfileRealtime() {
  const { user, refreshUser } = useUser();
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
          refreshUser();
        }
      )
      .subscribe();

    return () => {
      setIsListening(false);
      supabase.removeChannel(channel);
    };
  }, [user, refreshUser]);

  return { isListening };
}
