
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeSubscriptionOptions {
  table: string;
  onDataChange?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useRealtimeSubscription = <T = any>({
  table,
  onDataChange,
  onError
}: UseRealtimeSubscriptionOptions) => {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        (payload) => {
          if (onDataChange) {
            onDataChange(payload);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to realtime updates for ${table}`);
        } else if (status === 'CHANNEL_ERROR') {
          if (onError) {
            onError(new Error(`Failed to subscribe to ${table} updates`));
          }
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, onDataChange, onError]);

  return channelRef.current;
};
