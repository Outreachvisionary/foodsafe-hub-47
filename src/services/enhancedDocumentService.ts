import { supabase } from '@/integrations/supabase/client';
import { DocumentVersion, DocumentAccess } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetch all versions for a document with enhanced data
 */
export const fetchDocumentVersions = async (documentId: string): Promise<DocumentVersion[]> => {
  try {
    const { data, error } = await supabase
      .from('document_versions')
      .select('*, created_by_profile:profiles(full_name)')
      .eq('document_id', documentId)
      .order('version', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching enhanced versions for document ${documentId}:`, error);
    throw error;
  }
};

/**
 * Fetch access permissions for a document
 */
export const fetchAccess = async (documentId: string): Promise<DocumentAccess[]> => {
  try {
    const { data, error } = await supabase
      .from('document_access')
      .select('*')
      .eq('document_id', documentId);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching access for document ${documentId}:`, error);
    throw error;
  }
};

/**
 * Grant access to a document for a user
 */
export const grantAccess = async (
  documentId: string, 
  userId: string, 
  permissionLevel: string,
  grantedBy: string
): Promise<DocumentAccess> => {
  try {
    const newAccess = {
      id: uuidv4(),
      document_id: documentId,
      user_id: userId,
      permission_level: permissionLevel,
      granted_by: grantedBy,
      granted_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('document_access')
      .insert(newAccess)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error granting access for document ${documentId}:`, error);
    throw error;
  }
};

/**
 * Revoke access to a document
 */
export const revokeAccess = async (accessId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('document_access')
      .delete()
      .eq('id', accessId);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error revoking access ${accessId}:`, error);
    throw error;
  }
};

/**
 * Check if a user has access to a document
 */
export const checkUserAccess = async (documentId: string, userId: string): Promise<boolean> => {
  try {
    // Check if user has direct access
    const { data, error } = await supabase
      .from('document_access')
      .select('permission_level')
      .eq('document_id', documentId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    if (data) return true;
    
    // Check if document is public
    // The 'is_public' field might not exist, so we'll handle that case
    try {
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('*') // Don't specifically request is_public since it might not exist
        .eq('id', documentId)
        .single();
    
      if (docError) throw docError;
      
      // If the document has an is_public property and it's true, return true
      // Otherwise return false
      return docData && 'is_public' in docData ? !!docData.is_public : false;
    } catch (docError) {
      console.error(`Error checking document public status ${documentId}:`, docError);
      return false;
    }
  } catch (error) {
    console.error(`Error checking access for document ${documentId}:`, error);
    return false;
  }
};

export default {
  fetchDocumentVersions,
  fetchAccess,
  grantAccess,
  revokeAccess,
  checkUserAccess
};
