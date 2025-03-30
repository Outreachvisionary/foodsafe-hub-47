
import { useState } from 'react';
import { Document, DocumentVersion } from '@/types/document';
import documentService from '@/services/documentService';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useDocumentService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const documents = await documentService.fetchDocuments();
      return documents;
    } catch (err) {
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
      const result = await documentService.createDocument(document);
      toast({
        title: 'Document created',
        description: 'The document has been created successfully'
      });
      return result;
    } catch (err) {
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
      const result = await documentService.updateDocument(id, document);
      toast({
        title: 'Document updated',
        description: 'The document has been updated successfully'
      });
      return result;
    } catch (err) {
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

  const deleteDocument = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await documentService.deleteDocument(id);
      toast({
        title: 'Document deleted',
        description: 'The document has been deleted successfully'
      });
    } catch (err) {
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
      await documentService.uploadFile(file, path);
      return true;
    } catch (err) {
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

  const createDocumentVersion = async (versionData: Partial<DocumentVersion>) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await documentService.createDocumentVersion(versionData);
      return result;
    } catch (err) {
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

  const getDocumentVersions = async (documentId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const versions = await documentService.getDocumentVersions(documentId);
      return versions;
    } catch (err) {
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
      // Try to list the first bucket to check if storage is available
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Storage error:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error checking storage availability:', err);
      return false;
    }
  };

  return {
    isLoading,
    error,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    uploadFile,
    createDocumentVersion,
    getDocumentVersions,
    checkStorageAvailability
  };
}
