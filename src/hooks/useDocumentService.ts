
import { useState } from 'react';
import { Document, DocumentVersion } from '@/types/document';
import documentService from '@/services/documentService';
import enhancedDocumentService from '@/services/enhancedDocumentService';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

// Debug flag - turn on for more verbose logging
const DEBUG_MODE = true;

export function useDocumentService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const debugLog = (...args: any[]) => {
    if (DEBUG_MODE) {
      console.log('[DocumentService Debug]', ...args);
    }
  };

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      debugLog('Fetching documents...');
      const documents = await enhancedDocumentService.fetchDocuments();
      debugLog('Documents fetched:', documents);
      return documents;
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err as Error);
      toast({
        title: 'Error fetching documents',
        description: (err as Error).message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createDocument = async (document: Omit<Document, 'id'>) => {
    try {
      setIsLoading(true);
      setError(null);
      debugLog('Creating document:', document);
      const result = await enhancedDocumentService.createDocument(document);
      debugLog('Document created:', result);
      toast({
        title: 'Document created',
        description: 'The document has been created successfully'
      });
      return result;
    } catch (err) {
      console.error('Error creating document:', err);
      setError(err as Error);
      toast({
        title: 'Error creating document',
        description: (err as Error).message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDocument = async (id: string, document: Partial<Document>) => {
    try {
      setIsLoading(true);
      setError(null);
      debugLog('Updating document:', id, document);
      const result = await enhancedDocumentService.updateDocument(id, document);
      debugLog('Document updated:', result);
      toast({
        title: 'Document updated',
        description: 'The document has been updated successfully'
      });
      return result;
    } catch (err) {
      console.error('Error updating document:', err);
      setError(err as Error);
      toast({
        title: 'Error updating document',
        description: (err as Error).message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const approveDocument = async (id: string, comment: string) => {
    try {
      setIsLoading(true);
      setError(null);
      debugLog('Approving document:', id, 'Comment:', comment);
      
      const result = await enhancedDocumentService.updateDocument(id, {
        status: 'Approved',
        last_action: 'approved',
        updated_at: new Date().toISOString(),
      });
      
      // Create approval activity record
      await enhancedDocumentService.createDocumentActivity({
        document_id: id,
        action: 'approve',
        performedBy: 'system',
        performedAt: new Date().toISOString(),
        details: comment
      });
      
      debugLog('Document approved:', result);
      return result;
    } catch (err) {
      console.error('Error approving document:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectDocument = async (id: string, comment: string) => {
    if (!comment.trim()) {
      const error = new Error('Rejection reason is required');
      setError(error);
      throw error;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      debugLog('Rejecting document:', id, 'Reason:', comment);
      
      const result = await enhancedDocumentService.updateDocument(id, {
        status: 'Draft',
        last_action: 'rejected',
        rejection_reason: comment,
        updated_at: new Date().toISOString(),
      });
      
      // Create rejection activity record
      await enhancedDocumentService.createDocumentActivity({
        document_id: id,
        action: 'reject',
        performedBy: 'system',
        performedAt: new Date().toISOString(),
        details: comment
      });
      
      debugLog('Document rejected:', result);
      return result;
    } catch (err) {
      console.error('Error rejecting document:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      debugLog('Deleting document:', id);
      await enhancedDocumentService.deleteDocument(id);
      debugLog('Document deleted:', id);
      toast({
        title: 'Document deleted',
        description: 'The document has been deleted successfully'
      });
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err as Error);
      toast({
        title: 'Error deleting document',
        description: (err as Error).message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File, path: string) => {
    try {
      setIsLoading(true);
      setError(null);
      debugLog('Uploading file:', file.name, 'to path:', path);
      await enhancedDocumentService.uploadFile(file, path);
      debugLog('File uploaded successfully');
      return true;
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err as Error);
      toast({
        title: 'Error uploading file',
        description: (err as Error).message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createDocumentVersion = async (versionData: Omit<DocumentVersion, 'id'>) => {
    try {
      setIsLoading(true);
      setError(null);
      debugLog('Creating document version:', versionData);
      const result = await enhancedDocumentService.createDocumentVersion(versionData);
      debugLog('Document version created:', result);
      return result;
    } catch (err) {
      console.error('Error creating document version:', err);
      setError(err as Error);
      toast({
        title: 'Error creating document version',
        description: (err as Error).message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocumentVersions = async (documentId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      debugLog('Fetching document versions for:', documentId);
      const versions = await enhancedDocumentService.fetchDocumentVersions(documentId);
      debugLog('Document versions fetched:', versions);
      return versions;
    } catch (err) {
      console.error('Error fetching document versions:', err);
      setError(err as Error);
      toast({
        title: 'Error fetching document versions',
        description: (err as Error).message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check Supabase storage availability
  const checkStorageAvailability = async () => {
    try {
      debugLog('Checking storage availability...');
      // Try to list buckets first to check if storage is available
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Storage bucket access error:', bucketsError);
        return false;
      }
      
      // If we can list buckets, check if our needed bucket exists
      const attachmentsBucket = buckets?.find(bucket => bucket.name === 'attachments');
      
      if (!attachmentsBucket) {
        console.warn('Attachments bucket not found. Checking if we can create it...');
        try {
          // Try to create the attachments bucket if it doesn't exist
          const { error: createError } = await supabase.storage.createBucket('attachments', {
            public: false,
            fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
          });
          
          if (createError) {
            console.error('Error creating attachments bucket:', createError);
            return false;
          }
          
          debugLog('Created attachments bucket successfully');
          return true;
        } catch (createErr) {
          console.error('Exception creating bucket:', createErr);
          return false;
        }
      }
      
      // Try to list files in the attachments bucket as final test
      const { error: filesError } = await supabase.storage
        .from('attachments')
        .list('', { limit: 1 });
        
      if (filesError) {
        console.error('Error listing files in attachments bucket:', filesError);
        return false;
      }
      
      debugLog('Storage is available and working properly');
      return true;
    } catch (err) {
      console.error('Error checking storage availability:', err);
      return false;
    }
  };

  // Function to check database connection and table access
  const checkDatabaseAvailability = async () => {
    try {
      debugLog('Checking database availability...');
      
      // Check if we can access the documents table
      const { data, error } = await supabase
        .from('documents')
        .select('id')
        .limit(1);
        
      if (error) {
        console.error('Database access error:', error);
        return false;
      }
      
      debugLog('Database connection successful');
      return true;
    } catch (err) {
      console.error('Error checking database availability:', err);
      return false;
    }
  };

  return {
    isLoading,
    error,
    fetchDocuments,
    createDocument,
    updateDocument,
    approveDocument,
    rejectDocument,
    deleteDocument,
    uploadFile,
    createDocumentVersion,
    fetchDocumentVersions,
    checkStorageAvailability,
    checkDatabaseAvailability
  };
}
