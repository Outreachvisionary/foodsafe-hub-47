
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentVersion, DocumentActivity, DocumentAccess, DocumentComment } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { adaptDocumentToDatabase } from '@/utils/documentTypeAdapter';

export const useDocumentService = () => {
  const { toast } = useToast();

  const fetchDocumentVersions = useCallback(async (documentId: string): Promise<DocumentVersion[]> => {
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching document versions:', error.message);
      throw error;
    }
  }, []);

  const restoreVersion = useCallback(async (documentId: string, versionId: string): Promise<void> => {
    try {
      const { error } = await supabase.functions.invoke('restore-document-version', {
        body: { documentId, versionId },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error restoring document version:', error.message);
      throw error;
    }
  }, []);

  const downloadVersion = useCallback(async (versionId: string): Promise<void> => {
    try {
      // Get version details
      const { data: versionData, error: versionError } = await supabase
        .from('document_versions')
        .select('file_name, document_id')
        .eq('id', versionId)
        .single();

      if (versionError) throw versionError;

      // Generate download URL
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(`versions/${versionData.document_id}/${versionId}`, 60);

      if (error) throw error;

      // Trigger download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = versionData.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Error downloading document version:', error.message);
      throw error;
    }
  }, []);

  const checkoutDocument = useCallback(async (documentId: string, userId: string): Promise<Document> => {
    try {
      const { data: userData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      
      const userName = userData?.full_name || 'Unknown User';

      const { data, error } = await supabase
        .from('documents')
        .update({
          checkout_status: 'Checked_Out',
          checkout_user_id: userId,
          checkout_user_name: userName,
          checkout_timestamp: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();

      if (error) {
        if (error.code === '23503') {
          throw new Error('Document is already checked out by another user');
        }
        throw error;
      }

      // Record checkout activity
      await supabase.from('document_activities').insert({
        document_id: documentId,
        action: 'update',
        checkout_action: 'Document checked out',
        user_id: userId,
        user_name: userName,
        user_role: 'User',
        timestamp: new Date().toISOString()
      });

      return data;
    } catch (error: any) {
      console.error('Error checking out document:', error.message);
      throw error;
    }
  }, []);

  const checkinDocument = useCallback(async (documentId: string, userId: string, comment: string): Promise<Document> => {
    try {
      // Get user info
      const { data: userData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      
      const userName = userData?.full_name || 'Unknown User';
      
      // First, check if this user has the document checked out
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();
        
      if (docError) throw docError;
      
      if (docData.checkout_status !== 'Checked_Out') {
        throw new Error('Document is not checked out');
      }
      
      if (docData.checkout_user_id !== userId) {
        throw new Error('Document is checked out by another user');
      }

      // Create a new version
      const { data: versionData, error: versionError } = await supabase
        .from('document_versions')
        .insert({
          document_id: documentId,
          file_name: docData.file_name,
          file_size: docData.file_size,
          created_by: userId,
          version: docData.version + 1,
          check_in_comment: comment,
          version_type: 'minor'
        })
        .select()
        .single();
        
      if (versionError) throw versionError;

      // Update document
      const { data, error } = await supabase
        .from('documents')
        .update({
          checkout_status: 'Available',
          checkout_user_id: null,
          checkout_user_name: null,
          checkout_timestamp: null,
          version: versionData.version,
          current_version_id: versionData.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();

      if (error) throw error;

      // Record check-in activity
      await supabase.from('document_activities').insert({
        document_id: documentId,
        action: 'update',
        user_id: userId,
        user_name: userName,
        user_role: 'User',
        comments: comment,
        version_id: versionData.id,
        timestamp: new Date().toISOString()
      });

      return data;
    } catch (error: any) {
      console.error('Error checking in document:', error.message);
      throw error;
    }
  }, []);

  const approveDocument = useCallback(async (documentId: string, userId: string, comments?: string) => {
    try {
      const { data: userData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      
      const userName = userData?.full_name || 'Unknown User';
      
      // Update document status
      const { data, error } = await supabase
        .from('documents')
        .update({
          status: 'Approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();
        
      if (error) throw error;
      
      // Record approval activity
      await supabase.from('document_activities').insert({
        document_id: documentId,
        action: 'approve',
        user_id: userId,
        user_name: userName,
        user_role: 'Approver',
        comments: comments || 'Approved without comments',
        timestamp: new Date().toISOString()
      });
      
      return data;
    } catch (error: any) {
      console.error('Error approving document:', error.message);
      throw error;
    }
  }, []);

  const rejectDocument = useCallback(async (documentId: string, userId: string, reason: string) => {
    try {
      const { data: userData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      
      const userName = userData?.full_name || 'Unknown User';
      
      // Update document status
      const { data, error } = await supabase
        .from('documents')
        .update({
          status: 'Draft',
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();
        
      if (error) throw error;
      
      // Record rejection activity
      await supabase.from('document_activities').insert({
        document_id: documentId,
        action: 'reject',
        user_id: userId,
        user_name: userName,
        user_role: 'Approver',
        comments: reason,
        timestamp: new Date().toISOString()
      });
      
      return data;
    } catch (error: any) {
      console.error('Error rejecting document:', error.message);
      throw error;
    }
  }, []);

  const fetchAccess = useCallback(async (documentId: string): Promise<DocumentAccess[]> => {
    try {
      const { data, error } = await supabase
        .from('document_access')
        .select('*')
        .eq('document_id', documentId);
        
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching document access:', error.message);
      throw error;
    }
  }, []);

  const grantAccess = useCallback(async (
    documentId: string,
    userId: string,
    permissionLevel: string,
    grantedBy: string
  ): Promise<DocumentAccess> => {
    try {
      const { data, error } = await supabase
        .from('document_access')
        .insert({
          document_id: documentId,
          user_id: userId,
          permission_level: permissionLevel,
          granted_by: grantedBy,
          granted_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error granting access:', error.message);
      throw error;
    }
  }, []);

  const revokeAccess = useCallback(async (accessId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('document_access')
        .delete()
        .eq('id', accessId);
        
      if (error) throw error;
    } catch (error: any) {
      console.error('Error revoking access:', error.message);
      throw error;
    }
  }, []);

  const getDocumentComments = useCallback(async (documentId: string): Promise<DocumentComment[]> => {
    try {
      const { data, error } = await supabase
        .from('document_comments')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching document comments:', error.message);
      throw error;
    }
  }, []);

  const createDocumentComment = useCallback(async (comment: Partial<DocumentComment>): Promise<DocumentComment> => {
    try {
      if (!comment.content || !comment.document_id || !comment.user_id || !comment.user_name) {
        throw new Error('Missing required comment fields');
      }
      
      const { data, error } = await supabase
        .from('document_comments')
        .insert({
          content: comment.content,
          document_id: comment.document_id,
          user_id: comment.user_id,
          user_name: comment.user_name,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating document comment:', error.message);
      throw error;
    }
  }, []);

  const updateDocumentComment = useCallback(async (commentId: string, updates: Partial<DocumentComment>): Promise<DocumentComment> => {
    try {
      const { data, error } = await supabase
        .from('document_comments')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error updating document comment:', error.message);
      throw error;
    }
  }, []);

  const deleteDocumentComment = useCallback(async (commentId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('document_comments')
        .delete()
        .eq('id', commentId);
        
      if (error) throw error;
    } catch (error: any) {
      console.error('Error deleting document comment:', error.message);
      throw error;
    }
  }, []);

  const getPreviewUrl = useCallback(async (documentId: string, fileName: string, fileType: string) => {
    try {
      // For now just return a simple URL structure
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(`${documentId}/${fileName}`, 3600);
        
      if (error) throw error;
      
      return {
        url: data.signedUrl,
        fileType
      };
    } catch (error: any) {
      console.error('Error generating preview URL:', error.message);
      throw error;
    }
  }, []);

  const getDownloadUrl = useCallback(async (path: string): Promise<string> => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(path, 60);
        
      if (error) throw error;
      return data.signedUrl;
    } catch (error: any) {
      console.error('Error getting download URL:', error.message);
      throw error;
    }
  }, []);

  const getStoragePath = useCallback((documentId: string, fileName: string): string => {
    return `${documentId}/${fileName}`;
  }, []);

  const createVersion = useCallback(async (versionData: Partial<DocumentVersion>): Promise<DocumentVersion> => {
    try {
      if (!versionData.document_id || !versionData.file_name || !versionData.created_by) {
        throw new Error('Missing required version fields');
      }
      
      // Add the version field if not present
      const finalVersionData = {
        ...versionData,
        version_number: versionData.version_number || versionData.version || 1, // Use version_number or fallback to version or default to 1
      };
      
      const { data, error } = await supabase
        .from('document_versions')
        .insert({
          document_id: finalVersionData.document_id,
          file_name: finalVersionData.file_name,
          file_size: finalVersionData.file_size || 0,
          created_by: finalVersionData.created_by,
          version_number: finalVersionData.version_number,
          version: finalVersionData.version_number, // For backward compatibility
          version_type: finalVersionData.version_type || 'minor',
          editor_metadata: finalVersionData.editor_metadata
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating document version:', error.message);
      throw error;
    }
  }, []);

  const recordActivity = useCallback(async (activity: Partial<DocumentActivity>): Promise<DocumentActivity> => {
    try {
      if (!activity.document_id || !activity.action || !activity.user_id || !activity.user_name || !activity.user_role) {
        throw new Error('Missing required activity fields');
      }
      
      // Ensure action is of the correct type
      const validAction = activity.action as DocumentActionType;
      
      const activityData = {
        document_id: activity.document_id,
        action: validAction,
        user_id: activity.user_id,
        user_name: activity.user_name,
        user_role: activity.user_role,
        comments: activity.comments,
        timestamp: new Date().toISOString(),
        checkout_action: activity.checkout_action,
        version_id: activity.version_id
      };
      
      const { data, error } = await supabase
        .from('document_activities')
        .insert(activityData)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error recording document activity:', error.message);
      throw error;
    }
  }, []);

  const createDocument = useCallback(async (document: Partial<Document>): Promise<Document> => {
    try {
      // Use the adapter to ensure the document has the right shape for the database
      const dbDocument = adaptDocumentToDatabase({
        id: document.id || '',
        title: document.title || '',
        description: document.description || '',
        file_name: document.file_name || '',
        file_size: document.file_size || 0,
        file_type: document.file_type || '',
        category: document.category || 'Other',
        status: document.status || 'Draft',
        version: document.version || 1,
        created_by: document.created_by || 'system',
        is_locked: document.is_locked || false,
      } as Document);
      
      const { data, error } = await supabase
        .from('documents')
        .insert(dbDocument)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating document:', error.message);
      throw error;
    }
  }, []);

  const updateDocument = useCallback(async (documentId: string, updates: Partial<Document>): Promise<Document> => {
    try {
      // Use the adapter to convert the document to the right shape
      const dbUpdates = adaptDocumentToDatabase({
        ...updates,
        id: documentId,
        updated_at: new Date().toISOString()
      } as Document);
      
      const { data, error } = await supabase
        .from('documents')
        .update(dbUpdates)
        .eq('id', documentId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error updating document:', error.message);
      throw error;
    }
  }, []);

  return {
    fetchDocumentVersions,
    restoreVersion,
    downloadVersion,
    checkoutDocument,
    checkinDocument,
    approveDocument,
    rejectDocument,
    fetchAccess,
    grantAccess,
    revokeAccess,
    getDocumentComments,
    createDocumentComment,
    updateDocumentComment,
    deleteDocumentComment,
    getPreviewUrl,
    getDownloadUrl,
    getStoragePath,
    createVersion,
    recordActivity,
    createDocument,
    updateDocument
  };
};
