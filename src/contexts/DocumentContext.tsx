
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Document } from '@/types/document';
import useDocumentService from '@/hooks/useDocumentService';

interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  error: string | null;
  fetchDocuments: (filter?: any) => Promise<void>;
  fetchDocumentById: (id: string) => Promise<Document | null>;
  createDocument: (newDocument: Partial<Document>) => Promise<Document | null>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<Document | null>;
  deleteDocument: (id: string) => Promise<void>;
  checkOutDocument: (id: string, userId: string, userName: string, userRole: string) => Promise<void>;
  checkInDocument: (id: string, userId: string, comments?: string) => Promise<void>;
  getDocumentVersions: (documentId: string) => Promise<any[]>;
  getDocumentActivities: (documentId: string) => Promise<any[]>;
  uploadFile: (file: File, path: string) => Promise<string | null>;
  deleteFile: (filePath: string) => Promise<void>;
  getDocumentComments: (documentId: string) => Promise<any[]>;
  createDocumentComment: (comment: any) => Promise<any>;
  fetchAccess: (documentId: string) => Promise<any[]>;
  grantAccess: (documentId: string, userId: string, permissionLevel: string, grantedBy: string) => Promise<any>;
  revokeAccess: (accessId: string) => Promise<void>;
  restoreVersion: (documentId: string, versionId: string) => Promise<void>;
  downloadVersion: (versionId: string) => Promise<void>;
  approveDocument: (documentId: string, comment: string) => Promise<void>;
  rejectDocument: (documentId: string, reason: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const documentService = useDocumentService();
  const {
    documents,
    loading,
    error,
    fetchDocuments,
    fetchDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    checkOutDocument,
    checkInDocument,
    getDocumentVersions,
    getDocumentActivities,
    uploadFile,
    deleteFile,
    getDocumentComments,
    createDocumentComment,
    fetchAccess,
    grantAccess,
    revokeAccess,
    restoreVersion,
    downloadVersion,
    approveDocument,
    rejectDocument
  } = documentService;

  // Add refreshDocuments method
  const refreshDocuments = async () => {
    await fetchDocuments();
  };

  return (
    <DocumentContext.Provider value={{
      documents,
      loading,
      error,
      fetchDocuments,
      fetchDocumentById,
      createDocument,
      updateDocument,
      deleteDocument,
      checkOutDocument,
      checkInDocument,
      getDocumentVersions,
      getDocumentActivities,
      uploadFile,
      deleteFile,
      getDocumentComments,
      createDocumentComment,
      fetchAccess,
      grantAccess,
      revokeAccess,
      restoreVersion,
      downloadVersion,
      approveDocument,
      rejectDocument,
      refreshDocuments
    }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocument(): DocumentContextType {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }
  return context;
}
