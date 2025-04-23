
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAEffectivenessMetrics } from '@/types/capa';

/**
 * Fetch all CAPAs
 */
export const getCAPAs = async (): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Map DB columns to CAPA interface properties
    return data.map(mapCAPAFromDB);
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    return [];
  }
};

/**
 * Fetch a CAPA by ID
 */
export const getCAPAById = async (id: string): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Fetch related documents
    const { data: relatedDocs } = await supabase
      .from('capa_related_documents')
      .select('*')
      .eq('capa_id', id);
    
    // Fetch related training
    const { data: relatedTraining } = await supabase
      .from('capa_related_training')
      .select('*')
      .eq('capa_id', id);
    
    // Map DB columns to CAPA interface and include related items
    const capa = mapCAPAFromDB(data);
    capa.relatedDocuments = relatedDocs || [];
    capa.relatedTraining = relatedTraining || [];
    
    // Get source reference if available
    if (capa.sourceId && capa.source) {
      const sourceTable = getSourceTable(capa.source);
      if (sourceTable) {
        const { data: sourceData } = await supabase
          .from(sourceTable)
          .select('*')
          .eq('id', capa.sourceId)
          .single();
        
        if (sourceData) {
          capa.sourceReference = {
            type: capa.source,
            title: sourceData.title || `${capa.source.charAt(0).toUpperCase() + capa.source.slice(1)} ${sourceData.id}`,
            date: sourceData.created_at || sourceData.reported_date,
            url: `/${sourceTable}/${capa.sourceId}`
          };
        }
      }
    }
    
    return capa;
  } catch (error) {
    console.error(`Error fetching CAPA ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new CAPA
 */
export const createCAPA = async (capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    // Map CAPA interface properties to DB columns
    const dbData = mapCAPAToDB(capaData);
    
    const { data, error } = await supabase
      .from('capa_actions')
      .insert(dbData)
      .select()
      .single();
    
    if (error) throw error;
    return mapCAPAFromDB(data);
  } catch (error) {
    console.error('Error creating CAPA:', error);
    throw error;
  }
};

/**
 * Update an existing CAPA
 */
export const updateCAPA = async (id: string, capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    // Map CAPA interface properties to DB columns
    const dbData = mapCAPAToDB(capaData);
    
    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapCAPAFromDB(data);
  } catch (error) {
    console.error(`Error updating CAPA ${id}:`, error);
    throw error;
  }
};

/**
 * Get potential CAPAs based on various sources
 */
export const getPotentialCAPAs = async (): Promise<any[]> => {
  try {
    // This would be a real implementation that checks various sources
    // For now, return sample data
    return [
      {
        id: 'audit-finding-1',
        title: 'Critical temperature deviation in processing area',
        description: 'Temperature in processing area exceeded critical limit of 40°F for 3 hours during night shift.',
        source: 'audit',
        sourceId: 'audit-finding-1',
        date: new Date().toISOString(),
        severity: 'critical',
        confidence: 0.95
      },
      {
        id: 'complaint-123',
        title: 'Foreign material found in packaged product',
        description: 'Customer reported finding plastic fragments in product batch #LT20250401.',
        source: 'complaint',
        sourceId: 'complaint-123',
        date: new Date().toISOString(),
        severity: 'major',
        confidence: 0.87
      }
    ];
  } catch (error) {
    console.error('Error fetching potential CAPAs:', error);
    return [];
  }
};

/**
 * Helper function to get the source table name based on CAPA source type
 */
const getSourceTable = (source: string): string | null => {
  switch (source) {
    case 'audit':
    case 'internal-audit':
      return 'audit_findings';
    case 'customer-complaint':
      return 'complaints';
    case 'internal-qc':
      return 'non_conformances';
    default:
      return null;
  }
};

/**
 * Map database columns to CAPA interface properties
 */
const mapCAPAFromDB = (data: any): CAPA => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    source: data.source,
    rootCause: data.root_cause,
    correctiveAction: data.corrective_action,
    preventiveAction: data.preventive_action,
    dueDate: data.due_date,
    assignedTo: data.assigned_to,
    createdBy: data.created_by,
    createdAt: data.created_at,
    lastUpdated: data.updated_at,
    createdDate: data.created_at, // Alias for createdAt
    effectivenessCriteria: data.effectiveness_criteria,
    sourceId: data.source_id,
    department: data.department,
    verificationMethod: data.verification_method,
    verifiedBy: data.verified_by,
    completionDate: data.completion_date,
    verificationDate: data.verification_date,
    effectivenessRating: data.effectiveness_rating,
    effectivenessVerified: data.effectiveness_verified,
    isFsma204Compliant: data.fsma204_compliant,
    // These will be populated separately
    sourceReference: undefined,
    relatedDocuments: [],
    relatedTraining: []
  };
};

/**
 * Map CAPA interface properties to database columns
 */
const mapCAPAToDB = (capa: Partial<CAPA>): Record<string, any> => {
  const result: Record<string, any> = {};

  if (capa.title) result.title = capa.title;
  if (capa.description) result.description = capa.description;
  if (capa.status) result.status = capa.status;
  if (capa.priority) result.priority = capa.priority;
  if (capa.source) result.source = capa.source;
  if (capa.rootCause) result.root_cause = capa.rootCause;
  if (capa.correctiveAction) result.corrective_action = capa.correctiveAction;
  if (capa.preventiveAction) result.preventive_action = capa.preventiveAction;
  if (capa.dueDate) result.due_date = capa.dueDate;
  if (capa.assignedTo) result.assigned_to = capa.assignedTo;
  if (capa.createdBy) result.created_by = capa.createdBy;
  if (capa.effectivenessCriteria) result.effectiveness_criteria = capa.effectivenessCriteria;
  if (capa.sourceId) result.source_id = capa.sourceId;
  if (capa.department) result.department = capa.department;
  if (capa.verificationMethod) result.verification_method = capa.verificationMethod;
  if (capa.verifiedBy) result.verified_by = capa.verifiedBy;
  if (capa.completionDate) result.completion_date = capa.completionDate;
  if (capa.verificationDate) result.verification_date = capa.verificationDate;
  if (capa.effectivenessRating !== undefined) result.effectiveness_rating = capa.effectivenessRating;
  if (capa.effectivenessVerified !== undefined) result.effectiveness_verified = capa.effectivenessVerified;
  if (capa.isFsma204Compliant !== undefined) result.fsma204_compliant = capa.isFsma204Compliant;
  
  return result;
};
