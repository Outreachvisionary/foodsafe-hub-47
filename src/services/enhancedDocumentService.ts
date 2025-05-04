
import { supabase } from '@/integrations/supabase/client';

export const getDocumentCounts = async () => {
  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('status');
      
    if (error) throw error;
    
    const counts = documents.reduce((acc: Record<string, number>, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1;
      return acc;
    }, {});
    
    return counts;
  } catch (error) {
    console.error('Error getting document counts:', error);
    return {};
  }
};

export const fetchDocuments = async () => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*');

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};

export const createDocument = async (documentData: any) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([documentData]);

    if (error) throw error;

    // Changed this to check for data existence and then check length
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const updateDocument = async (id: string, documentData: any) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .update(documentData)
      .eq('id', id);

    if (error) throw error;

    // Changed this to check for data existence and then check length
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (id: string) => {
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
