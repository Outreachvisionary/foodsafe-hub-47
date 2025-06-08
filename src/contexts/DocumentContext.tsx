
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Document, DocumentFilter } from '@/types/document';
import { DocumentStatus } from '@/types/enums';
import { useDocumentService } from '@/hooks/useDocumentService';

interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  error: string | null;
  fetchDocuments: (filter?: DocumentFilter) => Promise<void>;
  createDocument: (document: Partial<Document>) => Promise<Document | null>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;
  checkoutDocument: (document: Document) => Promise<void>;
  checkinDocument: (document: Document) => Promise<void>;
  approveDocument: (id: string) => Promise<void>;
  rejectDocument: (id: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const documentService = useDocumentService();

  const fetchDocuments = async (filter?: DocumentFilter) => {
    try {
      setLoading(true);
      setError(null);
      const docs = await documentService.getDocuments(filter);
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (document: Partial<Document>): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);
      const newDoc = await documentService.createDocument(document);
      if (newDoc) {
        setDocuments(prev => [newDoc, ...prev]);
      }
      return newDoc;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      // Implement update logic here
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, ...updates } : doc
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update document');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await documentService.deleteDocument(id);
      if (success) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkoutDocument = async (document: Document): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      // Implementation would go here
      console.log('Checking out document:', document.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to checkout document');
    } finally {
      setLoading(false);
    }
  };

  const checkinDocument = async (document: Document): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      // Implementation would go here
      console.log('Checking in document:', document.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to checkin document');
    } finally {
      setLoading(false);
    }
  };

  const approveDocument = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      // Implementation would go here
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, status: DocumentStatus.Approved } : doc
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve document');
    } finally {
      setLoading(false);
    }
  };

  const rejectDocument = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      // Implementation would go here
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, status: DocumentStatus.Rejected } : doc
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject document');
    } finally {
      setLoading(false);
    }
  };

  const refreshDocuments = async (): Promise<void> => {
    await fetchDocuments();
  };

  const value: DocumentContextType = {
    documents,
    loading,
    error,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    checkoutDocument,
    checkinDocument,
    approveDocument,
    rejectDocument,
    refreshDocuments,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};
