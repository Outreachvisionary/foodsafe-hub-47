
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Document, DocumentFilter } from '@/types/document';
import { 
  fetchDocuments, 
  createDocument as createDocumentService,
  updateDocument as updateDocumentService,
  deleteDocument as deleteDocumentService
} from '@/services/enhancedDocumentService';

interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  error: string | null;
  refreshDocuments: () => Promise<void>;
  createDocument: (document: Partial<Document>) => Promise<Document>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
  filterDocuments: (filter: DocumentFilter) => Document[];
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (document: Partial<Document>): Promise<Document> => {
    try {
      const newDocument = await createDocumentService(document);
      setDocuments(prev => [newDocument, ...prev]);
      return newDocument;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create document';
      setError(errorMessage);
      throw err;
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>): Promise<Document> => {
    try {
      const updatedDocument = await updateDocumentService(id, updates);
      setDocuments(prev => prev.map(doc => doc.id === id ? updatedDocument : doc));
      return updatedDocument;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update document';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteDocument = async (id: string): Promise<void> => {
    try {
      await deleteDocumentService(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      setError(errorMessage);
      throw err;
    }
  };

  const filterDocuments = (filter: DocumentFilter): Document[] => {
    return documents.filter(doc => {
      if (filter.status && !filter.status.includes(doc.status)) return false;
      if (filter.category && !filter.category.includes(doc.category)) return false;
      if (filter.searchTerm && !doc.title.toLowerCase().includes(filter.searchTerm.toLowerCase())) return false;
      if (filter.folder_id && doc.folder_id !== filter.folder_id) return false;
      if (filter.created_by && doc.created_by !== filter.created_by) return false;
      return true;
    });
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  return (
    <DocumentContext.Provider value={{
      documents,
      loading,
      error,
      refreshDocuments,
      createDocument,
      updateDocument,
      deleteDocument,
      filterDocuments
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

export const useDocumentContext = useDocument;
