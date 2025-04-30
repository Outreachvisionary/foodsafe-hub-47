
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Document
} from '@/types/document';
import { DocumentStatus, CheckoutStatus } from '@/types/enums';
import { 
  getDocumentComments, 
  createDocumentComment 
} from '@/services/documentCommentService';
import {
  fetchDocumentAccess,
  grantDocumentAccess,
  revokeDocumentAccess
} from '@/services/enhancedDocumentService';

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
      
      return {
        ...data,
        status: data.status as DocumentStatus,
        checkout_status: data.checkout_status as CheckoutStatus
      };
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
      if (comment) {
        await supabase
          .from('document_activities')
          .insert({
            document_id: documentId,
            user_id: userId,
            action: 'check_in',
            comments: comment,
            user_name: 'Current User', // Add required fields
            user_role: 'User'
          });
      }
      
      return {
        ...data,
        status: data.status as DocumentStatus,
        checkout_status: data.checkout_status as CheckoutStatus
      };
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
      
      return (data || []).map(doc => ({
        ...doc,
        status: doc.status as DocumentStatus,
        checkout_status: (doc.checkout_status || 'Available') as CheckoutStatus
      }));
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
      
      const { data, error: createError } = await supabase
        .from('documents')
        .insert(documentData)
        .select()
        .single();
      
      if (createError) throw createError;
      
      return {
        ...data,
        status: data.status as DocumentStatus,
        checkout_status: (data.checkout_status || 'Available') as CheckoutStatus
      };
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
    revokeAccess
  };
}

export default useDocumentService;
