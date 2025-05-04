
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

type SubscriptionEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeSubscriptionOptions<T> {
  table: string;
  events?: SubscriptionEvent[];
  filter?: string;
  filterValue?: any;
  onDataChange?: (newData: T[]) => void;
  onError?: (error: Error) => void;
  initialFetch?: boolean;
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
    initialFetch = true
  } = options;
  
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(initialFetch);
  const [error, setError] = useState<Error | null>(null);

  // Initial data fetch
  useEffect(() => {
    if (initialFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetch, table, filter, filterValue]);

  // Set up realtime subscription
  useEffect(() => {
    console.log(`Setting up realtime subscription for ${table}`);
    
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
          // Refresh data on any change
          fetchData();
          
          // Show a toast notification
          const event = payload.eventType;
          toast({
            title: `${table.charAt(0).toUpperCase() + table.slice(1)} ${event.toLowerCase()}d`,
            description: `A ${table.replace(/_/g, ' ')} was ${event.toLowerCase()}d.`,
          });
        }
      )
      .subscribe();

    return () => {
      console.log(`Unsubscribing from ${table}`);
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const fetchData = async () => {
    try {
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
      
      setData(result as T[]);
      if (onDataChange) {
        onDataChange(result as T[]);
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
  };

  return { data, loading, error, refetch: fetchData };
}
