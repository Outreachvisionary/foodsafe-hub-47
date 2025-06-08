
import { useState, useEffect } from 'react';
import { NonConformance } from '@/types/non-conformance';
import { getAllNonConformances } from '@/services/nonConformanceService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useNonConformances() {
  const [nonConformances, setNonConformances] = useState<NonConformance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load non-conformances
  const loadNonConformances = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await getAllNonConformances();
      setNonConformances(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching non-conformances'));
      console.error('Error loading non-conformances:', err);
      toast.error('Failed to load non-conformances');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    loadNonConformances();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('non_conformances_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'non_conformances'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // Reload data when changes occur
          loadNonConformances();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    nonConformances,
    isLoading,
    error,
    refresh: loadNonConformances,
  };
}

export default useNonConformances;
