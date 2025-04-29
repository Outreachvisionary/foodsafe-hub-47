
import React, { createContext, useContext, useState } from 'react';
import { Document } from '@/types/document';
import { DocumentStatus } from '@/types/enums';

interface DocumentContextType {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  loading?: boolean;
  error?: string | null;
  refreshDocuments?: () => Promise<void>;
  approveDocument?: (documentId: string, comment?: string) => Promise<void>;
  rejectDocument?: (documentId: string, reason: string) => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshDocuments = async (): Promise<void> => {
    setLoading(true);
    try {
      // Mock implementation - would fetch from API in real app
      setLoading(false);
    } catch (err) {
      setError("Failed to refresh documents");
      setLoading(false);
    }
  };

  const approveDocument = async (documentId: string, comment?: string): Promise<void> => {
    // Mock implementation
    console.log(`Approving document ${documentId} with comment: ${comment}`);
  };

  const rejectDocument = async (documentId: string, reason: string): Promise<void> => {
    // Mock implementation
    console.log(`Rejecting document ${documentId} with reason: ${reason}`);
  };

  const value: DocumentContextType = {
    documents,
    setDocuments,
    loading,
    error,
    refreshDocuments,
    approveDocument,
    rejectDocument
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }
  return context;
};
