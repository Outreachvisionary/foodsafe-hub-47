
import { useState } from 'react';
import { Document, DocumentStatus } from '@/types/document';
import { fetchDocuments as fetchDocumentsService } from '@/services/documentService';

export default function useDocumentService() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch documents with optional filter
  const fetchDocuments = async (filter?: any) => {
    try {
      setLoading(true);
      setError(null);
      const docs = await fetchDocumentsService();
      setDocuments(docs);
      return docs;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single document by ID
  const fetchDocumentById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const doc = documents.find(d => d.id === id) || {
        id,
        title: 'Sample Document',
        description: 'This is a sample document',
        file_name: 'sample.pdf',
        file_type: 'application/pdf',
        file_size: 1024,
        category: 'SOP',
        status: 'Active' as DocumentStatus,
        version: 1,
        created_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        checkout_status: 'Available'
      };
      return doc;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Create a new document
  const createDocument = async (newDocument: Partial<Document>) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call an API
      const doc: Document = {
        id: Date.now().toString(),
        ...newDocument,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: newDocument.title || 'Untitled Document',
        file_name: newDocument.file_name || 'untitled.pdf',
        file_type: newDocument.file_type || 'application/pdf',
        file_size: newDocument.file_size || 0,
        category: newDocument.category || 'Other',
        status: newDocument.status || 'Draft',
        version: newDocument.version || 1,
        created_by: newDocument.created_by || 'admin',
        checkout_status: newDocument.checkout_status || 'Available'
      } as Document;
      
      setDocuments([...documents, doc]);
      return doc;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing document
  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the document to update
      const docIndex = documents.findIndex(d => d.id === id);
      
      if (docIndex === -1) {
        throw new Error(`Document with ID ${id} not found`);
      }
      
      // Update the document
      const updatedDoc = {
        ...documents[docIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Update the documents array
      const newDocuments = [...documents];
      newDocuments[docIndex] = updatedDoc;
      setDocuments(newDocuments);
      
      return updatedDoc;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a document
  const deleteDocument = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Filter out the document to delete
      const newDocuments = documents.filter(d => d.id !== id);
      setDocuments(newDocuments);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check out a document
  const checkOutDocument = async (id: string, userId: string, userName: string, userRole: string) => {
    try {
      const docIndex = documents.findIndex(d => d.id === id);
      
      if (docIndex === -1) {
        throw new Error(`Document with ID ${id} not found`);
      }
      
      const updatedDoc = {
        ...documents[docIndex],
        checkout_status: 'Checked Out',
        checkout_user_id: userId,
        checkout_user_name: userName,
        checkout_timestamp: new Date().toISOString()
      };
      
      const newDocuments = [...documents];
      newDocuments[docIndex] = updatedDoc;
      setDocuments(newDocuments);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Check in a document
  const checkInDocument = async (id: string, userId: string, comments?: string) => {
    try {
      const docIndex = documents.findIndex(d => d.id === id);
      
      if (docIndex === -1) {
        throw new Error(`Document with ID ${id} not found`);
      }
      
      const updatedDoc = {
        ...documents[docIndex],
        checkout_status: 'Available',
        checkout_user_id: undefined,
        checkout_user_name: undefined,
        checkout_timestamp: undefined,
        updated_at: new Date().toISOString()
      };
      
      const newDocuments = [...documents];
      newDocuments[docIndex] = updatedDoc;
      setDocuments(newDocuments);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Helper functions for document storage paths and URLs
  const getStoragePath = (documentId: string, fileName: string) => {
    return `documents/${documentId}/${fileName}`;
  };

  const getDownloadUrl = async (path: string) => {
    // In a real implementation, this would get a URL from storage
    return `https://example.com/storage/${path}`;
  };

  // Mock document permissions functions
  const fetchAccess = async (documentId: string) => {
    return [
      {
        id: '1',
        document_id: documentId,
        permission_level: 'view',
        user_id: 'user1',
        user_role: 'Quality Specialist',
        granted_by: 'admin',
        granted_at: new Date().toISOString()
      },
      {
        id: '2',
        document_id: documentId,
        permission_level: 'edit',
        user_id: 'user2',
        user_role: 'Quality Manager',
        granted_by: 'admin',
        granted_at: new Date().toISOString()
      }
    ];
  };

  const grantAccess = async (
    documentId: string, 
    userId: string, 
    permissionLevel: string, 
    grantedBy: string
  ) => {
    return {
      id: Date.now().toString(),
      document_id: documentId,
      user_id: userId,
      permission_level: permissionLevel,
      granted_by: grantedBy,
      granted_at: new Date().toISOString()
    };
  };

  const revokeAccess = async (accessId: string) => {
    // In a real implementation, this would call an API
    return;
  };

  // Mock document version functions
  const getDocumentVersions = async (documentId: string) => {
    return [
      {
        id: '1',
        document_id: documentId,
        version: 1,
        file_name: 'document_v1.pdf',
        file_size: 1024,
        created_by: 'John Doe',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        version_type: 'major',
        change_summary: 'Initial version'
      },
      {
        id: '2',
        document_id: documentId,
        version: 2,
        file_name: 'document_v2.pdf',
        file_size: 1048,
        created_by: 'Jane Smith',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        version_type: 'minor',
        change_summary: 'Updated section 3.2'
      }
    ];
  };

  // Mock document activities functions
  const getDocumentActivities = async (documentId: string) => {
    return [
      {
        id: '1',
        document_id: documentId,
        action: 'create',
        user_id: 'user1',
        user_name: 'John Doe',
        user_role: 'Document Admin',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        document_id: documentId,
        action: 'update',
        user_id: 'user2',
        user_name: 'Jane Smith',
        user_role: 'Quality Manager',
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        comments: 'Updated to reflect new regulations'
      }
    ];
  };

  // Mock file operations
  const uploadFile = async (file: File, path: string) => {
    // In a real implementation, this would upload to storage
    return path;
  };

  const deleteFile = async (filePath: string) => {
    // In a real implementation, this would delete from storage
    return;
  };

  // Mock document comments
  const getDocumentComments = async (documentId: string) => {
    return [
      {
        id: '1',
        document_id: documentId,
        user_id: 'user1',
        user_name: 'John Doe',
        content: 'Please review section 2.3',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        document_id: documentId,
        user_id: 'user2',
        user_name: 'Jane Smith',
        content: 'Looks good, approved',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  const createDocumentComment = async (comment: any) => {
    return {
      id: Date.now().toString(),
      ...comment,
      created_at: new Date().toISOString()
    };
  };

  // Version management
  const restoreVersion = async (documentId: string, versionId: string) => {
    // In a real implementation, this would restore a previous version
    return;
  };

  const downloadVersion = async (versionId: string) => {
    // In a real implementation, this would download a specific version
    return;
  };

  // Document approval functions
  const approveDocument = async (documentId: string, comment: string) => {
    const docIndex = documents.findIndex(d => d.id === documentId);
    
    if (docIndex === -1) {
      throw new Error(`Document with ID ${documentId} not found`);
    }
    
    const updatedDoc = {
      ...documents[docIndex],
      status: 'Approved',
      updated_at: new Date().toISOString()
    };
    
    const newDocuments = [...documents];
    newDocuments[docIndex] = updatedDoc;
    setDocuments(newDocuments);
  };

  const rejectDocument = async (documentId: string, reason: string) => {
    const docIndex = documents.findIndex(d => d.id === documentId);
    
    if (docIndex === -1) {
      throw new Error(`Document with ID ${documentId} not found`);
    }
    
    const updatedDoc = {
      ...documents[docIndex],
      status: 'Rejected',
      rejection_reason: reason,
      updated_at: new Date().toISOString()
    };
    
    const newDocuments = [...documents];
    newDocuments[docIndex] = updatedDoc;
    setDocuments(newDocuments);
  };

  return {
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
    getStoragePath,
    getDownloadUrl
  };
}
