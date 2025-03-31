
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import documentService from '@/services/documentService';
import { Document, DocumentVersion, DocumentActivity } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

export const useDocumentService = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const documents = await documentService.fetchDocuments();
      return documents;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch documents');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDocument = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const document = await documentService.fetchDocument(id);
      return document;
    } catch (err: any) {
      setError(err.message || `Failed to fetch document with ID ${id}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDocument = useCallback(async (document: Partial<Document>) => {
    setIsLoading(true);
    setError(null);

    try {
      const newDocument = await documentService.createDocument(document);
      return newDocument;
    } catch (err: any) {
      setError(err.message || 'Failed to create document');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateDocument = useCallback(async (id: string, updates: Partial<Document>) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedDocument = await documentService.updateDocument(id, updates);
      return updatedDocument;
    } catch (err: any) {
      setError(err.message || `Failed to update document with ID ${id}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await documentService.deleteDocument(id);
    } catch (err: any) {
      setError(err.message || `Failed to delete document with ID ${id}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVersions = useCallback(async (documentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const versions = await documentService.fetchDocumentVersions(documentId);
      return versions;
    } catch (err: any) {
      setError(err.message || `Failed to fetch versions for document ${documentId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createVersion = useCallback(async (version: Partial<DocumentVersion>) => {
    setIsLoading(true);
    setError(null);

    try {
      const newVersion = await documentService.createDocumentVersion(version);
      return newVersion;
    } catch (err: any) {
      setError(err.message || 'Failed to create document version');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordActivity = useCallback(async (activity: Partial<DocumentActivity>) => {
    setIsLoading(true);
    setError(null);

    try {
      const newActivity = await documentService.createDocumentActivity(activity);
      return newActivity;
    } catch (err: any) {
      setError(err.message || 'Failed to record document activity');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchActivities = useCallback(async (documentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const activities = await documentService.fetchDocumentActivities(documentId);
      return activities;
    } catch (err: any) {
      setError(err.message || `Failed to fetch activities for document ${documentId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get storage path for a document file
  const getStoragePath = useCallback((documentId: string, fileName: string) => {
    return `documents/${documentId}/${fileName}`;
  }, []);

  // Get download URL for a file in storage
  const getDownloadUrl = useCallback(async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('attachments')
        .createSignedUrl(path, 3600); // URL expires in 1 hour

      if (error) {
        throw error;
      }

      if (!data || !data.signedUrl) {
        throw new Error('Failed to generate download URL');
      }

      return data.signedUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to get download URL');
      throw err;
    }
  }, []);

  // Get file preview URL for specified file types
  const getPreviewUrl = useCallback(async (documentId: string, fileName: string, fileType: string) => {
    try {
      const storagePath = getStoragePath(documentId, fileName);
      const url = await getDownloadUrl(storagePath);
      
      // Check if the file type is supported for preview
      const previewableTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'text/plain',
        'text/html'
      ];
      
      if (previewableTypes.includes(fileType)) {
        return { url, previewable: true };
      } else {
        return { url, previewable: false };
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get preview URL');
      throw err;
    }
  }, [getStoragePath, getDownloadUrl]);

  // Handle document checkout
  const checkoutDocument = useCallback(async (documentId: string, userId: string) => {
    try {
      const updatedDocument = await documentService.updateDocument(documentId, {
        checkout_user_id: userId,
        checkout_timestamp: new Date().toISOString(),
        is_locked: true
      });
      
      await documentService.createDocumentActivity({
        document_id: documentId,
        action: 'checkout',
        user_id: userId,
        user_name: userId, // Should be replaced with actual user name
        user_role: 'User', // Should be replaced with actual user role
        comments: 'Document checked out for editing'
      });
      
      return updatedDocument;
    } catch (err: any) {
      setError(err.message || 'Failed to checkout document');
      throw err;
    }
  }, []);

  // Handle document checkin
  const checkinDocument = useCallback(async (documentId: string, userId: string) => {
    try {
      const updatedDocument = await documentService.updateDocument(documentId, {
        checkout_user_id: null,
        checkout_timestamp: null,
        is_locked: false
      });
      
      await documentService.createDocumentActivity({
        document_id: documentId,
        action: 'checkin',
        user_id: userId,
        user_name: userId, // Should be replaced with actual user name
        user_role: 'User', // Should be replaced with actual user role
        comments: 'Document checked in after editing'
      });
      
      return updatedDocument;
    } catch (err: any) {
      setError(err.message || 'Failed to checkin document');
      throw err;
    }
  }, []);

  return {
    isLoading,
    error,
    fetchDocuments,
    fetchDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    fetchVersions,
    createVersion,
    recordActivity,
    fetchActivities,
    getStoragePath,
    getDownloadUrl,
    getPreviewUrl,
    checkoutDocument,
    checkinDocument
  };
};
