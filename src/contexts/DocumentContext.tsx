import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Document, DocumentVersion, DocumentComment } from '@/types/document';
import { useToast } from '@/components/ui/use-toast';

interface DocumentContextType {
  documents: Document[];
  currentDocument: Document | null;
  versions: DocumentVersion[];
  comments: DocumentComment[];
  loading: {
    documents: boolean;
    document: boolean;
    versions: boolean;
    comments: boolean;
  };
  error: string | null;
  fetchDocuments: () => Promise<void>;
  fetchDocument: (id: string) => Promise<void>;
  fetchVersions: (documentId: string) => Promise<void>;
  fetchComments: (documentId: string) => Promise<void>;
  addComment: (documentId: string, content: string) => Promise<void>;
  approveDocument: (documentId: string, comment: string) => Promise<void>;
  rejectDocument: (documentId: string, reason: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
  createDocument: (documentData: Partial<Document>) => Promise<Document | null>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [loading, setLoading] = useState({
    documents: false,
    document: false,
    versions: false,
    comments: false,
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, documents: true }));
      setError(null);
      
      // Mock API call for now
      const response = await fetch('/api/documents');
      if (!response.ok) throw new Error('Failed to fetch documents');
      
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError('Error loading documents');
      console.error('Error fetching documents:', err);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setLoading((prev) => ({ ...prev, documents: false }));
    }
  }, [toast]);

  const fetchDocument = useCallback(async (id: string) => {
    try {
      setLoading((prev) => ({ ...prev, document: true }));
      setError(null);
      
      // Mock API call for now
      const response = await fetch(`/api/documents/${id}`);
      if (!response.ok) throw new Error('Failed to fetch document');
      
      const data = await response.json();
      setCurrentDocument(data);
    } catch (err) {
      setError('Error loading document');
      console.error('Error fetching document:', err);
      toast({
        title: 'Error',
        description: 'Failed to load document',
        variant: 'destructive',
      });
    } finally {
      setLoading((prev) => ({ ...prev, document: false }));
    }
  }, [toast]);

  const fetchVersions = useCallback(async (documentId: string) => {
    try {
      setLoading((prev) => ({ ...prev, versions: true }));
      setError(null);
      
      // Mock API call for now
      const response = await fetch(`/api/documents/${documentId}/versions`);
      if (!response.ok) throw new Error('Failed to fetch versions');
      
      const data = await response.json();
      setVersions(data);
    } catch (err) {
      setError('Error loading document versions');
      console.error('Error fetching versions:', err);
      toast({
        title: 'Error',
        description: 'Failed to load document versions',
        variant: 'destructive',
      });
    } finally {
      setLoading((prev) => ({ ...prev, versions: false }));
    }
  }, [toast]);

  const fetchComments = useCallback(async (documentId: string) => {
    try {
      setLoading((prev) => ({ ...prev, comments: true }));
      setError(null);
      
      // Mock API call for now
      const response = await fetch(`/api/documents/${documentId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError('Error loading comments');
      console.error('Error fetching comments:', err);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setLoading((prev) => ({ ...prev, comments: false }));
    }
  }, [toast]);

  const addComment = useCallback(async (documentId: string, content: string) => {
    try {
      setLoading((prev) => ({ ...prev, comments: true }));
      setError(null);
      
      // Mock API call for now - in a real implementation, this would pass userId and userName
      const response = await fetch(`/api/documents/${documentId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          userId: 'current-user-id',
          userName: 'Current User'
        }),
      });
      
      if (!response.ok) throw new Error('Failed to add comment');
      
      const newComment = await response.json();
      setComments((prev) => [...prev, newComment]);
      
      toast({
        title: 'Comment Added',
        description: 'Your comment has been added successfully',
      });
    } catch (err) {
      setError('Error adding comment');
      console.error('Error adding comment:', err);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    } finally {
      setLoading((prev) => ({ ...prev, comments: false }));
    }
  }, [toast]);

  // Add refreshDocuments method (alias for fetchDocuments for consistency)
  const refreshDocuments = useCallback(async () => {
    return fetchDocuments();
  }, [/* fetchDocuments */]); // Removed dependency to avoid circular reference

  // Add createDocument method
  const createDocument = useCallback(async (documentData: Partial<Document>): Promise<Document | null> => {
    try {
      setLoading((prev) => ({ ...prev, documents: true }));
      setError(null);
      
      // Mock API call for now
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });
      
      if (!response.ok) throw new Error('Failed to create document');
      
      const newDocument = await response.json();
      
      // Update documents state
      setDocuments(prev => [newDocument, ...prev]);
      
      toast({
        title: 'Document Created',
        description: 'Document has been created successfully',
      });
      
      return newDocument;
    } catch (err) {
      setError('Error creating document');
      console.error('Error creating document:', err);
      toast({
        title: 'Error',
        description: 'Failed to create document',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, documents: false }));
    }
  }, [toast]);

  const approveDocument = useCallback(async (documentId: string, comment: string) => {
    try {
      // Implementation for approving a document
      console.log(`Approving document ${documentId} with comment: ${comment}`);
      toast({
        title: "Document Approved",
        description: "The document has been approved successfully"
      });
    } catch (err) {
      console.error('Error approving document:', err);
      setError('Failed to approve document');
      toast({
        title: "Error",
        description: "Failed to approve the document",
        variant: "destructive"
      });
    }
  }, [toast]);

  const rejectDocument = useCallback(async (documentId: string, reason: string) => {
    try {
      // Implementation for rejecting a document
      console.log(`Rejecting document ${documentId} with reason: ${reason}`);
      toast({
        title: "Document Rejected",
        description: "The document has been rejected"
      });
    } catch (err) {
      console.error('Error rejecting document:', err);
      setError('Failed to reject document');
      toast({
        title: "Error",
        description: "Failed to reject the document",
        variant: "destructive"
      });
    }
  }, [toast]);

  const value = {
    documents,
    currentDocument,
    versions,
    comments,
    loading,
    error,
    fetchDocuments,
    fetchDocument,
    fetchVersions,
    fetchComments,
    addComment,
    approveDocument,
    rejectDocument,
    refreshDocuments,
    createDocument,
  };

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};

// Export the hook for using the document context
export const useDocument = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

// Export for backward compatibility
export const useDocumentContext = useDocument;
