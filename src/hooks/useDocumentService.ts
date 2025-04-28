
import { useState, useCallback } from 'react';
import { Document, DocumentVersion, DocumentStatus, CheckoutStatus } from '@/types/document';
import { convertToDocumentStatus, convertToCheckoutStatus } from '@/utils/typeAdapters';

// Mock data for document service functions
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Quality Manual',
    description: 'Main quality management system documentation',
    status: 'Published',
    category: 'Policy',
    version: 2,
    file_name: 'quality_manual_v2.pdf',
    file_size: 1024 * 1024,
    file_type: 'application/pdf',
    created_at: new Date().toISOString(),
    created_by: 'John Doe',
    checkout_status: 'Available'
  },
  {
    id: '2',
    title: 'Sanitation SOP',
    description: 'Standard operating procedure for sanitation',
    status: 'Draft',
    category: 'SOP',
    version: 1,
    file_name: 'sanitation_sop.docx',
    file_size: 512 * 1024,
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    created_at: new Date().toISOString(),
    created_by: 'Maria Garcia',
    checkout_status: 'Available'
  }
];

const adaptDatabaseToDocument = (dbDocument: any): Document => {
  return {
    ...dbDocument,
    status: convertToDocumentStatus(dbDocument.status),
    checkout_status: convertToCheckoutStatus(dbDocument.checkout_status || 'Available'),
  } as Document;
};

const useDocumentService = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async (filter?: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const filteredDocs = [...mockDocuments];
      
      if (filter) {
        // Apply filtering logic here
        console.log('Filtering documents with:', filter);
      }

      setDocuments(filteredDocs);
      return filteredDocs;
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Failed to fetch documents');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocumentById = useCallback(async (id: string): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const document = mockDocuments.find(doc => doc.id === id);
      
      if (!document) {
        return null;
      }

      return document;
    } catch (err: any) {
      console.error('Error fetching document by ID:', err);
      setError(err.message || 'Failed to fetch document');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDocument = useCallback(async (newDocument: Partial<Document>): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const documentData = {
        id: `doc-${Date.now()}`,
        status: newDocument.status || 'Draft',
        checkout_status: newDocument.checkout_status || 'Available',
        version: 1,
        created_at: new Date().toISOString(),
        ...newDocument,
        category: newDocument.category || 'Other'
      } as Document;

      // Add to mock documents array
      const createdDocument = adaptDatabaseToDocument(documentData);
      setDocuments(prevDocuments => [createdDocument, ...prevDocuments]);
      return createdDocument;
    } catch (err: any) {
      console.error('Error creating document:', err);
      setError(err.message || 'Failed to create document');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDocument = useCallback(async (id: string, updates: Partial<Document>): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find document index
      const documentIndex = mockDocuments.findIndex(doc => doc.id === id);
      
      if (documentIndex === -1) {
        throw new Error('Document not found');
      }

      // Update document
      const updatedDocument = {
        ...mockDocuments[documentIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Update the mock array
      mockDocuments[documentIndex] = updatedDocument;
      setDocuments([...mockDocuments]);
      
      return adaptDatabaseToDocument(updatedDocument);
    } catch (err: any) {
      console.error('Error updating document:', err);
      setError(err.message || 'Failed to update document');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkoutDocument = useCallback(async (id: string, userId: string, userName: string): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const documentIndex = mockDocuments.findIndex(doc => doc.id === id);
      
      if (documentIndex === -1) {
        throw new Error('Document not found');
      }

      // Check if document is already checked out
      if (mockDocuments[documentIndex].checkout_status === 'Checked Out') {
        throw new Error('Document is already checked out');
      }

      // Update document checkout status
      const updatedDocument = {
        ...mockDocuments[documentIndex],
        checkout_status: 'Checked Out',
        checkout_user_id: userId,
        checkout_user_name: userName,
        checkout_timestamp: new Date().toISOString()
      };

      mockDocuments[documentIndex] = updatedDocument;
      setDocuments([...mockDocuments]);
      
      return adaptDatabaseToDocument(updatedDocument);
    } catch (err: any) {
      console.error('Error checking out document:', err);
      setError(err.message || 'Failed to check out document');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkinDocument = useCallback(async (
    id: string, 
    userId: string, 
    versionData: {
      file_name: string;
      file_size: number;
      check_in_comment: string;
      version_type: string;
    }
  ): Promise<DocumentVersion | null> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const documentIndex = mockDocuments.findIndex(doc => doc.id === id);
      
      if (documentIndex === -1) {
        throw new Error('Document not found');
      }

      const doc = mockDocuments[documentIndex];
      
      // Create a new version
      const newVersion: DocumentVersion = {
        id: `ver-${Date.now()}`,
        document_id: id,
        version: doc.version + 1,
        file_name: versionData.file_name,
        file_size: versionData.file_size,
        created_at: new Date().toISOString(),
        created_by: userId,
        check_in_comment: versionData.check_in_comment,
        version_type: versionData.version_type
      };

      // Update the document
      const updatedDocument = {
        ...doc,
        checkout_status: 'Available',
        checkout_user_id: null,
        checkout_user_name: null,
        checkout_timestamp: null,
        version: doc.version + 1,
        current_version_id: newVersion.id,
        file_name: versionData.file_name
      };

      mockDocuments[documentIndex] = updatedDocument;
      setDocuments([...mockDocuments]);
      
      return newVersion;
    } catch (err: any) {
      console.error('Error checking in document:', err);
      setError(err.message || 'Failed to check in document');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocumentVersions = useCallback(async (documentId: string): Promise<DocumentVersion[]> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock versions
      const mockVersions: DocumentVersion[] = [
        {
          id: 'ver-1',
          document_id: documentId,
          version: 3,
          file_name: 'document_v3.pdf',
          file_size: 1024 * 1024,
          created_at: new Date().toISOString(),
          created_by: 'John Doe',
          check_in_comment: 'Updated formatting and fixed typos',
          version_type: 'minor'
        },
        {
          id: 'ver-2',
          document_id: documentId,
          version: 2,
          file_name: 'document_v2.pdf',
          file_size: 980 * 1024,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: 'Jane Smith',
          check_in_comment: 'Updated content in section 3',
          version_type: 'major'
        },
        {
          id: 'ver-3',
          document_id: documentId,
          version: 1,
          file_name: 'document_v1.pdf',
          file_size: 950 * 1024,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: 'John Doe',
          check_in_comment: 'Initial version',
          version_type: 'major'
        }
      ];

      return mockVersions;
    } catch (err: any) {
      console.error('Error fetching document versions:', err);
      setError(err.message || 'Failed to fetch document versions');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocumentComments = useCallback(async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock comments
      const mockComments = [
        {
          id: 'comment-1',
          document_id: documentId,
          content: 'Please review section 3.2, I think we need to clarify the procedure.',
          created_at: new Date().toISOString(),
          user_id: 'user-1',
          user_name: 'John Doe'
        },
        {
          id: 'comment-2',
          document_id: documentId,
          content: 'I agree, also check if we need to reference the new regulatory requirements.',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          user_id: 'user-2',
          user_name: 'Jane Smith'
        }
      ];

      return mockComments;
    } catch (err: any) {
      console.error('Error fetching document comments:', err);
      setError(err.message || 'Failed to fetch document comments');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createDocumentComment = useCallback(async (commentData: any) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const newComment = {
        id: `comment-${Date.now()}`,
        ...commentData,
        created_at: new Date().toISOString()
      };

      return newComment;
    } catch (err: any) {
      console.error('Error creating document comment:', err);
      setError(err.message || 'Failed to create comment');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreVersion = useCallback(async (documentId: string, versionId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log(`Restoring document ${documentId} to version ${versionId}`);
      
      // Return success
      return true;
    } catch (err: any) {
      console.error('Error restoring document version:', err);
      setError(err.message || 'Failed to restore version');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadVersion = useCallback(async (versionId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log(`Downloading version ${versionId}`);
      
      // Return success
      return true;
    } catch (err: any) {
      console.error('Error downloading document version:', err);
      setError(err.message || 'Failed to download version');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    fetchDocumentById,
    createDocument,
    updateDocument,
    checkoutDocument,
    checkinDocument,
    getDocumentVersions,
    getDocumentComments,
    createDocumentComment,
    restoreVersion,
    downloadVersion
  };
};

export default useDocumentService;
