
import React, { createContext, useState, useContext, useCallback } from 'react';
import * as documentService from '@/services/documentService';
import { Document, DocumentCategory, DocumentStatus } from '@/types/document';

// Add type adapter functions at the top of the file
const adaptDocumentToDatabase = (doc: any) => {
  // Handle category conversion from string to DocumentCategory
  return {
    ...doc,
    category: doc.category as DocumentCategory // Force conversion
  };
};

interface DocumentContextProps {
  documents: Document[];
  folders: any[]; // Add folders property
  loading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  fetchDocument: (id: string) => Promise<Document | undefined>;
  createDocument: (document: Document) => Promise<Document>;
  updateDocument: (document: Document) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
  approveDocument: (id: string) => Promise<void>;
  rejectDocument: (id: string, reason: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
  restoreVersion: (documentId: string, versionId: string) => Promise<void>;
  downloadVersion: (documentId: string, versionId: string) => Promise<void>;
}

const DocumentContext = createContext<DocumentContextProps | undefined>(undefined);

interface DocumentProviderProps {
  children: React.ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the mock data service for now
      const fetchedDocuments = await documentService.default.fetchDocuments();
      setDocuments(fetchedDocuments);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocument = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const document = await documentService.default.fetchDocument(id);
      if (!document) {
        setError('Document not found');
        return undefined;
      }
      const adaptedDoc = adaptDocumentToDatabase(document);
      return documentService.default.fetchDocument(adaptedDoc.id);
    } catch (err) {
      setError((err as Error).message);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (document: Document) => {
    setLoading(true);
    setError(null);
    try {
      const adaptedDoc = adaptDocumentToDatabase(document);
      const newDocument = await documentService.default.createDocument(adaptedDoc);
      setDocuments(prevDocuments => [...prevDocuments, newDocument]);
      return newDocument;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (document: Document) => {
    setLoading(true);
    setError(null);
    try {
      const adaptedDoc = adaptDocumentToDatabase(document);
      const updatedDocument = await documentService.default.updateDocument(adaptedDoc);
      setDocuments(prevDocuments =>
        prevDocuments.map(doc => (doc.id === updatedDocument.id ? updatedDocument : doc))
      );
      return updatedDocument;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await documentService.default.deleteDocument(id);
      setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const approveDocument = async (id: string) => {
    try {
      // Implementation would go here
      console.log(`Approving document with ID: ${id}`);
    } catch (error) {
      console.error("Error approving document:", error);
      throw error;
    }
  };

  const rejectDocument = async (id: string, reason: string) => {
    try {
      // Implementation would go here
      console.log(`Rejecting document with ID: ${id}, Reason: ${reason}`);
    } catch (error) {
      console.error("Error rejecting document:", error);
      throw error;
    }
  };

  const refreshDocuments = async () => {
    try {
      // Implementation would go here
      await fetchDocuments();
      console.log("Refreshing documents");
    } catch (error) {
      console.error("Error refreshing documents:", error);
      throw error;
    }
  };

  // Add missing methods
  const restoreVersion = async (documentId: string, versionId: string) => {
    try {
      // Implementation would go here
      console.log(`Restoring document ${documentId} to version ${versionId}`);
    } catch (error) {
      console.error("Error restoring version:", error);
      throw error;
    }
  };

  const downloadVersion = async (documentId: string, versionId: string) => {
    try {
      // Implementation would go here
      console.log(`Downloading document version ${versionId} for document ${documentId}`);
    } catch (error) {
      console.error("Error downloading version:", error);
      throw error;
    }
  };

  const value: DocumentContextProps = {
    documents,
    folders,
    loading,
    error,
    fetchDocuments,
    fetchDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    approveDocument,
    rejectDocument,
    refreshDocuments,
    restoreVersion,
    downloadVersion,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

// Add an alias for backward compatibility
export { useDocument as useDocuments };
