
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Document, 
  DocumentVersion, 
  DocumentComment,
  DocumentFilter,
  DocumentStatus,
  CheckoutStatus,
  DocumentCategory
} from '@/types/document';
import { adaptDbDocumentToModel } from '@/utils/documentAdapters';

export const useDocumentService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getDocuments = useCallback(async (filter?: DocumentFilter): Promise<Document[]> => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('documents').select('*');
      
      if (filter) {
        if (filter.category) {
          query = query.in('category', Array.isArray(filter.category) ? filter.category : [filter.category]);
        }
        
        if (filter.status) {
          query = query.in('status', Array.isArray(filter.status) ? filter.status : [filter.status]);
        }
        
        if (filter.createdBy) {
          query = query.eq('created_by', filter.createdBy);
        }
        
        if (filter.createdAfter) {
          query = query.gte('created_at', filter.createdAfter);
        }
        
        if (filter.createdBefore) {
          query = query.lte('created_at', filter.createdBefore);
        }
        
        if (filter.expiringBefore) {
          query = query.lte('expiry_date', filter.expiringBefore);
        }
        
        if (filter.folder_id) {
          query = query.eq('folder_id', filter.folder_id);
        }
        
        if (filter.searchTerm) {
          query = query.or(`title.ilike.%${filter.searchTerm}%,description.ilike.%${filter.searchTerm}%`);
        }
      }
      
      const { data, error } = await query.order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(adaptDbDocumentToModel);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getDocumentById = useCallback(async (id: string): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      return adaptDbDocumentToModel(data);
    } catch (err) {
      console.error(`Error fetching document with ID ${id}:`, err);
      setError('Failed to load document.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const checkoutDocument = useCallback(async (
    documentId: string, 
    userId: string, 
    userName: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // First, verify the document is available
      const { data: doc, error: docError } = await supabase
        .from('documents')
        .select('checkout_status')
        .eq('id', documentId)
        .single();
      
      if (docError) throw docError;
      
      if (doc.checkout_status === CheckoutStatus.CheckedOut) {
        setError('Document is already checked out by another user.');
        return false;
      }
      
      // Update the document's checkout status
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          checkout_status: CheckoutStatus.CheckedOut,
          checkout_user_id: userId,
          checkout_user_name: userName,
          checkout_timestamp: new Date().toISOString()
        })
        .eq('id', documentId);
      
      if (updateError) throw updateError;
      
      // Record the activity
      await supabase
        .from('document_activities')
        .insert({
          document_id: documentId,
          user_id: userId,
          user_name: userName,
          user_role: 'User',
          action: 'Document checked out',
          checkout_action: 'checkout',
          comments: `Document checked out by ${userName}`
        });
      
      return true;
    } catch (err) {
      console.error('Error checking out document:', err);
      setError('Failed to checkout document.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const checkinDocument = useCallback(async (
    documentId: string,
    userId: string,
    userName: string,
    comment?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Update the document's checkout status
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          checkout_status: CheckoutStatus.Available,
          checkout_user_id: null,
          checkout_user_name: null,
          checkout_timestamp: null,
          status: DocumentStatus.Active
        })
        .eq('id', documentId);
      
      if (updateError) throw updateError;
      
      // Record the activity
      await supabase
        .from('document_activities')
        .insert({
          document_id: documentId,
          user_id: userId,
          user_name: userName,
          user_role: 'User',
          action: 'Document checked in',
          checkout_action: 'checkin',
          comments: comment || `Document checked in by ${userName}`
        });
      
      return true;
    } catch (err) {
      console.error('Error checking in document:', err);
      setError('Failed to checkin document.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getDocumentVersions = useCallback(async (documentId: string): Promise<DocumentVersion[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('version', { ascending: false });
      
      if (error) throw error;
      
      return data as DocumentVersion[] || [];
    } catch (err) {
      console.error('Error fetching document versions:', err);
      setError('Failed to load document versions.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createDocument = useCallback(async (document: Partial<Document>): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const newDocument = {
        status: DocumentStatus.Draft,
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...document,
      };
      
      // Validate category is one of the allowed values
      if (newDocument.category && !isValidDocumentCategory(newDocument.category as string)) {
        setError('Invalid document category');
        return null;
      }
      
      const { data, error } = await supabase
        .from('documents')
        .insert([newDocument])
        .select()
        .single();
      
      if (error) throw error;
      
      return adaptDbDocumentToModel(data);
    } catch (err) {
      console.error('Error creating document:', err);
      setError('Failed to create document.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getDocumentComments = useCallback(async (documentId: string): Promise<DocumentComment[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('document_comments')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data as DocumentComment[] || [];
    } catch (err) {
      console.error('Error fetching document comments:', err);
      setError('Failed to load document comments.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createDocumentComment = useCallback(async (
    documentId: string,
    userId: string,
    userName: string,
    content: string
  ): Promise<DocumentComment | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('document_comments')
        .insert({
          document_id: documentId,
          user_id: userId,
          user_name: userName,
          content
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Record comment activity
      await supabase
        .from('document_activities')
        .insert({
          document_id: documentId,
          user_id: userId,
          user_name: userName,
          user_role: 'Commenter',
          action: 'comment',
          comments: content.substring(0, 100) + (content.length > 100 ? '...' : '') // Include a preview
        });
      
      return data as DocumentComment;
    } catch (err) {
      console.error('Error creating document comment:', err);
      setError('Failed to create comment.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const deleteDocument = useCallback(async (documentId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Delete the document
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Helper function to check if a category is valid
  const isValidDocumentCategory = (category: string): boolean => {
    const validCategories: string[] = [
      'Policy', 'Form', 'Training Material', 'Other', 'SOP', 
      'Certificate', 'Audit Report', 'HACCP Plan', 
      'Supplier Documentation', 'Risk Assessment'
    ];
    
    return validCategories.includes(category);
  };
  
  return {
    loading,
    error,
    getDocuments,
    getDocumentById,
    checkoutDocument,
    checkinDocument,
    getDocumentVersions,
    createDocument,
    getDocumentComments,
    createDocumentComment,
    deleteDocument
  };
};

export default useDocumentService;
