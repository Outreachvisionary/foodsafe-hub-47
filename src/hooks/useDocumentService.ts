
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Document, 
  DocumentStatus,
  CheckoutStatus
} from '@/types/document';
import { 
  getDocumentComments, 
  createDocumentComment 
} from '@/services/documentCommentService';
import {
  fetchDocumentAccess,
  grantDocumentAccess,
  revokeDocumentAccess
} from '@/services/enhancedDocumentService';
import { adaptDbDocumentToModel } from '@/utils/documentAdapters';

export function useDocumentService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check out a document
  const checkoutDocument = async (documentId: string, userId: string): Promise<Document | null> => {
    try {
      setLoading(true);
      
      const { data, error: updateError } = await supabase
        .from('documents')
        .update({ 
          checkout_status: CheckoutStatus.CheckedOut,
          checkout_user_id: userId,
          checkout_timestamp: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Create document activity for checkout
      await supabase
        .from('document_activities')
        .insert({
          document_id: documentId,
          user_id: userId,
          user_name: 'Current User', 
          user_role: 'User',
          action: 'checkout',
          checkout_action: 'checked_out'
        });
      
      return adaptDbDocumentToModel(data);
    } catch (err) {
      console.error('Error checking out document:', err);
      setError('Failed to check out document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Check in a document
  const checkinDocument = async (documentId: string, userId: string, comment?: string): Promise<Document | null> => {
    try {
      setLoading(true);
      
      const { data, error: updateError } = await supabase
        .from('documents')
        .update({ 
          checkout_status: CheckoutStatus.Available,
          checkout_user_id: null,
          checkout_timestamp: null,
          status: DocumentStatus.Active // Update status as needed
        })
        .eq('id', documentId)
        .eq('checkout_user_id', userId) // Ensure only the user who checked out can check in
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Record check-in activity with comment if provided
      await supabase
        .from('document_activities')
        .insert({
          document_id: documentId,
          user_id: userId,
          user_name: 'Current User', 
          user_role: 'User',
          action: 'checkin',
          comments: comment,
          checkout_action: 'checked_in'
        });
      
      return adaptDbDocumentToModel(data);
    } catch (err) {
      console.error('Error checking in document:', err);
      setError('Failed to check in document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents
  const fetchDocuments = async (): Promise<Document[]> => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      return (data || []).map(doc => adaptDbDocumentToModel(doc));
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to fetch documents');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new document
  const createDocument = async (documentData: Partial<Document>): Promise<Document> => {
    try {
      setLoading(true);
      
      // Convert Document type to database format
      const dbDocument = {
        ...documentData,
        status: documentData.status || DocumentStatus.Draft,
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error: createError } = await supabase
        .from('documents')
        .insert(dbDocument)
        .select()
        .single();
      
      if (createError) throw createError;
      
      // Create document activity for creation
      await supabase
        .from('document_activities')
        .insert({
          document_id: data.id,
          user_id: documentData.created_by || 'system',
          user_name: 'Current User',
          user_role: 'Author',
          action: 'create'
        });
      
      return adaptDbDocumentToModel(data);
    } catch (err) {
      console.error('Error creating document:', err);
      setError('Failed to create document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a download URL for a document
  const getDownloadUrl = async (documentId: string, fileName: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(`${documentId}/${fileName}`, 60); // 60 seconds expiry
      
      if (error) throw error;
      
      return data.signedUrl;
    } catch (err) {
      console.error('Error getting document download URL:', err);
      setError('Failed to get document download URL');
      return null;
    }
  };

  // Get storage path for a document
  const getStoragePath = (documentId: string, fileName: string): string => {
    return `${documentId}/${fileName}`;
  };

  // Update document status
  const updateDocumentStatus = async (documentId: string, newStatus: DocumentStatus, comment?: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('documents')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Record status change activity
      await supabase
        .from('document_activities')
        .insert({
          document_id: documentId,
          user_id: 'current_user',
          user_name: 'Current User',
          user_role: 'Editor',
          action: `status_change_to_${newStatus}`,
          comments: comment
        });
      
      return adaptDbDocumentToModel(data);
    } catch (err) {
      console.error('Error updating document status:', err);
      setError(`Failed to update document status to ${newStatus}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Approve document
  const approveDocument = async (documentId: string, comment?: string) => {
    return updateDocumentStatus(documentId, DocumentStatus.Approved, comment);
  };
  
  // Reject document
  const rejectDocument = async (documentId: string, reason?: string) => {
    return updateDocumentStatus(documentId, DocumentStatus.Rejected, reason);
  };

  // Publish document
  const publishDocument = async (documentId: string, comment?: string) => {
    return updateDocumentStatus(documentId, DocumentStatus.Published, comment);
  };

  // Archive document
  const archiveDocument = async (documentId: string, reason?: string) => {
    return updateDocumentStatus(documentId, DocumentStatus.Archived, reason);
  };

  // Fetch document access permissions
  const fetchAccess = async (documentId: string) => {
    try {
      return await fetchDocumentAccess(documentId);
    } catch (err) {
      console.error('Error fetching document access:', err);
      setError('Failed to fetch document access permissions');
      return [];
    }
  };

  // Grant access to a document
  const grantAccess = async (
    documentId: string,
    userId: string,
    permissionLevel: string,
    grantedBy: string
  ) => {
    try {
      return await grantDocumentAccess(documentId, userId, permissionLevel, grantedBy);
    } catch (err) {
      console.error('Error granting document access:', err);
      setError('Failed to grant document access');
      throw err;
    }
  };

  // Revoke access to a document
  const revokeAccess = async (accessId: string): Promise<void> => {
    try {
      await revokeDocumentAccess(accessId);
    } catch (err) {
      console.error('Error revoking document access:', err);
      setError('Failed to revoke document access');
      throw err;
    }
  };

  return {
    loading,
    error,
    fetchDocuments,
    createDocument,
    checkoutDocument,
    checkinDocument,
    getDocumentComments,
    createDocumentComment,
    getDownloadUrl,
    getStoragePath,
    fetchAccess,
    grantAccess,
    revokeAccess,
    approveDocument,
    rejectDocument,
    publishDocument,
    archiveDocument,
    updateDocumentStatus
  };
}

export default useDocumentService;
