
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentActivity, DocumentActionType } from '@/types/document';
import { stringToDocumentCategory, stringToDocumentStatus, stringToCheckoutStatus } from '@/utils/documentAdapters';
import { documentCategoryToDbString, documentStatusToDbString, checkoutStatusToDbString } from '@/utils/documentAdapters';

export const fetchDocuments = async (): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Convert database strings to proper enum types
    return (data || []).map(item => ({
      ...item,
      category: stringToDocumentCategory(item.category),
      status: stringToDocumentStatus(item.status),
      checkout_status: stringToCheckoutStatus(item.checkout_status || 'Available')
    }));
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const fetchActiveDocuments = async (): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .in('status', ['Published', 'Approved'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Convert database strings to proper enum types
    return (data || []).map(item => ({
      ...item,
      category: stringToDocumentCategory(item.category),
      status: stringToDocumentStatus(item.status),
      checkout_status: stringToCheckoutStatus(item.checkout_status || 'Available')
    }));
  } catch (error) {
    console.error('Error fetching active documents:', error);
    throw error;
  }
};

export const createDocument = async (document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document> => {
  try {
    // Convert enum types to database strings and ensure proper typing
    const dbDocument: any = {
      title: document.title,
      description: document.description,
      file_name: document.file_name,
      file_type: document.file_type,
      file_size: document.file_size,
      category: documentCategoryToDbString(document.category),
      status: documentStatusToDbString(document.status),
      checkout_status: document.checkout_status ? checkoutStatusToDbString(document.checkout_status) : 'Available',
      version: document.version,
      created_by: document.created_by,
      tags: document.tags,
      approvers: document.approvers,
      folder_id: document.folder_id,
      expiry_date: document.expiry_date,
      file_path: document.file_path
    };

    const { data, error } = await supabase
      .from('documents')
      .insert(dbDocument)
      .select()
      .single();

    if (error) throw error;
    
    // Convert back to proper enum types
    return {
      ...data,
      category: stringToDocumentCategory(data.category),
      status: stringToDocumentStatus(data.status),
      checkout_status: stringToCheckoutStatus(data.checkout_status || 'Available')
    };
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const updateDocument = async (id: string, updates: Partial<Document>): Promise<Document> => {
  try {
    // Convert enum types to database strings
    const dbUpdates: any = {
      updated_at: new Date().toISOString()
    };

    // Only include fields that are being updated
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.file_name !== undefined) dbUpdates.file_name = updates.file_name;
    if (updates.file_type !== undefined) dbUpdates.file_type = updates.file_type;
    if (updates.file_size !== undefined) dbUpdates.file_size = updates.file_size;
    if (updates.category !== undefined) dbUpdates.category = documentCategoryToDbString(updates.category);
    if (updates.status !== undefined) dbUpdates.status = documentStatusToDbString(updates.status);
    if (updates.checkout_status !== undefined) dbUpdates.checkout_status = checkoutStatusToDbString(updates.checkout_status);
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.approvers !== undefined) dbUpdates.approvers = updates.approvers;
    if (updates.expiry_date !== undefined) dbUpdates.expiry_date = updates.expiry_date;

    const { data, error } = await supabase
      .from('documents')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Convert back to proper enum types
    return {
      ...data,
      category: stringToDocumentCategory(data.category),
      status: stringToDocumentStatus(data.status),
      checkout_status: stringToCheckoutStatus(data.checkout_status || 'Available')
    };
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const createDocumentActivity = async (activity: Omit<DocumentActivity, 'id' | 'timestamp'>): Promise<DocumentActivity> => {
  try {
    const { data, error } = await supabase
      .from('document_activities')
      .insert({
        ...activity,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    
    // Ensure action is properly typed
    return {
      ...data,
      action: data.action as DocumentActionType
    };
  } catch (error) {
    console.error('Error creating document activity:', error);
    throw error;
  }
};
