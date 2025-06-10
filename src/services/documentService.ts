
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentActivity, DocumentActionType } from '@/types/document';
import { DocumentStatus, CheckoutStatus, DocumentCategory } from '@/types/enums';
import { documentCategoryToDbString, stringToDocumentCategory, documentStatusToDbString, stringToDocumentStatus } from '@/utils/documentAdapters';

export const fetchDocuments = async (): Promise<Document[]> => {
  try {
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
    const documentData = {
      ...document,
      status: documentStatusToDbString(document.status),
      category: documentCategoryToDbString(document.category),
      checkout_status: document.checkout_status || 'Available',
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
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
      ...(updates.status && { status: documentStatusToDbString(updates.status) }),
      ...(updates.category && { category: documentCategoryToDbString(updates.category) }),
    };

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
    
    return {
      ...data,
      action: data.action as DocumentActionType
    };
  } catch (error) {
    console.error('Error creating document activity:', error);
    throw error;
  }
};
