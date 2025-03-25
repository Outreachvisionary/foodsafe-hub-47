
import { supabase } from '@/integrations/supabase/client';

// CAPA Integration
export const linkNCToCapa = async (nonConformanceId: string, capaId: string): Promise<void> => {
  // Update the non-conformance with the CAPA ID
  const { error: ncError } = await supabase
    .from('non_conformances')
    .update({ capa_id: capaId })
    .eq('id', nonConformanceId);
  
  if (ncError) {
    console.error(`Error linking non-conformance to CAPA:`, ncError);
    throw ncError;
  }
  
  // Create a relationship in the module_relationships table
  const { error: relError } = await supabase
    .from('module_relationships')
    .insert({
      source_id: nonConformanceId,
      source_type: 'non_conformance',
      target_id: capaId,
      target_type: 'capa',
      relationship_type: 'capa_generated_from',
      created_by: 'system' // This should be the user ID in a real app
    });
  
  if (relError) {
    console.error(`Error creating module relationship:`, relError);
    throw relError;
  }
};

// Module Integration - Training
export const getTrainingRelatedToNC = async (nonConformanceId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('module_relationships')
    .select(`
      *,
      training_sessions:target_id(*)
    `)
    .eq('source_id', nonConformanceId)
    .eq('source_type', 'non_conformance')
    .eq('target_type', 'training');
  
  if (error) {
    console.error(`Error fetching related training:`, error);
    throw error;
  }
  
  return data;
};

// Module Integration - Documents
export const getDocumentsRelatedToNC = async (nonConformanceId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('module_relationships')
    .select(`
      *,
      documents:target_id(*)
    `)
    .eq('source_id', nonConformanceId)
    .eq('source_type', 'non_conformance')
    .eq('target_type', 'document');
  
  if (error) {
    console.error(`Error fetching related documents:`, error);
    throw error;
  }
  
  return data;
};

// Module Integration - Audits
export const getAuditsRelatedToNC = async (nonConformanceId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('module_relationships')
    .select(`
      *,
      audits:target_id(*)
    `)
    .eq('source_id', nonConformanceId)
    .eq('source_type', 'non_conformance')
    .eq('target_type', 'audit');
  
  if (error) {
    console.error(`Error fetching related audits:`, error);
    throw error;
  }
  
  return data;
};
