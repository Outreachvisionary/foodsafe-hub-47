
import { Document, DocumentAccess } from '@/types/document';
import { supabase } from '@/integrations/supabase/client';

// Enhanced document service for additional functionality beyond basic services

export const fetchDocumentAccess = async (documentId: string): Promise<DocumentAccess[]> => {
  try {
    const { data, error } = await supabase
      .from('document_access')
      .select('*')
      .eq('document_id', documentId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching document access:', error);
    throw error;
  }
};

export const grantDocumentAccess = async (
  documentId: string,
  userId: string,
  permissionLevel: string,
  grantedBy: string
): Promise<DocumentAccess> => {
  try {
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
    return data;
  } catch (error) {
    console.error('Error granting document access:', error);
    throw error;
  }
};

export const revokeDocumentAccess = async (accessId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('document_access')
      .delete()
      .eq('id', accessId);

    if (error) throw error;
  } catch (error) {
    console.error('Error revoking document access:', error);
    throw error;
  }
};

export default {
  fetchDocumentAccess,
  grantDocumentAccess,
  revokeDocumentAccess
};
