import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import documentService from '@/services/documentService';
import documentCommentService from '@/services/documentCommentService';
import enhancedDocumentService from '@/services/enhancedDocumentService';
import { Document, DocumentVersion, DocumentActivity, DocumentAccess } from '@/types/document';
import { DocumentComment } from '@/types/database';
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

  const getStoragePath = useCallback((documentId: string, fileName: string) => {
    return `documents/${documentId}/${fileName}`;
  }, []);

  const getDownloadUrl = useCallback(async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('attachments')
        .createSignedUrl(path, 3600);

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

  const getPreviewUrl = useCallback(async (documentId: string, fileName: string, fileType: string) => {
    try {
      const storagePath = getStoragePath(documentId, fileName);
      const url = await getDownloadUrl(storagePath);
      
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

  const checkoutDocument = useCallback(async (documentId: string, userId: string) => {
    setIsLoading(true);
    try {
      const document = await documentService.checkoutDocument(documentId);
      return document;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkinDocument = useCallback(async (documentId: string, userId: string, comment: string) => {
    setIsLoading(true);
    try {
      const document = await documentService.checkinDocument(documentId, comment);
      return document;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAccess = useCallback(async (documentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const accessList = await enhancedDocumentService.fetchAccess(documentId);
      return accessList;
    } catch (err: any) {
      setError(err.message || `Failed to fetch access for document ${documentId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const grantAccess = useCallback(async (documentId: string, userId: string, permissionLevel: string, grantedBy: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newAccess = await enhancedDocumentService.grantAccess(documentId, userId, permissionLevel, grantedBy);
      return newAccess;
    } catch (err: any) {
      setError(err.message || `Failed to grant access for document ${documentId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const revokeAccess = useCallback(async (accessId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await enhancedDocumentService.revokeAccess(accessId);
    } catch (err: any) {
      setError(err.message || `Failed to revoke access ${accessId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDocumentComments = useCallback(async (documentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const comments = await documentCommentService.getDocumentComments(documentId);
      return comments;
    } catch (err: any) {
      setError(err.message || `Failed to get comments for document ${documentId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDocumentComment = useCallback(async (comment: Partial<DocumentComment>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newComment = await documentCommentService.createDocumentComment(comment);
      return newComment;
    } catch (err: any) {
      setError(err.message || 'Failed to create document comment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateDocumentComment = useCallback(async (commentId: string, updates: Partial<DocumentComment>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedComment = await documentCommentService.updateDocumentComment(commentId, updates);
      return updatedComment;
    } catch (err: any) {
      setError(err.message || `Failed to update comment ${commentId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteDocumentComment = useCallback(async (commentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await documentCommentService.deleteDocumentComment(commentId);
    } catch (err: any) {
      setError(err.message || `Failed to delete comment ${commentId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDocumentVersions = useCallback(async (documentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const versions = await enhancedDocumentService.fetchDocumentVersions(documentId);
      return versions;
    } catch (err: any) {
      setError(err.message || `Failed to fetch versions for document ${documentId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkStorageAvailability = useCallback(async () => {
    try {
      const { data, error } = await supabase.storage.getBucket('attachments');
      if (error) throw error;
      return !!data;
    } catch (err: any) {
      setError(err.message || 'Failed to check storage availability');
      return false;
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
    checkinDocument,
    fetchAccess,
    grantAccess,
    revokeAccess,
    getDocumentComments,
    createDocumentComment,
    updateDocumentComment,
    deleteDocumentComment,
    fetchDocumentVersions,
    checkStorageAvailability
  };
};
