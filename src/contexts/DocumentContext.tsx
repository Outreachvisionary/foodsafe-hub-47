
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Document } from '@/types/document';
import { fetchDocuments, fetchActiveDocuments, createDocument, updateDocument, deleteDocument } from '@/services/documentService';
import { useToast } from '@/hooks/use-toast';

interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  fetchActive: () => Promise<void>;
  refreshDocuments: () => Promise<void>;
  createDocument: (document: Omit<Document, 'id' | 'created_at' | 'updated_at'>) => Promise<Document>;
  approveDocument: (id: string) => Promise<void>;
  rejectDocument: (id: string, reason: string) => Promise<void>;
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

  const refreshDocuments = refresh;

  const handleCreateDocument = async (document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document> => {
    try {
      const newDocument = await createDocument(document);
      await refresh();
      toast({
        title: 'Success',
        description: 'Document created successfully',
      });
      return newDocument;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create document';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const approveDocument = async (id: string) => {
    try {
      await updateDocument(id, { status: 'Approved' as any });
      await refresh();
      toast({
        title: 'Success',
        description: 'Document approved successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve document';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const rejectDocument = async (id: string, reason: string) => {
    try {
      await updateDocument(id, { 
        status: 'Rejected' as any, 
        rejection_reason: reason 
      });
      await refresh();
      toast({
        title: 'Success',
        description: 'Document rejected',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject document';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
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
    refreshDocuments,
    createDocument: handleCreateDocument,
    approveDocument,
    rejectDocument,
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

export const useDocumentContext = useDocument;
