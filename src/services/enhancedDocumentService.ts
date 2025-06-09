
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/document';
import { documentCategoryToDbString, documentStatusToDbString, stringToDocumentCategory, stringToDocumentStatus, checkoutStatusToDbString } from '@/utils/documentAdapters';

export const fetchDocuments = async (): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => ({
      ...item,
      category: stringToDocumentCategory(item.category),
      status: stringToDocumentStatus(item.status)
    })) as Document[];
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const getDocumentCounts = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('status');

    if (error) throw error;

    const counts: Record<string, number> = {};
    data?.forEach((doc) => {
      const status = doc.status || 'Draft';
      counts[status] = (counts[status] || 0) + 1;
    });

    return counts;
  } catch (error) {
    console.error('Error fetching document counts:', error);
    return {};
  }
};

export const createDocument = async (document: Partial<Document>): Promise<Document> => {
  try {
    const dbDocument: any = {
      ...document,
      category: document.category ? documentCategoryToDbString(document.category) : undefined,
      status: document.status ? documentStatusToDbString(document.status) : undefined,
      checkout_status: document.checkout_status ? checkoutStatusToDbString(document.checkout_status) : undefined
    };

    // Clean up enum fields that shouldn't be sent as enums
    delete dbDocument.checkout_status; // Remove if it's an enum type

    const { data, error } = await supabase
      .from('documents')
      .insert([dbDocument])
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      category: stringToDocumentCategory(data.category),
      status: stringToDocumentStatus(data.status)
    } as Document;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const updateDocument = async (id: string, updates: Partial<Document>): Promise<Document> => {
  try {
    const dbUpdates: any = {
      ...updates,
      category: updates.category ? documentCategoryToDbString(updates.category) : undefined,
      status: updates.status ? documentStatusToDbString(updates.status) : undefined
    };

    // Remove enum fields that cause type conflicts
    if (dbUpdates.checkout_status) {
      dbUpdates.checkout_status = checkoutStatusToDbString(dbUpdates.checkout_status);
    }

    const { data, error } = await supabase
      .from('documents')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      category: stringToDocumentCategory(data.category),
      status: stringToDocumentStatus(data.status)
    } as Document;
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
