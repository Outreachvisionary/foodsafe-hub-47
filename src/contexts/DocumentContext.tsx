
import React, { createContext, useContext, useState } from 'react';
import { Document, DocumentAccess } from '@/types/document';
import { DocumentStatus } from '@/types/enums';
import { fetchDocumentAccess, grantDocumentAccess, revokeDocumentAccess } from '@/services/enhancedDocumentService';
import { getDocumentComments, createDocumentComment } from '@/services/documentCommentService';

interface DocumentContextType {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  loading?: boolean;
  error?: string | null;
  refreshDocuments?: () => Promise<void>;
  approveDocument?: (documentId: string, comment?: string) => Promise<void>;
  rejectDocument?: (documentId: string, reason: string) => Promise<void>;
  fetchDocuments?: () => Promise<void>;
  fetchAccess?: (documentId: string) => Promise<DocumentAccess[]>;
  grantAccess?: (documentId: string, userId: string, permissionLevel: string, grantedBy: string) => Promise<DocumentAccess>;
  revokeAccess?: (accessId: string) => Promise<void>;
  getDocumentComments?: (documentId: string) => Promise<any[]>;
  createDocumentComment?: (comment: any) => Promise<any>;
  createDocument?: (documentData: Partial<Document>) => Promise<Document>;
  getDownloadUrl?: (path: string) => Promise<string>;
  getStoragePath?: (documentId: string, fileName: string) => string;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async (): Promise<void> => {
    setLoading(true);
    try {
      // Mock implementation - would fetch from API in real app
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch documents");
      setLoading(false);
    }
  };

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
  
  const createDocument = async (documentData: Partial<Document>): Promise<Document> => {
    // Mock implementation
    console.log(`Creating document with data:`, documentData);
    return {
      id: 'mock-id',
      title: documentData.title || 'Untitled',
      description: documentData.description || '',
      file_name: documentData.file_name || 'document.pdf',
      file_path: documentData.file_path || '',
      file_size: documentData.file_size || 0,
      file_type: documentData.file_type || 'application/pdf',
      category: documentData.category || 'Other',
      status: documentData.status || DocumentStatus.Draft,
      version: documentData.version || 1,
      created_at: new Date().toISOString(),
      created_by: documentData.created_by || 'current-user',
      updated_at: new Date().toISOString(),
      tags: documentData.tags || []
    };
  };

  // Document access control functions
  const fetchAccess = async (documentId: string): Promise<DocumentAccess[]> => {
    try {
      return await fetchDocumentAccess(documentId);
    } catch (err) {
      setError("Failed to fetch document access");
      return [];
    }
  };

  const grantAccess = async (
    documentId: string, 
    userId: string, 
    permissionLevel: string, 
    grantedBy: string
  ): Promise<DocumentAccess> => {
    try {
      return await grantDocumentAccess(documentId, userId, permissionLevel, grantedBy);
    } catch (err) {
      setError("Failed to grant document access");
      throw err;
    }
  };

  const revokeAccess = async (accessId: string): Promise<void> => {
    try {
      await revokeDocumentAccess(accessId);
    } catch (err) {
      setError("Failed to revoke document access");
      throw err;
    }
  };

  // Document comments functions
  const getDocumentComments = async (documentId: string) => {
    try {
      return await getDocumentComments(documentId);
    } catch (err) {
      setError("Failed to get document comments");
      return [];
    }
  };

  const handleCreateDocumentComment = async (comment: any) => {
    try {
      return await createDocumentComment(comment);
    } catch (err) {
      setError("Failed to create document comment");
      throw err;
    }
  };
  
  // Storage functions
  const getDownloadUrl = async (path: string): Promise<string> => {
    // Mock implementation
    console.log(`Getting download URL for path: ${path}`);
    return `https://example.com/files/${path}`;
  };
  
  const getStoragePath = (documentId: string, fileName: string): string => {
    // Mock implementation
    return `documents/${documentId}/${fileName}`;
  };

  const value: DocumentContextType = {
    documents,
    setDocuments,
    loading,
    error,
    refreshDocuments,
    approveDocument,
    rejectDocument,
    fetchDocuments,
    fetchAccess,
    grantAccess,
    revokeAccess,
    getDocumentComments,
    createDocumentComment: handleCreateDocumentComment,
    createDocument,
    getDownloadUrl,
    getStoragePath
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
