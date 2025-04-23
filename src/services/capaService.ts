
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPARelatedDocument, CAPARelatedTraining, CAPAFetchParams } from '@/types/capa';
import { mapDbStatusToInternal } from '@/services/capa/capaStatusMapper';

export const fetchCAPADetails = async (capaId: string): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', capaId)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: mapDbStatusToInternal(data.status),
      priority: data.priority,
      source: data.source,
      dueDate: data.due_date,
      completionDate: data.completion_date,
      rootCause: data.root_cause,
      correctiveAction: data.corrective_action,
      preventiveAction: data.preventive_action,
      createdAt: data.created_at,
      lastUpdated: data.updated_at,
      assignedTo: data.assigned_to,
      createdBy: data.created_by,
      department: data.department,
      verificationMethod: data.verification_method,
      verifiedBy: data.verified_by,
      verificationDate: data.verification_date,
      effectivenessRating: data.effectiveness_rating,
      effectivenessVerified: data.effectiveness_verified,
      isFsma204Compliant: data.fsma204_compliant
    };
  } catch (error) {
    console.error('Error fetching CAPA details:', error);
    throw error;
  }
};

export const fetchCAPARelatedItems = async (capaId: string): Promise<{
  documents: CAPARelatedDocument[];
  trainings: CAPARelatedTraining[];
}> => {
  try {
    const [documentsResponse, trainingsResponse] = await Promise.all([
      supabase
        .from('capa_related_documents')
        .select('*')
        .eq('capa_id', capaId),
      supabase
        .from('capa_related_training')
        .select('*')
        .eq('capa_id', capaId)
    ]);
    
    if (documentsResponse.error) throw documentsResponse.error;
    if (trainingsResponse.error) throw trainingsResponse.error;
    
    // Map the database rows to the appropriate interfaces
    const documents: CAPARelatedDocument[] = (documentsResponse.data || []).map(doc => ({
      id: doc.id,
      capaId: doc.capa_id,
      documentId: doc.document_id,
      documentType: doc.document_type,
      addedAt: doc.added_at,
      addedBy: doc.added_by
    }));
    
    const trainings: CAPARelatedTraining[] = (trainingsResponse.data || []).map(training => ({
      id: training.id,
      capaId: training.capa_id,
      trainingId: training.training_id,
      addedAt: training.added_at,
      addedBy: training.added_by
    }));
    
    return { documents, trainings };
  } catch (error) {
    console.error('Error fetching CAPA related items:', error);
    throw error;
  }
};

export const getSourceItemDetails = async (capaId: string): Promise<any> => {
  try {
    const { data: capa, error: capaError } = await supabase
      .from('capa_actions')
      .select('source, source_id')
      .eq('id', capaId)
      .single();
    
    if (capaError) throw capaError;
    if (!capa || !capa.source || !capa.source_id) return null;
    
    // Check the source type and fetch the relevant details
    const sourceType = capa.source.toLowerCase();
    let sourceData = null;
    
    if (sourceType === 'complaint') {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', capa.source_id)
        .single();
        
      if (error) throw error;
      sourceData = data;
    } else if (sourceType === 'audit_finding') {
      const { data, error } = await supabase
        .from('audit_findings')
        .select('*')
        .eq('id', capa.source_id)
        .single();
        
      if (error) throw error;
      sourceData = data;
    } else if (sourceType === 'non_conformance') {
      const { data, error } = await supabase
        .from('non_conformances')
        .select('*')
        .eq('id', capa.source_id)
        .single();
        
      if (error) throw error;
      sourceData = data;
    }
    
    return {
      type: sourceType,
      data: sourceData
    };
  } catch (error) {
    console.error('Error fetching source item details:', error);
    throw error;
  }
};
