import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentVersion, DocumentActivity, DocumentAccess, DocumentComment, DocumentActionType, CheckoutStatus } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { 
  adaptDocumentToDatabase, 
  mapToDocumentActionType, 
  mapDbToAppCheckoutStatus,
  mapAppToDbCheckoutStatus
} from '@/utils/documentTypeAdapter';
import { ensureRecord } from '@/utils/jsonUtils';

const transformVersionData = (versionData: any): DocumentVersion => {
  return {
    ...versionData,
    version_type: versionData.version_type === 'major' ? 'major' : 'minor',
    editor_metadata: ensureRecord(versionData.editor_metadata),
    diff_data: ensureRecord(versionData.diff_data)
  };
};

export const useDocumentService = () => {
  const { toast } = useToast();

  const fetchDocuments = useCallback(async (): Promise<Document[]> => {
    try {
      // Mock implementation - in a real app, this would fetch from the database
      return supabase.from('documents').select('*').then(({ data, error }) => {
        if (error) throw error;
        return data as Document[];
      });
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }, []);

  const fetchDocumentVersions = async (documentId: string): Promise<DocumentVersion[]> => {
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('version', { ascending: false });

      if (error) {
        console.error('Error fetching document versions:', error);
        throw error;
      }

      const versions: DocumentVersion[] = data.map(version => ({
        id: version.id,
        document_id: version.document_id,
        version: version.version,
        version_number: version.version_number || 0,
        file_name: version.file_name,
        file_size: version.file_size,
        created_by: version.created_by,
        created_at: version.created_at || '',
        is_binary_file: version.is_binary_file || false,
        editor_metadata: ensureRecord(version.editor_metadata),
        diff_data: ensureRecord(version.diff_data),
        version_type: (version.version_type === 'major') ? 'major' : 'minor',
        change_summary: version.change_summary || '',
        change_notes: version.change_notes || '',
        check_in_comment: version.check_in_comment || '',
        modified_by: version.modified_by,
        modified_by_name: version.modified_by_name
      }));

      return versions;
    } catch (error) {
      console.error('Error in fetchDocumentVersions:', error);
      throw error;
    }
  };

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
      const { data: versionData, error: versionError } = await supabase
        .from('document_versions')
        .select('file_name, document_id')
        .eq('id', versionId)
        .single();

      if (versionError) throw versionError;

      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(`versions/${versionData.document_id}/${versionId}`, 60);

      if (error) throw error;

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

  const checkOutDocument = async (
    documentId: string,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<Document> => {
    try {
      // Check if document is already checked out
      const { data: docData, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (docData.checkout_status === 'Checked Out') {
        throw new Error('Document is already checked out');
      }
      
      // Update document check out status
      const { data, error } = await supabase
        .from('documents')
        .update({
          checkout_status: mapAppToDbCheckoutStatus('Checked_Out'),
          checkout_user_id: userId,
          checkout_user_name: userName,
          checkout_timestamp: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log the check out action
      await logDocumentActivity(
        documentId,
        userId,
        userName,
        userRole,
        'checkout',
        'Document checked out'
      );
      
      // Convert the database response to our Document type
      const document: Document = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        file_name: data.file_name,
        file_path: data.file_path,
        file_type: data.file_type,
        file_size: data.file_size,
        category: data.category,
        status: data.status,
        version: data.version,
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
        expiry_date: data.expiry_date,
        folder_id: data.folder_id,
        tags: data.tags,
        approvers: data.approvers,
        linked_module: data.linked_module,
        linked_item_id: data.linked_item_id,
        rejection_reason: data.rejection_reason,
        is_locked: data.is_locked || false,
        last_action: data.last_action,
        last_review_date: data.last_review_date,
        next_review_date: data.next_review_date,
        pending_since: data.pending_since,
        current_version_id: data.current_version_id,
        is_template: data.is_template || false,
        checkout_status: mapDbToAppCheckoutStatus(data.checkout_status),
        checkout_timestamp: data.checkout_timestamp,
        checkout_user_id: data.checkout_user_id,
        checkout_user_name: data.checkout_user_name,
        workflow_status: data.workflow_status,
        custom_notification_days: data.custom_notification_days
      };
      
      return document;
    } catch (error) {
      console.error('Error checking out document:', error);
      throw error;
    }
  };

  const checkInDocument = useCallback(async (documentId: string, userId: string, comment: string): Promise<Document> => {
    try {
      const { data: userData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      
      const userName = userData?.full_name || 'Unknown User';
      
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();
        
      if (docError) throw docError;
      
      if (docData.checkout_status !== mapAppToDbCheckoutStatus('Checked_Out')) {
        throw new Error('Document is not checked out');
      }
      
      if (docData.checkout_user_id !== userId) {
        throw new Error('Document is checked out by another user');
      }

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

      const { data, error } = await supabase
        .from('documents')
        .update({
          checkout_status: mapAppToDbCheckoutStatus('Available'),
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

      await supabase.from('document_activities').insert({
        document_id: documentId,
        action: 'checkin',
        user_id: userId,
        user_name: userName,
        user_role: 'User',
        comments: comment,
        version_id: versionData.id,
        timestamp: new Date().toISOString()
      });

      const document: Document = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        file_name: data.file_name,
        file_path: data.file_path,
        file_type: data.file_type,
        file_size: data.file_size,
        category: data.category,
        status: data.status,
        version: data.version,
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
        expiry_date: data.expiry_date,
        folder_id: data.folder_id,
        tags: data.tags,
        approvers: data.approvers,
        linked_module: data.linked_module,
        linked_item_id: data.linked_item_id,
        rejection_reason: data.rejection_reason,
        is_locked: data.is_locked || false,
        last_action: data.last_action,
        last_review_date: data.last_review_date,
        next_review_date: data.next_review_date,
        pending_since: data.pending_since,
        current_version_id: data.current_version_id,
        is_template: data.is_template || false,
        checkout_status: mapDbToAppCheckoutStatus(data.checkout_status),
        checkout_timestamp: data.checkout_timestamp,
        checkout_user_id: data.checkout_user_id,
        checkout_user_name: data.checkout_user_name,
        workflow_status: data.workflow_status,
        custom_notification_days: data.custom_notification_days
      };

      return document;
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

  const createDocumentVersion = async (
    documentId: string,
    fileName: string,
    fileSize: number,
    createdBy: string,
    editorMetadata: Record<string, any>,
    versionType: 'major' | 'minor',
    changeNotes: string,
    changeSummary: string, 
    checkInComment: string,
    isBinaryFile: boolean = false
  ): Promise<DocumentVersion> => {
    try {
      // Get current document version
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('version')
        .eq('id', documentId)
        .single();
      
      if (docError) throw new Error(`Error fetching document: ${docError.message}`);
      
      const currentVersion = docData?.version || 0;
      
      const versionData = {
        document_id: documentId,
        file_name: fileName,
        file_size: fileSize,
        created_by: createdBy,
        version: currentVersion + 1, // Use calculated version instead of default
        editor_metadata: editorMetadata,
        version_type: versionType,
        change_notes: changeNotes,
        change_summary: changeSummary,
        check_in_comment: checkInComment,
        is_binary_file: isBinaryFile
      };

      const { data, error } = await supabase
        .from('document_versions')
        .insert([versionData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating document version:', error);
        throw error;
      }

      // Convert the response to our application type
      const docVersion: DocumentVersion = {
        id: data.id,
        document_id: data.document_id,
        version: data.version,
        version_number: data.version_number,
        file_name: data.file_name,
        file_size: data.file_size,
        created_by: data.created_by,
        created_at: data.created_at,
        editor_metadata: ensureRecord(data.editor_metadata),
        is_binary_file: data.is_binary_file,
        version_type: data.version_type === 'major' ? 'major' : 'minor',
        change_summary: data.change_summary,
        change_notes: data.change_notes,
        check_in_comment: data.check_in_comment,
        modified_by: data.modified_by,
        modified_by_name: data.modified_by_name,
      };

      return docVersion;
    } catch (error) {
      console.error('Error in createDocumentVersion:', error);
      throw error;
    }
  };

  const logDocumentActivity = async (
    documentId: string,
    userId: string,
    userName: string,
    userRole: string,
    action: string,
    comments?: string,
    versionId?: string,
    checkoutAction?: string
  ): Promise<void> => {
    try {
      // Map action to a valid DocumentActionType
      const actionType = action;
      
      await supabase.from('document_activities').insert({
        document_id: documentId,
        user_id: userId,
        user_name: userName,
        user_role: userRole,
        action: actionType,
        comments,
        version_id: versionId,
        checkout_action: checkoutAction
      });

    } catch (error) {
      console.error('Error logging document activity:', error);
      // Don't throw, this is a non-critical operation
      console.warn('Activity logging failed, but continuing operation');
    }
  };

  const createDocument = useCallback(async (document: Partial<Document>): Promise<Document> => {
    try {
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

  const getDocumentVersion = async (versionId: string): Promise<DocumentVersion | null> => {
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('id', versionId)
        .single();
      
      if (error) throw new Error(`Error fetching document version: ${error.message}`);
      
      const formattedVersion: DocumentVersion = {
        ...data,
        version_type: data.version_type === 'major' ? 'major' : 'minor',
        editor_metadata: ensureRecord(data.editor_metadata),
        diff_data: ensureRecord(data.diff_data),
        version_number: data.version_number || 0
      };
      
      return formattedVersion;
    } catch (error) {
      console.error('Error in getDocumentVersion:', error);
      return null;
    }
  };

  const createDocumentActivity = async (
    documentId: string,
    action: DocumentActionType,
    userName: string,
    userRole: string,
    userId: string,
    comments?: string,
    versionId?: string
  ): Promise<void> => {
    try {
      const activityData = {
        document_id: documentId,
        action,
        user_name: userName,
        user_role: userRole,
        user_id: userId,
        comments,
        version_id: versionId
      };
      
      const { error } = await supabase
        .from('document_activities')
        .insert(activityData);
      
      if (error) throw new Error(`Error creating document activity: ${error.message}`);
    } catch (error) {
      console.error('Error in createDocumentActivity:', error);
    }
  };

  const getDocumentActivities = async (documentId: string): Promise<DocumentActivity[]> => {
    try {
      const { data, error } = await supabase
        .from('document_activities')
        .select('*')
        .eq('document_id', documentId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching document activities:', error);
        throw error;
      }

      const activities: DocumentActivity[] = data.map(activity => ({
        id: activity.id,
        document_id: activity.document_id,
        timestamp: activity.timestamp,
        action: activity.action as DocumentActionType,
        user_id: activity.user_id,
        user_name: activity.user_name,
        user_role: activity.user_role,
        version_id: activity.version_id,
        comments: activity.comments,
        checkout_action: activity.checkout_action
      }));

      return activities;
    } catch (error) {
      console.error('Error in getDocumentActivities:', error);
      throw error;
    }
  };

  return {
    fetchDocuments,
    fetchDocumentVersions,
    restoreVersion,
    downloadVersion,
    checkOutDocument,
    checkInDocument,
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
    createDocumentVersion,
    logDocumentActivity,
    createDocument,
    updateDocument,
    getDocumentVersion,
    createDocumentActivity,
    getDocumentActivities
  };
};
