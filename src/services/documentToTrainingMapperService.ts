
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for mapping document types to training sessions
 */
const documentToTrainingMapperService = {
  /**
   * Get all document status types
   */
  getDocumentStatusTypes: async () => {
    try {
      const { data, error } = await supabase
        .from('document_status_types')
        .select('*')
        .order('sort_order');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching document status types:', error);
      return [];
    }
  },
  
  /**
   * Get all document category types
   */
  getDocumentCategoryTypes: async () => {
    try {
      const { data, error } = await supabase
        .from('document_category_types')
        .select('*')
        .order('sort_order');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching document category types:', error);
      return [];
    }
  },
  
  /**
   * Get all document permission types
   */
  getDocumentPermissionTypes: async () => {
    try {
      const { data, error } = await supabase
        .from('document_permission_types')
        .select('*')
        .order('sort_order');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching document permission types:', error);
      return [];
    }
  },
  
  /**
   * Map a document to training sessions
   * @param documentId Document ID
   * @param sessionIds Array of training session IDs
   */
  mapDocumentToTrainingSessions: async (documentId: string, sessionIds: string[]) => {
    try {
      // First remove any existing mappings
      const { error: deleteError } = await supabase
        .from('module_relationships')
        .delete()
        .eq('source_id', documentId)
        .eq('source_type', 'document')
        .eq('target_type', 'training_session');
        
      if (deleteError) throw deleteError;
      
      // Skip if no session IDs provided
      if (!sessionIds.length) return true;
      
      // Create new mappings
      const mappings = sessionIds.map(sessionId => ({
        source_id: documentId,
        source_type: 'document',
        target_id: sessionId,
        target_type: 'training_session',
        relationship_type: 'required_training',
        created_by: 'system'
      }));
      
      const { error: insertError } = await supabase
        .from('module_relationships')
        .insert(mappings);
        
      if (insertError) throw insertError;
      
      return true;
    } catch (error) {
      console.error('Error mapping document to training sessions:', error);
      return false;
    }
  },
  
  /**
   * Map a document category to training sessions
   * @param categoryName Document category name
   * @param sessionIds Array of training session IDs
   */
  mapCategoryToTrainingSessions: async (categoryName: string, sessionIds: string[]) => {
    try {
      // Update the training sessions to reference this category
      const { error } = await supabase
        .from('training_sessions')
        .update({ training_category: categoryName })
        .in('id', sessionIds);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error mapping category to training sessions:', error);
      return false;
    }
  },
  
  /**
   * Get training sessions for a document category
   * @param categoryName Document category name
   */
  getTrainingSessionsForCategory: async (categoryName: string) => {
    try {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('training_category', categoryName);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching training sessions for category:', error);
      return [];
    }
  },
  
  /**
   * Get training sessions for a document
   * @param documentId Document ID
   */
  getTrainingSessionsForDocument: async (documentId: string) => {
    try {
      const { data, error } = await supabase
        .from('module_relationships')
        .select(`
          target_id,
          training_sessions:target_id(*)
        `)
        .eq('source_id', documentId)
        .eq('source_type', 'document')
        .eq('target_type', 'training_session');
        
      if (error) throw error;
      
      return data?.map(item => item.training_sessions) || [];
    } catch (error) {
      console.error('Error fetching training sessions for document:', error);
      return [];
    }
  }
};

export default documentToTrainingMapperService;
