
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Enhanced document service with additional functionality
 */
const enhancedDocumentService = {
  // Storage paths and URLs
  getStoragePath(documentId: string, fileName: string): string {
    return `documents/${documentId}/${fileName}`;
  },

  async getDownloadUrl(filePath: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('document-files')
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      
      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error(`Error getting download URL for ${filePath}:`, error);
      throw error;
    }
  },

  // Access control
  async fetchAccess(documentId: string) {
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
  },

  async grantAccess(documentId: string, userId: string, permissionLevel: string, grantedBy: string) {
    try {
      const accessRecord = {
        id: uuidv4(),
        document_id: documentId,
        user_id: userId,
        permission_level: permissionLevel,
        granted_by: grantedBy,
        granted_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('document_access')
        .insert(accessRecord)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error granting document access:', error);
      throw error;
    }
  },

  async revokeAccess(accessId: string) {
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
  }
};

export default enhancedDocumentService;
