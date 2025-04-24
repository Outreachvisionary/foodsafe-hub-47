
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPARelatedDocument, CAPARelatedTraining, CAPAFetchParams, CAPAPriority, CAPASource } from '@/types/capa';
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
      effectivenessCriteria: data.effectiveness_criteria,
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

// Added missing functions
export const getCAPAs = async (params?: CAPAFetchParams): Promise<CAPA[]> => {
  try {
    let query = supabase.from('capa_actions').select('*');
    
    if (params) {
      if (params.status) {
        query = query.eq('status', params.status);
      }
      
      if (params.priority) {
        query = query.eq('priority', params.priority);
      }
      
      if (params.source) {
        query = query.eq('source', params.source);
      }
      
      if (params.assignedTo) {
        query = query.eq('assigned_to', params.assignedTo);
      }
      
      if (params.department) {
        query = query.eq('department', params.department);
      }
      
      if (params.dateFrom && params.dateTo) {
        query = query.gte('due_date', params.dateFrom).lte('due_date', params.dateTo);
      }
      
      if (params.limit) {
        query = query.limit(params.limit);
      }
      
      if (params.sortBy) {
        const direction = params.sortDirection || 'asc';
        query = query.order(params.sortBy, { ascending: direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      if (params.searchQuery) {
        query = query.or(`title.ilike.%${params.searchQuery}%,description.ilike.%${params.searchQuery}%`);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: mapDbStatusToInternal(item.status),
      priority: item.priority as CAPAPriority,
      source: item.source as CAPASource,
      dueDate: item.due_date,
      completionDate: item.completion_date,
      rootCause: item.root_cause,
      correctiveAction: item.corrective_action,
      preventiveAction: item.preventive_action,
      createdAt: item.created_at,
      lastUpdated: item.updated_at,
      assignedTo: item.assigned_to,
      createdBy: item.created_by,
      department: item.department,
      verificationMethod: item.verification_method,
      verifiedBy: item.verified_by,
      verificationDate: item.verification_date,
      effectivenessRating: item.effectiveness_rating,
      effectivenessCriteria: item.effectiveness_criteria,
      effectivenessVerified: item.effectiveness_verified,
      isFsma204Compliant: item.fsma204_compliant
    }));
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

export const createCAPA = async (capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    const dbData = {
      title: capaData.title,
      description: capaData.description,
      status: capaData.status || 'Open',
      priority: capaData.priority || 'Medium',
      source: capaData.source || 'other',
      due_date: capaData.dueDate,
      root_cause: capaData.rootCause,
      corrective_action: capaData.correctiveAction,
      preventive_action: capaData.preventiveAction,
      assigned_to: capaData.assignedTo,
      created_by: capaData.createdBy,
      department: capaData.department,
      fsma204_compliant: capaData.isFsma204Compliant || false,
      effectiveness_criteria: capaData.effectivenessCriteria
    };
    
    const { data, error } = await supabase
      .from('capa_actions')
      .insert(dbData)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create CAPA');
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: mapDbStatusToInternal(data.status),
      priority: data.priority,
      source: data.source,
      dueDate: data.due_date,
      createdAt: data.created_at,
      lastUpdated: data.updated_at,
      assignedTo: data.assigned_to,
      createdBy: data.created_by,
      department: data.department,
      rootCause: data.root_cause,
      correctiveAction: data.corrective_action,
      preventiveAction: data.preventive_action,
      effectivenessCriteria: data.effectiveness_criteria,
      isFsma204Compliant: data.fsma204_compliant
    };
  } catch (error) {
    console.error('Error creating CAPA:', error);
    throw error;
  }
};

export const updateCAPA = async (id: string, capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    const dbData: any = {
      title: capaData.title,
      description: capaData.description,
      priority: capaData.priority,
      due_date: capaData.dueDate,
      completion_date: capaData.completionDate,
      root_cause: capaData.rootCause,
      corrective_action: capaData.correctiveAction,
      preventive_action: capaData.preventiveAction,
      assigned_to: capaData.assignedTo,
      department: capaData.department,
      verification_method: capaData.verificationMethod,
      verified_by: capaData.verifiedBy,
      verification_date: capaData.verificationDate,
      effectiveness_rating: capaData.effectivenessRating,
      effectiveness_criteria: capaData.effectivenessCriteria,
      effectiveness_verified: capaData.effectivenessVerified,
      fsma204_compliant: capaData.isFsma204Compliant,
      updated_at: new Date().toISOString()
    };
    
    if (capaData.status) {
      // Convert status to database format if needed
      dbData.status = capaData.status;
    }
    
    // Remove undefined values
    Object.keys(dbData).forEach(key => {
      if (dbData[key] === undefined) {
        delete dbData[key];
      }
    });
    
    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update CAPA');
    
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
      effectivenessCriteria: data.effectiveness_criteria,
      effectivenessVerified: data.effectiveness_verified,
      isFsma204Compliant: data.fsma204_compliant
    };
  } catch (error) {
    console.error('Error updating CAPA:', error);
    throw error;
  }
};

export const getPotentialCAPAs = async () => {
  try {
    // This would normally query sources like audits, complaints, etc. for potential CAPAs
    // For now, let's return mock data
    return [
      {
        id: 'mock-potential-capa-1',
        title: 'Potential Critical Finding in Audit #A-2023-001',
        description: 'Temperature control deviation in cold storage area exceeding critical limits for more than 4 hours',
        source: 'audit',
        sourceId: 'A-2023-001',
        date: new Date().toISOString(),
        severity: 'Critical',
        confidence: 0.92
      },
      {
        id: 'mock-potential-capa-2',
        title: 'Multiple Customer Complaints - Foreign Material',
        description: 'Three customer complaints reporting metal fragments in Product SKU-8834 from Lot #L-2023-0456',
        source: 'complaint',
        sourceId: 'C-2023-018',
        date: new Date().toISOString(),
        severity: 'Major',
        confidence: 0.85
      }
    ];
  } catch (error) {
    console.error('Error fetching potential CAPAs:', error);
    return [];
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
