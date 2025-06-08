
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseRealtimeSubscriptionProps<T> {
  table: string;
  onDataChange: (data: T[]) => void;
  onError: (error: Error) => void;
  filter?: { column: string; value: any };
  initialFetch?: boolean;
  relatedTables?: string[];
}

export function useRealtimeSubscription<T>({
  table,
  onDataChange,
  onError,
  filter,
  initialFetch = true,
  relatedTables = []
}: UseRealtimeSubscriptionProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(initialFetch);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let query = supabase.from(table).select('*');
    
    if (filter) {
      query = query.eq(filter.column, filter.value);
    }

    // Initial fetch
    const fetchData = async () => {
      if (!initialFetch) return;
      
      try {
        setLoading(true);
        const { data: initialData, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        const typedData = (initialData as T[]) || [];
        setData(typedData);
        onDataChange(typedData);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch data');
        setError(error);
        onError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          ...(filter && { filter: `${filter.column}=eq.${filter.value}` })
        },
        () => {
          // Refetch data when changes occur
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter?.column, filter?.value, initialFetch]);

  const refetch = async () => {
    let query = supabase.from(table).select('*');
    
    if (filter) {
      query = query.eq(filter.column, filter.value);
    }

    try {
      setLoading(true);
      const { data: newData, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      const typedData = (newData as T[]) || [];
      setData(typedData);
      onDataChange(typedData);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to refetch data');
      setError(error);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch
  };
}

export default useRealtimeSubscription;
