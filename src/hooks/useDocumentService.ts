
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentVersion, DocumentActivity, DocumentAccess, DocumentComment } from '@/types/document';
import { adaptDatabaseToDocument, adaptDocumentToDatabase, convertToCheckoutStatus, isCheckoutStatus } from '@/utils/typeAdapters';

const useDocumentService = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async (filter?: any) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('documents')
        .select('*');

      if (filter) {
        if (filter.status) {
          query = query.eq('status', filter.status);
        }
        if (filter.category) {
          query = query.eq('category', filter.category);
        }
        if (filter.search) {
          query = query.ilike('title', `%${filter.search}%`);
        }
        // Add more filters as needed
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedDocuments = data.map(adaptDatabaseToDocument);
      setDocuments(formattedDocuments);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocumentById = useCallback(async (id: string): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      return adaptDatabaseToDocument(data);
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

      const documentData = adaptDocumentToDatabase(newDocument);

      const { data, error } = await supabase
        .from('documents')
        .insert(documentData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Upload the file if provided
      if (newDocument.file_path) {
        // File upload logic would be here
        console.log('File path provided, would upload file:', newDocument.file_path);
      }

      const createdDocument = adaptDatabaseToDocument(data);
      setDocuments(prev => [createdDocument, ...prev]);
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

      const documentData = adaptDocumentToDatabase(updates);

      const { data, error } = await supabase
        .from('documents')
        .update(documentData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedDocument = adaptDatabaseToDocument(data);
      setDocuments(prev => 
        prev.map(doc => doc.id === id ? updatedDocument : doc)
      );
      return updatedDocument;
    } catch (err: any) {
      console.error('Error updating document:', err);
      setError(err.message || 'Failed to update document');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err: any) {
      console.error('Error deleting document:', err);
      setError(err.message || 'Failed to delete document');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkOutDocument = useCallback(async (id: string, userId: string, userName: string, userRole: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // First check if document is already checked out
      const { data: docData, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Check if document is already checked out
      if (isCheckoutStatus(docData.checkout_status, 'Checked_Out')) {
        throw new Error('Document is already checked out by another user');
      }

      // Update document status to checked out
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          checkout_status: 'Checked_Out',
          checkout_user_id: userId,
          checkout_user_name: userName,
          checkout_timestamp: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      // Record the checkout activity
      await supabase
        .from('document_activities')
        .insert({
          document_id: id,
          action: 'checkout',
          user_id: userId,
          user_name: userName,
          user_role: userRole,
          comments: 'Document checked out for editing',
          checkout_action: 'checkout'
        });

      // Update the state
      setDocuments(prev => 
        prev.map(doc => {
          if (doc.id === id) {
            return {
              ...doc,
              checkout_status: 'Checked_Out',
              checkout_user_id: userId,
              checkout_user_name: userName,
              checkout_timestamp: new Date().toISOString()
            };
          }
          return doc;
        })
      );
    } catch (err: any) {
      console.error('Error checking out document:', err);
      setError(err.message || 'Failed to check out document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkInDocument = useCallback(async (id: string, userId: string, comments?: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // First check if document is checked out
      const { data: docData, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Check if document is checked out and by this user
      if (!isCheckoutStatus(docData.checkout_status, 'Checked_Out')) {
        throw new Error('Document is not checked out');
      }

      if (docData.checkout_user_id !== userId) {
        throw new Error('Document is checked out by another user');
      }

      // Update document version
      const { data: versionData, error: versionError } = await supabase
        .from('document_versions')
        .insert({
          document_id: id,
          file_name: docData.file_name,
          file_size: docData.file_size,
          created_by: userId,
          check_in_comment: comments || '',
          version_type: 'minor'
        })
        .select();

      if (versionError) {
        throw versionError;
      }

      // Update document status to available
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          checkout_status: 'Available',
          checkout_user_id: null,
          checkout_user_name: null,
          checkout_timestamp: null,
          version: docData.version + 1,
          current_version_id: versionData[0].id
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      // Record the checkin activity
      await supabase
        .from('document_activities')
        .insert({
          document_id: id,
          action: 'checkin',
          user_id: userId,
          user_name: docData.checkout_user_name,
          user_role: 'User', // This should come from user context
          comments: comments || 'Document checked in after editing',
          checkout_action: 'checkin',
          version_id: versionData[0].id
        });

      // Update the state
      setDocuments(prev => 
        prev.map(doc => {
          if (doc.id === id) {
            return {
              ...doc,
              checkout_status: 'Available',
              checkout_user_id: undefined,
              checkout_user_name: undefined,
              checkout_timestamp: undefined,
              version: doc.version + 1
            };
          }
          return doc;
        })
      );
    } catch (err: any) {
      console.error('Error checking in document:', err);
      setError(err.message || 'Failed to check in document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStoragePath = (documentId: string, fileName: string): string => {
    return `documents/${documentId}/${fileName}`;
  };

  const getDownloadUrl = async (path: string): Promise<string> => {
    try {
      const { data, error } = await supabase.storage.from('documents').createSignedUrl(path, 3600);
      
      if (error) {
        throw error;
      }
      
      return data.signedUrl;
    } catch (err) {
      console.error('Error getting download URL:', err);
      throw err;
    }
  };

  const uploadFile = useCallback(async (file: File, path: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage.from('documents').upload(path, file);
      
      if (error) {
        throw error;
      }
      
      return data.path;
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.message || 'Failed to upload file');
      return null;
    }
  }, []);

  const deleteFile = useCallback(async (filePath: string): Promise<void> => {
    try {
      const { error } = await supabase.storage.from('documents').remove([filePath]);
      
      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Error deleting file:', err);
      setError(err.message || 'Failed to delete file');
    }
  }, []);

  const getDocumentVersions = useCallback(async (documentId: string): Promise<DocumentVersion[]> => {
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching document versions:', err);
      setError(err.message || 'Failed to fetch document versions');
      return [];
    }
  }, []);

  const getDocumentActivities = useCallback(async (documentId: string): Promise<DocumentActivity[]> => {
    try {
      const { data, error } = await supabase
        .from('document_activities')
        .select('*')
        .eq('document_id', documentId)
        .order('timestamp', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching document activities:', err);
      setError(err.message || 'Failed to fetch document activities');
      return [];
    }
  }, []);

  const getDocumentComments = useCallback(async (documentId: string): Promise<DocumentComment[]> => {
    try {
      const { data, error } = await supabase
        .from('document_comments')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching document comments:', err);
      setError(err.message || 'Failed to fetch document comments');
      return [];
    }
  }, []);

  const createDocumentComment = useCallback(async (commentData: { document_id: string, content: string, user_id: string, user_name: string }): Promise<DocumentComment | null> => {
    try {
      const { data, error } = await supabase
        .from('document_comments')
        .insert({
          document_id: commentData.document_id,
          content: commentData.content,
          user_id: commentData.user_id,
          user_name: commentData.user_name
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error creating comment:', err);
      setError(err.message || 'Failed to create comment');
      return null;
    }
  }, []);

  const fetchAccess = useCallback(async (documentId: string): Promise<DocumentAccess[]> => {
    try {
      const { data, error } = await supabase
        .from('document_access')
        .select('*')
        .eq('document_id', documentId);
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching document access:', err);
      setError(err.message || 'Failed to fetch document access');
      return [];
    }
  }, []);

  const grantAccess = useCallback(async (documentId: string, userId: string, permissionLevel: string, grantedBy: string): Promise<DocumentAccess | null> => {
    try {
      const { data, error } = await supabase
        .from('document_access')
        .insert({
          document_id: documentId,
          user_id: userId,
          permission_level: permissionLevel,
          granted_by: grantedBy
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error granting access:', err);
      setError(err.message || 'Failed to grant access');
      return null;
    }
  }, []);

  const revokeAccess = useCallback(async (accessId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('document_access')
        .delete()
        .eq('id', accessId);
      
      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Error revoking access:', err);
      setError(err.message || 'Failed to revoke access');
    }
  }, []);

  const restoreVersion = useCallback(async (documentId: string, versionId: string): Promise<void> => {
    try {
      // Get the version information
      const { data: versionData, error: versionError } = await supabase
        .from('document_versions')
        .select('*')
        .eq('id', versionId)
        .single();
      
      if (versionError) {
        throw versionError;
      }
      
      // Update the document with this version's information
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          file_name: versionData.file_name,
          file_size: versionData.file_size,
          current_version_id: versionId
        })
        .eq('id', documentId);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update the state
      await fetchDocuments();
    } catch (err: any) {
      console.error('Error restoring version:', err);
      setError(err.message || 'Failed to restore version');
    }
  }, [fetchDocuments]);

  const downloadVersion = useCallback(async (versionId: string): Promise<void> => {
    try {
      // Implementation depends on how files are stored and retrieved
      console.log('Downloading version:', versionId);
    } catch (err: any) {
      console.error('Error downloading version:', err);
      setError(err.message || 'Failed to download version');
    }
  }, []);

  const approveDocument = useCallback(async (documentId: string, comment: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch the current document
      const { data: docData, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      // Update the document status to Approved
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          status: 'Approved',
          last_action: 'Approved'
        })
        .eq('id', documentId);
        
      if (updateError) {
        throw updateError;
      }
      
      // Record the approval activity
      const { error: activityError } = await supabase
        .from('document_activities')
        .insert({
          document_id: documentId,
          action: 'approve',
          user_id: 'currentUser', // This should come from user context
          user_name: 'Current User', // This should come from user context
          user_role: 'Approver', // This should come from user context
          comments: comment
        });
        
      if (activityError) {
        throw activityError;
      }
      
      // Update the state
      setDocuments(prev => 
        prev.map(doc => {
          if (doc.id === documentId) {
            return {
              ...doc,
              status: 'Approved',
              last_action: 'Approved'
            };
          }
          return doc;
        })
      );
    } catch (err: any) {
      console.error('Error approving document:', err);
      setError(err.message || 'Failed to approve document');
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectDocument = useCallback(async (documentId: string, reason: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Update the document status to Rejected
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          status: 'Rejected',
          last_action: 'Rejected',
          rejection_reason: reason
        })
        .eq('id', documentId);
        
      if (updateError) {
        throw updateError;
      }
      
      // Record the rejection activity
      const { error: activityError } = await supabase
        .from('document_activities')
        .insert({
          document_id: documentId,
          action: 'reject',
          user_id: 'currentUser', // This should come from user context
          user_name: 'Current User', // This should come from user context
          user_role: 'Approver', // This should come from user context
          comments: reason
        });
        
      if (activityError) {
        throw activityError;
      }
      
      // Update the state
      setDocuments(prev => 
        prev.map(doc => {
          if (doc.id === documentId) {
            return {
              ...doc,
              status: 'Rejected',
              last_action: 'Rejected',
              rejection_reason: reason
            };
          }
          return doc;
        })
      );
    } catch (err: any) {
      console.error('Error rejecting document:', err);
      setError(err.message || 'Failed to reject document');
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
};

export default useDocumentService;
