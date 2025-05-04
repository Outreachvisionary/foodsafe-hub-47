
import { supabase } from '@/integrations/supabase/client';

// Cache for document counts to reduce API calls
let documentCountsCache: Record<string, number> | null = null;
let documentCountsCacheExpiry = 0;
const CACHE_TTL = 60000; // 1 minute cache

export const getDocumentCounts = async () => {
  try {
    // Return cached data if available and not expired
    const now = Date.now();
    if (documentCountsCache && documentCountsCacheExpiry > now) {
      return documentCountsCache;
    }
    
    const { data: documents, error } = await supabase
      .from('documents')
      .select('status');
      
    if (error) throw error;
    
    const counts = documents.reduce((acc: Record<string, number>, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1;
      return acc;
    }, {});
    
    // Update cache
    documentCountsCache = counts;
    documentCountsCacheExpiry = now + CACHE_TTL;
    
    return counts;
  } catch (error) {
    console.error('Error getting document counts:', error);
    return {};
  }
};

// Document cache
const documentsCache: Record<string, any> = {
  data: null,
  expiry: 0
};

export const fetchDocuments = async () => {
  try {
    // Return cached data if available and not expired
    const now = Date.now();
    if (documentsCache.data && documentsCache.expiry > now) {
      return documentsCache.data;
    }
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Update cache
    documentsCache.data = data || [];
    documentsCache.expiry = now + CACHE_TTL;
    
    return documentsCache.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};

export const createDocument = async (documentData: any) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([documentData])
      .select();

    if (error) throw error;

    // Invalidate cache
    documentCountsCache = null;
    documentsCache.data = null;

    // Properly handle the array type to avoid 'never' type errors
    if (data && Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return null;
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
      .eq('id', id)
      .select();

    if (error) throw error;

    // Invalidate cache
    documentCountsCache = null;
    documentsCache.data = null;

    // Properly handle the array type to avoid 'never' type errors
    if (data && Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return null;
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
    
    // Invalidate cache
    documentCountsCache = null;
    documentsCache.data = null;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};
