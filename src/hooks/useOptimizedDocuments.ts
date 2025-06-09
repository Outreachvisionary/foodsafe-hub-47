
import { useState, useEffect, useCallback } from 'react';
import { Document } from '@/types/document';
import { fetchDocuments } from '@/services/documentService';

interface UseOptimizedDocumentsOptions {
  initialFetch?: boolean;
  realtime?: boolean;
  cacheTime?: number;
}

interface UseOptimizedDocumentsReturn {
  documents: Document[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export const useOptimizedDocuments = (
  options: UseOptimizedDocumentsOptions = {}
): UseOptimizedDocumentsReturn => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    loadDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    if (options.initialFetch) {
      loadDocuments();
    }
  }, [options.initialFetch, loadDocuments]);

  return {
    documents,
    loading,
    error,
    refresh
  };
};

export default useOptimizedDocuments;
