
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches supplier documents for a specific supplier
 * @param supplierId The ID of the supplier
 * @returns Array of supplier documents
 */
export const getSupplierDocuments = async (supplierId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('supplier_documents')
      .select('*')
      .eq('supplier_id', supplierId)
      .order('upload_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching supplier documents:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getSupplierDocuments:', error);
    throw error;
  }
};

/**
 * Uploads a new document for a supplier
 * @param supplierId The supplier ID
 * @param documentData The document data
 * @returns The created document
 */
export const uploadSupplierDocument = async (supplierId: string, documentData: any): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('supplier_documents')
      .insert([{
        supplier_id: supplierId,
        ...documentData,
        upload_date: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error uploading supplier document:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in uploadSupplierDocument:', error);
    throw error;
  }
};

/**
 * Updates a supplier document
 * @param documentId The document ID
 * @param updates The updates to apply
 * @returns The updated document
 */
export const updateSupplierDocument = async (documentId: string, updates: any): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('supplier_documents')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating supplier document:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateSupplierDocument:', error);
    throw error;
  }
};

/**
 * Deletes a supplier document
 * @param documentId The document ID
 */
export const deleteSupplierDocument = async (documentId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('supplier_documents')
      .delete()
      .eq('id', documentId);
    
    if (error) {
      console.error('Error deleting supplier document:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteSupplierDocument:', error);
    throw error;
  }
};

/**
 * Creates a relationship between two modules
 * @param sourceId The source ID
 * @param sourceType The source type
 * @param targetId The target ID
 * @param targetType The target type
 * @param relationshipType The relationship type
 * @param createdBy The user who created the relationship
 * @returns The created relationship
 */
export const createModuleRelationship = async (
  sourceId: string,
  sourceType: string,
  targetId: string,
  targetType: string,
  relationshipType: string,
  createdBy: string
): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('module_relationships')
      .insert([{
        source_id: sourceId,
        source_type: sourceType,
        target_id: targetId,
        target_type: targetType,
        relationship_type: relationshipType,
        created_by: createdBy
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating module relationship:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createModuleRelationship:', error);
    throw error;
  }
};

export default {
  getSupplierDocuments,
  uploadSupplierDocument,
  updateSupplierDocument,
  deleteSupplierDocument,
  createModuleRelationship
};
