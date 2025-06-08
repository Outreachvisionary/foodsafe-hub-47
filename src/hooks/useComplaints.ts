
import { useState, useEffect } from 'react';
import { Complaint, ComplaintFilter } from '@/types/complaint';
import { fetchComplaints } from '@/services/complaintService';
import { useRealtimeSubscription } from './useRealtimeSubscription';

export function useComplaints(initialFilter?: ComplaintFilter) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<ComplaintFilter | undefined>(initialFilter);

  // Use realtime subscription for complaints table
  useRealtimeSubscription({
    table: 'complaints',
    onDataChange: (payload) => {
      console.log('Complaints data changed:', payload);
      // Refetch complaints when data changes
      loadComplaints();
    },
    onError: (err) => {
      setError(err);
    }
  });

  // Load complaints with filters
  const loadComplaints = async (filterOptions?: ComplaintFilter) => {
    try {
      setIsLoading(true);
      setError(null);
      const currentFilter = filterOptions || filter;
      const data = await fetchComplaints(currentFilter);
      setComplaints(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching complaints'));
      console.error('Error loading complaints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply new filter
  const applyFilter = (newFilter: ComplaintFilter) => {
    setFilter(newFilter);
    loadComplaints(newFilter);
  };

  // Clear filter
  const clearFilter = () => {
    setFilter(undefined);
    loadComplaints(undefined);
  };

  // Initial load
  useEffect(() => {
    loadComplaints();
  }, []);

  return {
    complaints,
    isLoading,
    error,
    refresh: loadComplaints,
    filter,
    applyFilter,
    clearFilter,
  };
}

export default useComplaints;
