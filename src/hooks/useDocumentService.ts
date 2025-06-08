import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Document, 
  DocumentVersion, 
  DocumentComment,
  DocumentFilter,
  DocumentAccess,
  DocumentStatus,
  CheckoutStatus,
  DocumentCategory
} from '@/types/document';
import { 
  documentCategoryToString, 
  documentStatusToString, 
  checkoutStatusToString,
  stringToDocumentCategory,
  stringToDocumentStatus,
  stringToCheckoutStatus
} from '@/utils/typeAdapters';

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
          const categories = Array.isArray(filter.category) ? filter.category : [filter.category];
          const categoryStrings = categories.map(cat => documentCategoryToString(cat));
          query = query.in('category', categoryStrings as any);
        }
        
        if (filter.status) {
          const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
          const statusStrings = statuses.map(status => documentStatusToString(status));
          query = query.in('status', statusStrings as any);
        }
        
        if (filter.created_by) {
          query = query.eq('created_by', filter.created_by);
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
      
      const documents: Document[] = (data || []).map(item => ({
        ...item,
        status: stringToDocumentStatus(item.status),
        checkout_status: stringToCheckoutStatus(item.checkout_status || 'Available'),
        category: stringToDocumentCategory(item.category),
      }));
      
      return documents;
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
      
      const document: Document = {
        ...data,
        status: stringToDocumentStatus(data.status),
        checkout_status: stringToCheckoutStatus(data.checkout_status || 'Available'),
        category: stringToDocumentCategory(data.category),
      };
      
      return document;
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
      
      const { data: doc, error: docError } = await supabase
        .from('documents')
        .select('checkout_status')
        .eq('id', documentId)
        .single();
      
      if (docError) throw docError;
      
      if (doc.checkout_status === 'Checked Out') {
        setError('Document is already checked out by another user.');
        return false;
      }
      
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          checkout_status: 'Checked Out' as any,
          checkout_user_id: userId,
          checkout_user_name: userName,
          checkout_timestamp: new Date().toISOString()
        })
        .eq('id', documentId);
      
      if (updateError) throw updateError;
      
      await supabase
        .from('document_activities')
        .insert({
          document_id: documentId,
          user_id: userId,
          user_name: userName,
          user_role: 'User',
          action: 'checkout',
          timestamp: new Date().toISOString(),
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
      
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          checkout_status: 'Available' as any,
          checkout_user_id: null,
          checkout_user_name: null,
          checkout_timestamp: null,
          status: 'Published' as any
        })
        .eq('id', documentId);
      
      if (updateError) throw updateError;
      
      await supabase
        .from('document_activities')
        .insert({
          document_id: documentId,
          user_id: userId,
          user_name: userName,
          user_role: 'User',
          action: 'checkin',
          timestamp: new Date().toISOString(),
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
      
      const versions: DocumentVersion[] = (data || []).map(item => ({
        id: item.id,
        document_id: item.document_id,
        version: item.version,
        version_number: item.version_number || item.version,
        file_name: item.file_name,
        file_path: item.file_name,
        file_size: item.file_size,
        created_by: item.created_by,
        created_at: item.created_at,
        is_binary_file: item.is_binary_file || false,
        version_type: item.version_type as "major" | "minor",
        change_summary: item.change_summary,
        change_notes: item.change_notes,
        modified_by_name: item.modified_by_name
      }));
      
      return versions;
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
        title: document.title || 'Untitled Document',
        description: document.description,
        file_name: document.file_name || 'unnamed.txt',
        file_type: document.file_type || 'text/plain',
        file_size: document.file_size || 0,
        category: documentCategoryToString(document.category || DocumentCategory.Other),
        status: documentStatusToString(DocumentStatus.Draft),
        checkout_status: checkoutStatusToString(CheckoutStatus.Available),
        version: 1,
        created_by: document.created_by || 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: document.tags,
        approvers: document.approvers,
        folder_id: document.folder_id,
        expiry_date: document.expiry_date,
      };
      
      if (!newDocument.title || !newDocument.file_name || !newDocument.file_size) {
        setError('Missing required document fields');
        return null;
      }
      
      const { data, error } = await supabase
        .from('documents')
        .insert(newDocument as any)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        status: stringToDocumentStatus(data.status),
        checkout_status: stringToCheckoutStatus(data.checkout_status || 'Available'),
        category: stringToDocumentCategory(data.category),
      } as Document;
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
          content,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await supabase
        .from('document_activities')
        .insert({
          document_id: documentId,
          user_id: userId,
          user_name: userName,
          user_role: 'Commenter',
          action: 'comment',
          timestamp: new Date().toISOString(),
          comments: content.substring(0, 100) + (content.length > 100 ? '...' : '')
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
  
  const getDownloadUrl = useCallback(async (documentId: string, fileName: string): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .storage
        .from('documents')
        .createSignedUrl(`${documentId}/${fileName}`, 3600);
      
      if (error) throw error;
      
      return data.signedUrl;
    } catch (err) {
      console.error('Error getting download URL:', err);
      setError('Failed to get download URL.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchAccess = useCallback(async (documentId: string): Promise<DocumentAccess[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('document_access')
        .select('*')
        .eq('document_id', documentId);
      
      if (error) throw error;
      
      return data as DocumentAccess[] || [];
    } catch (err) {
      console.error('Error fetching document access:', err);
      setError('Failed to fetch access permissions.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  const grantAccess = useCallback(async (
    documentId: string,
    userId: string,
    permissionLevel: string,
    grantedBy: string
  ): Promise<DocumentAccess | null> => {
    try {
      setLoading(true);
      setError(null);
      
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
      
      return data as DocumentAccess;
    } catch (err) {
      console.error('Error granting access:', err);
      setError('Failed to grant access.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const revokeAccess = useCallback(async (accessId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('document_access')
        .delete()
        .eq('id', accessId);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error revoking access:', err);
      setError('Failed to revoke access.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
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
    deleteDocument,
    getDownloadUrl,
    fetchAccess,
    grantAccess,
    revokeAccess
  };
};

export default useDocumentService;
