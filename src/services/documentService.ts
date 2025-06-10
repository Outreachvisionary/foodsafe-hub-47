
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentActivity, DocumentActionType } from '@/types/document';
import { DocumentStatus, CheckoutStatus, DocumentCategory } from '@/types/enums';
import { documentCategoryToDbString, stringToDocumentCategory, documentStatusToDbString, stringToDocumentStatus } from '@/utils/documentAdapters';
import { storageService } from './storageService';

export const fetchDocuments = async (): Promise<Document[]> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      status: stringToDocumentStatus(item.status),
      checkout_status: (item.checkout_status || 'Available') as CheckoutStatus,
      category: stringToDocumentCategory(item.category),
    }));
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const fetchActiveDocuments = async (): Promise<Document[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .in('status', ['Published', 'Approved'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      status: stringToDocumentStatus(item.status),
      checkout_status: (item.checkout_status || 'Available') as CheckoutStatus,
      category: stringToDocumentCategory(item.category),
    }));
  } catch (error) {
    console.error('Error fetching active documents:', error);
    throw error;
  }
};

export const createDocument = async (document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const documentData = {
      title: document.title,
      description: document.description,
      file_name: document.file_name,
      file_path: document.file_path,
      file_type: document.file_type,
      file_size: document.file_size,
      status: documentStatusToDbString(document.status) as any,
      category: documentCategoryToDbString(document.category) as any,
      checkout_status: (document.checkout_status || 'Available') as any,
      version: document.version,
      created_by: user.id, // Use authenticated user ID
      tags: document.tags,
      approvers: document.approvers,
      folder_id: document.folder_id,
      expiry_date: document.expiry_date,
      last_review_date: document.last_review_date,
      next_review_date: document.next_review_date,
      current_version_id: document.current_version_id,
      is_template: document.is_template,
      checkout_user_id: document.checkout_user_id,
      checkout_user_name: document.checkout_user_name,
      checkout_timestamp: document.checkout_timestamp,
      is_locked: document.is_locked,
      linked_module: document.linked_module,
      linked_item_id: document.linked_item_id,
      workflow_status: document.workflow_status,
      rejection_reason: document.rejection_reason,
      last_action: document.last_action,
      pending_since: document.pending_since,
      custom_notification_days: document.custom_notification_days,
    };

    const { data, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      status: stringToDocumentStatus(data.status),
      checkout_status: (data.checkout_status || 'Available') as CheckoutStatus,
      category: stringToDocumentCategory(data.category),
    };
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const updateDocument = async (id: string, updates: Partial<Document>): Promise<Document> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Convert enum values to database strings
    if (updates.status) {
      updateData.status = documentStatusToDbString(updates.status) as any;
    }
    if (updates.category) {
      updateData.category = documentCategoryToDbString(updates.category) as any;
    }

    const { data, error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      status: stringToDocumentStatus(data.status),
      checkout_status: (data.checkout_status || 'Available') as CheckoutStatus,
      category: stringToDocumentCategory(data.category),
    };
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (id: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First get the document to find its file path
    const { data: document } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', id)
      .single();

    // Delete the document record
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Delete the associated file if it exists
    if (document?.file_path) {
      await storageService.deleteFile('documents', document.file_path);
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const uploadDocumentFile = async (file: File, documentId: string): Promise<string> => {
  try {
    const result = await storageService.uploadFile(file, {
      bucket: 'documents',
      folder: documentId,
      filename: file.name,
    });

    if (result.error) {
      throw new Error(result.error);
    }

    return result.path;
  } catch (error) {
    console.error('Error uploading document file:', error);
    throw error;
  }
};

export const getDocumentDownloadUrl = async (filePath: string): Promise<string | null> => {
  try {
    return await storageService.getSignedUrl('documents', filePath, 3600);
  } catch (error) {
    console.error('Error getting document download URL:', error);
    return null;
  }
};

export const createDocumentActivity = async (activity: Omit<DocumentActivity, 'id' | 'timestamp'>): Promise<DocumentActivity> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('document_activities')
      .insert({
        ...activity,
        user_id: user.id, // Ensure user_id is set to authenticated user
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      action: data.action as DocumentActionType
    };
  } catch (error) {
    console.error('Error creating document activity:', error);
    throw error;
  }
};
