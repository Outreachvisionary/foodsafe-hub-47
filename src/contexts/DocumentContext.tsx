
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDocumentService } from '@/hooks/useDocumentService';
import { Document } from '@/types/document';

interface DocumentContextProps {
  documents: Document[];
  loading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  documentService: any; // Add this to match usage in DocumentUploader
  approveDocument?: (id: string) => Promise<void>; // Added for ApprovalWorkflow.tsx
  rejectDocument?: (id: string, reason: string) => Promise<void>; // Added for ApprovalWorkflow.tsx
  refreshDocuments?: () => Promise<void>; // Added for DocumentEditor.tsx
  createDocument?: (document: any) => Promise<Document>; // Added for UploadDocumentDialog.tsx
}

const DocumentContext = createContext<DocumentContextProps>({
  documents: [],
  loading: false,
  error: null,
  fetchDocuments: async () => {},
  documentService: {} // Add default value
});

export const useDocument = () => useContext(DocumentContext);

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get document service
  const documentService = useDocumentService();
  
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Changed from documentService.getDocuments() to fetchDocuments() based on error
      const data = await documentService.fetchDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Add the missing methods
  const approveDocument = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await documentService.approveDocument(id, 'system', 'System approval');
      await fetchDocuments(); // Refresh the documents list
    } catch (err) {
      console.error('Error approving document:', err);
      setError('Failed to approve document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const rejectDocument = async (id: string, reason: string) => {
    try {
      setLoading(true);
      setError(null);
      await documentService.rejectDocument(id, 'system', reason);
      await fetchDocuments(); // Refresh the documents list
    } catch (err) {
      console.error('Error rejecting document:', err);
      setError('Failed to reject document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshDocuments = fetchDocuments; // Alias for fetchDocuments

  const createDocument = async (document: any) => {
    try {
      setLoading(true);
      setError(null);
      const newDoc = await documentService.createDocument(document);
      await fetchDocuments(); // Refresh the documents list
      return newDoc;
    } catch (err) {
      console.error('Error creating document:', err);
      setError('Failed to create document. Please try again.');
      throw err; // Re-throw to handle in the component
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDocuments();
  }, []);
  
  return (
    <DocumentContext.Provider value={{ 
      documents, 
      loading, 
      error, 
      fetchDocuments,
      documentService, // Expose document service
      approveDocument,
      rejectDocument,
      refreshDocuments,
      createDocument
    }}>
      {children}
    </DocumentContext.Provider>
  );
};
