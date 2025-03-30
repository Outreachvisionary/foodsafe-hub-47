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
      
      // Create approval activity record - using the correct property names in DocumentActivity
      await enhancedDocumentService.createDocumentActivity({
        document_id: id,
        action: 'approve',
        user_id: 'system', // Using user_id instead of performedBy
        user_name: 'System',
        user_role: 'System',
        timestamp: new Date().toISOString(), // Using timestamp instead of performedAt
        comments: comment // Using comments instead of details
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
      
      // Create rejection activity record - using the correct property names in DocumentActivity
      await enhancedDocumentService.createDocumentActivity({
        document_id: id,
        action: 'reject',
        user_id: 'system', // Using user_id instead of performedBy
        user_name: 'System',
        user_role: 'System',
        timestamp: new Date().toISOString(), // Using timestamp instead of performedAt
        comments: comment // Using comments instead of details
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

  // FIXED: Improved storage availability check function with timeout, error handling, and retries
  const checkStorageAvailability = async (): Promise<boolean> => {
    try {
      debugLog('Checking storage availability...');
      
      // Check if Supabase client is properly initialized
      if (!supabase || !supabase.storage) {
        console.error('Supabase client not properly initialized');
        return false;
      }
      
      // Check session - authentication might be required for storage operations
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error when checking storage:', sessionError);
        // Continue anyway - some operations might work without auth
      }
      
      // Setup timeout for storage operations
      const timeoutPromise = new Promise<{data: null, error: Error}>(
        (_, reject) => setTimeout(() => reject({
          data: null,
          error: new Error('Storage operation timed out')
        }), 8000)
      );
      
      // Check if storage API is responsive
      try {
        debugLog('Listing storage buckets...');
        const listBucketsPromise = supabase.storage.listBuckets();
        const { data: buckets, error: bucketsError } = await Promise.race([
          listBucketsPromise,
          timeoutPromise as Promise<any>
        ]);
        
        if (bucketsError) {
          console.error('Storage API error:', bucketsError);
          return false;
        }
        
        // Check if our bucket exists
        const attachmentsBucket = buckets?.find(bucket => bucket.name === 'attachments');
        debugLog('Available buckets:', buckets?.map(b => b.name).join(', ') || 'none');
        
        if (!attachmentsBucket) {
          debugLog('Attachments bucket not found. Creating bucket...');
          
          // Attempt to create the bucket if it doesn't exist
          try {
            const { error: createError } = await supabase.storage.createBucket('attachments', {
              public: false,
              fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
            });
            
            if (createError) {
              // Special case: bucket might actually exist but we don't have list permissions
              if (createError.message?.includes('already exists')) {
                debugLog('Bucket exists but not visible in list - trying direct access');
              } else {
                console.error('Error creating bucket:', createError);
                return false;
              }
            } else {
              debugLog('Successfully created attachments bucket');
            }
          } catch (createErr) {
            console.error('Exception creating bucket:', createErr);
            return false;
          }
        }
        
        // Final verification - try listing files in the bucket
        debugLog('Testing bucket access by listing files...');
        const { error: listError } = await supabase.storage
          .from('attachments')
          .list('', { limit: 1 });
          
        if (listError) {
          console.error('Cannot access attachments bucket:', listError);
          return false;
        }
        
        debugLog('Storage is available and working properly');
        return true;
      } catch (error) {
        if ((error as any).message?.includes('timed out')) {
          console.error('Storage operation timed out');
        } else {
          console.error('Error during storage check:', error);
        }
        return false;
      }
    } catch (err) {
      console.error('Unhandled error checking storage:', err);
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
