
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Document } from '@/types/document';
import { fetchDocuments, createDocument as createDocumentService } from '@/services/documentService';

interface DocumentContextType {
  selectedDocument: Document | null;
  setSelectedDocument: (document: Document | null) => void;
  isDocumentPanelOpen: boolean;
  setIsDocumentPanelOpen: (open: boolean) => void;
  refreshDocuments: () => void;
  documents: Document[];
  loading: boolean;
  error: string | null;
  createDocument?: (document: any) => Promise<void>;
  fetchDocuments?: () => Promise<void>;
  approveDocument?: (id: string) => Promise<void>;
  rejectDocument?: (id: string) => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};

// Named export for compatibility
export const useDocument = useDocumentContext;

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isDocumentPanelOpen, setIsDocumentPanelOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshDocuments = () => {
    loadDocuments();
  };

  const createDocument = async (document: any) => {
    try {
      setError(null);
      await createDocumentService(document);
      await loadDocuments(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create document');
      throw err;
    }
  };

  const fetchDocumentsMethod = async () => {
    await loadDocuments();
  };

  const approveDocument = async (id: string) => {
    try {
      setError(null);
      // Implementation would go here when available
      console.log('Approving document:', id);
      await loadDocuments(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve document');
      throw err;
    }
  };

  const rejectDocument = async (id: string) => {
    try {
      setError(null);
      // Implementation would go here when available
      console.log('Rejecting document:', id);
      await loadDocuments(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject document');
      throw err;
    }
  };

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const value: DocumentContextType = {
    selectedDocument,
    setSelectedDocument,
    isDocumentPanelOpen,
    setIsDocumentPanelOpen,
    refreshDocuments,
    documents,
    loading,
    error,
    createDocument,
    fetchDocuments: fetchDocumentsMethod,
    approveDocument,
    rejectDocument
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentContext;
