import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentVersion } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

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
        action: 'Document checked out',
        user_id: userId,
        user_name: userName,
        user_role: 'User'
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
          modified_by: userId,
          modified_by_name: userName,
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
        action: 'Document checked in',
        user_id: userId,
        user_name: userName,
        user_role: 'User',
        comments: comment,
        version_id: versionData.id
      });

      return data;
    } catch (error: any) {
      console.error('Error checking in document:', error.message);
      throw error;
    }
  }, []);

  const approveDocument = useCallback(async (documentId: string, userId: string, comments?: string) => {
    try {
      // Implementation for document approval
      console.log('Approving document', documentId);
    } catch (error: any) {
      console.error('Error approving document:', error.message);
      throw error;
    }
  }, []);

  const rejectDocument = useCallback(async (documentId: string, userId: string, reason: string) => {
    try {
      // Implementation for document rejection
      console.log('Rejecting document', documentId, 'with reason:', reason);
    } catch (error: any) {
      console.error('Error rejecting document:', error.message);
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
    rejectDocument
  };
};
