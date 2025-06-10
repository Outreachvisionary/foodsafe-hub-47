
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Document } from '@/types/document';
import { fetchDocuments, fetchActiveDocuments } from '@/services/documentService';
import { useToast } from '@/hooks/use-toast';

interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  fetchActive: () => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load documents';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchActive = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchActiveDocuments();
      setDocuments(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load active documents';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const value: DocumentContextType = {
    documents,
    loading,
    error,
    refresh,
    fetchActive,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
