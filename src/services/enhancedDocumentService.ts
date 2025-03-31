
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentVersion, DocumentActivity, DocumentAccess } from '@/types/document';
import documentService from './documentService';
import { v4 as uuidv4 } from 'uuid';

// Enhanced document service with additional methods
const enhancedDocumentService = {
  // Re-export original methods
  ...documentService,

  // Document access methods
  async fetchAccess(documentId: string): Promise<DocumentAccess[]> {
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
  
  async grantAccess(access: Partial<DocumentAccess>): Promise<DocumentAccess> {
    try {
      const newAccess = {
        id: access.id || uuidv4(),
        ...access,
        granted_at: access.granted_at || new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('document_access')
        .insert(newAccess)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error granting document access:', error);
      throw error;
    }
  },
  
  async revokeAccess(accessId: string): Promise<void> {
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
  },

  // Storage and URL methods
  async getStoragePath(document: Document): Promise<string> {
    return `documents/${document.id}/${document.file_name}`;
  },
  
  async getDownloadUrl(filePath: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('attachments')
        .createSignedUrl(filePath, 60 * 60); // 1-hour expiry
      
      if (error) throw error;
      if (!data?.signedUrl) throw new Error("Failed to generate download URL");
      
      return data.signedUrl;
    } catch (error) {
      console.error(`Error generating download URL for ${filePath}:`, error);
      throw error;
    }
  }
};

export default enhancedDocumentService;
