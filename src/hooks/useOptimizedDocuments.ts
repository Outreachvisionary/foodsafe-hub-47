import { useState, useEffect, useCallback } from 'react';
import { fetchDocuments, getDocumentCounts } from '@/services/enhancedDocumentService';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { Document } from '@/types/document';

// Global cache for document data
const documentCache: {
  documents: Document[] | null;
  counts: Record<string, number> | null;
  timestamp: number;
} = {
  documents: null,
  counts: null,
  timestamp: 0
};

const CACHE_TTL = 60000; // 1 minute

export function useOptimizedDocuments(options: {
  initialFetch?: boolean;
  realtime?: boolean;
  cacheTime?: number;
}) {
  const {
    initialFetch = true,
    realtime = true,
    cacheTime = CACHE_TTL
  } = options;
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(initialFetch);
  const [error, setError] = useState<Error | null>(null);

  // Fetch counts separately - they're smaller and can be updated more frequently
  const fetchCounts = useCallback(async () => {
    try {
      const now = Date.now();
      if (documentCache.counts && (now - documentCache.timestamp < cacheTime)) {
        setCounts(documentCache.counts);
        return;
      }
      
      const countData = await getDocumentCounts();
      
      // Update cache
      documentCache.counts = countData;
      documentCache.timestamp = now;
      
      setCounts(countData);
    } catch (err) {
      console.error('Failed to fetch document counts:', err);
    }
  }, [cacheTime]);

  // Main document fetch function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const now = Date.now();
      if (documentCache.documents && (now - documentCache.timestamp < cacheTime)) {
        setDocuments(documentCache.documents);
        setLoading(false);
        return;
      }
      
      const data = await fetchDocuments();
      
      // Update cache
      documentCache.documents = data;
      documentCache.timestamp = now;
      
      setDocuments(data);
      
      // Also fetch counts since we're already making a request
      fetchCounts();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error fetching documents');
      setError(error);
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, [cacheTime, fetchCounts]);

  // Set up realtime subscription if enabled
  const subscription = useRealtimeSubscription<Document>({
    table: 'documents',
    onDataChange: (newData) => {
      // Invalidate cache
      documentCache.timestamp = 0;
      fetchData();
    },
    onError: (err) => {
      setError(err);
    }
  });

  // Initial fetch
  useEffect(() => {
    if (initialFetch) {
      fetchData();
    }
  }, [initialFetch, fetchData]);

  const refresh = useCallback(() => {
    // Invalidate cache
    documentCache.timestamp = 0;
    fetchData();
  }, [fetchData]);

  return {
    documents,
    counts,
    loading,
    error,
    refresh
  };
}
