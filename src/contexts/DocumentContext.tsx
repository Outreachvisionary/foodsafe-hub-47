
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Document } from '@/types/document';

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

  const refreshDocuments = () => {
    // This function can be implemented to refresh documents
    // For now, it's a placeholder
    console.log('Refreshing documents...');
  };

  const createDocument = async (document: any) => {
    // Placeholder implementation
    console.log('Creating document:', document);
  };

  const fetchDocuments = async () => {
    // Placeholder implementation
    console.log('Fetching documents...');
  };

  const approveDocument = async (id: string) => {
    // Placeholder implementation
    console.log('Approving document:', id);
  };

  const rejectDocument = async (id: string) => {
    // Placeholder implementation
    console.log('Rejecting document:', id);
  };

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
    fetchDocuments,
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
