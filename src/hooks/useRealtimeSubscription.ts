
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type TableName = 'documents' | 'capa_actions' | 'non_conformances' | 'complaints' | 'audits' | 'training_records' | 'suppliers';

interface UseRealtimeSubscriptionOptions {
  table: TableName;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onInsert?: (payload: RealtimePostgresChangesPayload<any>) => void;
  onUpdate?: (payload: RealtimePostgresChangesPayload<any>) => void;
  onDelete?: (payload: RealtimePostgresChangesPayload<any>) => void;
  enabled?: boolean;
}

export const useRealtimeSubscription = (options: UseRealtimeSubscriptionOptions) => {
  const {
    table,
    event = '*',
    filter,
    onInsert,
    onUpdate,
    onDelete,
    enabled = true
  } = options;

  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const channelName = `realtime:${table}`;
    
    try {
      // Create channel
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event,
            schema: 'public',
            table,
            filter
          },
          (payload) => {
            console.log(`Realtime ${payload.eventType} on ${table}:`, payload);
            
            switch (payload.eventType) {
              case 'INSERT':
                onInsert?.(payload);
                break;
              case 'UPDATE':
                onUpdate?.(payload);
                break;
              case 'DELETE':
                onDelete?.(payload);
                break;
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            setError(null);
            console.log(`Subscribed to realtime changes for ${table}`);
          } else if (status === 'CHANNEL_ERROR') {
            setIsConnected(false);
            setError('Failed to subscribe to realtime changes');
            console.error(`Failed to subscribe to realtime changes for ${table}`);
          } else if (status === 'TIMED_OUT') {
            setIsConnected(false);
            setError('Subscription timed out');
            console.error(`Subscription timed out for ${table}`);
          }
        });

      channelRef.current = channel;

    } catch (err) {
      console.error(`Error setting up realtime subscription for ${table}:`, err);
      setError('Failed to set up realtime subscription');
    }

    // Cleanup function
    return () => {
      if (channelRef.current) {
        console.log(`Unsubscribing from realtime changes for ${table}`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        setIsConnected(false);
      }
    };
  }, [table, event, filter, onInsert, onUpdate, onDelete, enabled]);

  const refresh = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsConnected(false);
    }
    // Re-trigger the effect by updating a state
    setError(null);
  };

  return {
    isConnected,
    error,
    refresh
  };
};

export default useRealtimeSubscription;
