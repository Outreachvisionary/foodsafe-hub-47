
import { useState, useEffect, useCallback } from 'react';
import { Document } from '@/types/document';
import { fetchDocuments } from '@/services/documentService';
import { supabase } from '@/integrations/supabase/client';

interface UseOptimizedDocumentsOptions {
  initialFetch?: boolean;
  realtime?: boolean;
  cacheTime?: number;
}

interface UseOptimizedDocumentsReturn {
  documents: Document[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const useOptimizedDocuments = (
  options: UseOptimizedDocumentsOptions = {}
): UseOptimizedDocumentsReturn => {
  const { initialFetch = true, realtime = false, cacheTime = 30000 } = options;
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const refresh = useCallback(async () => {
    const now = Date.now();
    
    // Check cache validity
    if (cacheTime && (now - lastFetch) < cacheTime && documents.length > 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchDocuments();
      setDocuments(data);
      setLastFetch(now);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
    } finally {
      setLoading(false);
    }
  }, [cacheTime, lastFetch, documents.length]);

  // Initial fetch
  useEffect(() => {
    if (initialFetch) {
      refresh();
    }
  }, [initialFetch, refresh]);

  // Real-time updates
  useEffect(() => {
    if (!realtime) return;

    const channel = supabase
      .channel('documents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        () => {
          refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [realtime, refresh]);

  return {
    documents,
    loading,
    error,
    refresh,
  };
};
