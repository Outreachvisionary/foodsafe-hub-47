
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

type SubscriptionEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeSubscriptionOptions<T> {
  table: string;
  events?: SubscriptionEvent[];
  filter?: string;
  filterValue?: any;
  onDataChange?: (newData: T[]) => void;
  onError?: (error: Error) => void;
  initialFetch?: boolean;
  cacheTime?: number; // Time in ms to cache data
  relatedTables?: string[]; // Related tables to listen for changes
}

export function useRealtimeSubscription<T extends Record<string, any>>(
  options: UseRealtimeSubscriptionOptions<T>
) {
  const {
    table,
    events = ['*'],
    filter,
    filterValue,
    onDataChange,
    onError,
    initialFetch = true,
    cacheTime = 30000, // Default 30s cache
    relatedTables = []
  } = options;
  
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(initialFetch);
  const [error, setError] = useState<Error | null>(null);
  
  // Use refs for data that doesn't need to trigger re-renders
  const channelRef = useRef<RealtimeChannel | null>(null);
  const relatedChannelsRef = useRef<RealtimeChannel[]>([]);
  const cacheRef = useRef<{
    data: T[] | null;
    timestamp: number;
  }>({ data: null, timestamp: 0 });

  // Memoize fetchData to prevent unnecessary re-creation
  const fetchData = useCallback(async () => {
    try {
      // Check if we have cached data that's not expired
      const now = Date.now();
      if (cacheRef.current.data && (now - cacheRef.current.timestamp < cacheTime)) {
        setData(cacheRef.current.data);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      let query = supabase.from(table).select('*');
      
      if (filter && filterValue !== undefined) {
        query = query.eq(filter, filterValue);
      }
      
      const { data: result, error: apiError } = await query;
      
      if (apiError) {
        throw apiError;
      }
      
      const typedResult = result as T[];
      
      // Update cache
      cacheRef.current = {
        data: typedResult,
        timestamp: now
      };
      
      setData(typedResult);
      if (onDataChange) {
        onDataChange(typedResult);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      if (onError) {
        onError(error);
      }
      console.error(`Error fetching data from ${table}:`, error);
    } finally {
      setLoading(false);
    }
  }, [table, filter, filterValue, onDataChange, onError, cacheTime]);

  // Initial data fetch
  useEffect(() => {
    if (initialFetch) {
      fetchData();
    }
  }, [initialFetch, fetchData]);

  // Set up realtime subscription to primary table
  useEffect(() => {
    console.log(`Setting up realtime subscription for ${table}`);
    
    // Clean up existing channel if it exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    
    const channel = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table 
        }, 
        (payload) => {
          console.log('Realtime update received:', payload);
          
          // Immediately invalidate cache
          cacheRef.current.timestamp = 0;
          
          // Throttle refetch to avoid multiple calls for batch operations
          fetchData();
          
          // Show a toast notification, but not too many
          const event = payload.eventType;
          toast({
            title: `${table.charAt(0).toUpperCase() + table.slice(1)} ${event.toLowerCase()}d`,
            description: `A ${table.replace(/_/g, ' ')} was ${event.toLowerCase()}d.`,
          });
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${table}:`, status);
      });
    
    channelRef.current = channel;

    return () => {
      console.log(`Unsubscribing from ${table}`);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [table, fetchData]);

  // Set up subscriptions for related tables
  useEffect(() => {
    if (!relatedTables || relatedTables.length === 0) return;

    console.log(`Setting up related table subscriptions for ${table}:`, relatedTables);
    
    // Clean up existing related channels
    relatedChannelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    
    relatedChannelsRef.current = [];
    
    // Create a subscription for each related table
    relatedTables.forEach(relatedTable => {
      const channel = supabase
        .channel(`public:${relatedTable}:${table}`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: relatedTable 
          }, 
          (payload) => {
            console.log(`Related table update from ${relatedTable}:`, payload);
            
            // Invalidate cache to force refetch of main data
            cacheRef.current.timestamp = 0;
            
            // Fetch fresh data for the primary table
            fetchData();
            
            // Show a toast notification for the related table update
            const event = payload.eventType;
            toast({
              title: `${relatedTable.charAt(0).toUpperCase() + relatedTable.slice(1)} ${event.toLowerCase()}d`,
              description: `Changes in ${relatedTable.replace(/_/g, ' ')} may affect this view.`,
            });
          }
        )
        .subscribe((status) => {
          console.log(`Subscription status for related table ${relatedTable}:`, status);
        });
      
      relatedChannelsRef.current.push(channel);
    });

    return () => {
      console.log(`Unsubscribing from related tables for ${table}`);
      relatedChannelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      relatedChannelsRef.current = [];
    };
  }, [table, relatedTables, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export default useRealtimeSubscription;
