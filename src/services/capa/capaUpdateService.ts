
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus, CAPAPriority, CAPASource } from '@/types/capa';

/**
 * Convert database source records to CAPA objects
 */
export const convertSourceToCAPA = async (source: string, sourceId: string, userId: string): Promise<CAPA | null> => {
  try {
    // Identify the appropriate table based on the source
    let tableName: string;
    let sourceType: CAPASource;
    
    switch (source) {
      case 'audit':
        tableName = 'audit_findings';
        sourceType = 'audit';
        break;
      case 'complaint':
        tableName = 'complaints';
        sourceType = 'customer-complaint';
        break;
      case 'non-conformance':
        tableName = 'non_conformances';
        sourceType = 'internal-qc';
        break;
      default:
        console.error(`Unsupported source type: ${source}`);
        return null;
    }
    
    // Fetch the source record
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', sourceId)
      .single();
    
    if (error) {
      console.error(`Error fetching ${source} with ID ${sourceId}:`, error);
      return null;
    }
    
    if (!data) {
      console.error(`No ${source} found with ID ${sourceId}`);
      return null;
    }
    
    // Create a base CAPA object with default values
    const capaBase: Partial<CAPA> = {
      source: sourceType,
      sourceId: sourceId,
      createdBy: userId,
      assignedTo: data.assigned_to || userId,
    };
    
    // Source-specific mapping
    let capaData: CAPA;
    
    if (tableName === 'audit_findings') {
      // Map audit finding to CAPA
      capaData = {
        ...capaBase,
        id: "", // Will be generated on insert
        title: `CAPA for Audit Finding: ${data.description.substring(0, 50)}...`,
        description: data.description,
        status: "Open" as CAPAStatus,
        priority: mapSeverityToPriority(data.severity),
        rootCause: "",
        correctiveAction: "",
        preventiveAction: "",
        dueDate: data.due_date,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        effectivenessCriteria: "",
      };
    } else if (tableName === 'complaints') {
      // Map customer complaint to CAPA
      capaData = {
        ...capaBase,
        id: "", // Will be generated on insert
        title: data.title || `CAPA for Customer Complaint`,
        description: data.description,
        status: "Open" as CAPAStatus,
        priority: mapComplaintPriorityToCapaPriority(data.priority),
        rootCause: "",
        correctiveAction: "",
        preventiveAction: "",
        dueDate: undefined,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        effectivenessCriteria: "",
      };
    } else if (tableName === 'non_conformances') {
      // Map non-conformance to CAPA
      capaData = {
        ...capaBase,
        id: "", // Will be generated on insert
        title: data.title || `CAPA for Non-Conformance`,
        description: data.description,
        status: "Open" as CAPAStatus,
        priority: mapNcRiskToPriority(data.risk_level),
        rootCause: "",
        correctiveAction: "",
        preventiveAction: "",
        dueDate: undefined,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        effectivenessCriteria: "",
      };
    } else {
      console.error(`Unsupported table: ${tableName}`);
      return null;
    }
    
    return capaData;
  } catch (error) {
    console.error(`Error converting ${source} to CAPA:`, error);
    return null;
  }
};

/**
 * Create a CAPA from a database source record
 */
export const createCapaFromSource = async (source: string, sourceId: string, userId: string): Promise<CAPA | null> => {
  try {
    // Convert source to CAPA
    const capaData = await convertSourceToCAPA(source, sourceId, userId);
    
    if (!capaData) {
      return null;
    }
    
    // Map to database schema
    const dbRecord = {
      title: capaData.title,
      description: capaData.description,
      status: capaData.status,
      priority: capaData.priority,
      source: capaData.source,
      root_cause: capaData.rootCause,
      corrective_action: capaData.correctiveAction,
      preventive_action: capaData.preventiveAction,
      due_date: capaData.dueDate,
      created_by: capaData.createdBy,
      assigned_to: capaData.assignedTo,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source_id: capaData.sourceId,
      effectiveness_criteria: capaData.effectivenessCriteria,
      fsma204_compliant: false,
    };
    
    // Insert CAPA record
    const { data, error } = await supabase
      .from('capa_actions')
      .insert(dbRecord)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating CAPA from source:', error);
      throw error;
    }
    
    // Update the source record to link it to the new CAPA
    await updateSourceWithCapaId(source, sourceId, data.id);
    
    // Map database record to frontend model
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status as CAPAStatus,
      priority: data.priority as CAPAPriority,
      source: data.source as CAPASource,
      rootCause: data.root_cause,
      correctiveAction: data.corrective_action,
      preventiveAction: data.preventive_action,
      dueDate: data.due_date,
      assignedTo: data.assigned_to,
      createdBy: data.created_by,
      createdAt: data.created_at,
      lastUpdated: data.updated_at,
      effectivenessCriteria: data.effectiveness_criteria,
      sourceId: data.source_id
    };
  } catch (error) {
    console.error(`Error creating CAPA from ${source} with ID ${sourceId}:`, error);
    return null;
  }
};

/**
 * Update the source record with the ID of the newly created CAPA
 */
const updateSourceWithCapaId = async (source: string, sourceId: string, capaId: string): Promise<boolean> => {
  try {
    let tableName: string;
    
    switch (source) {
      case 'audit':
        tableName = 'audit_findings';
        break;
      case 'complaint':
        tableName = 'complaints';
        break;
      case 'non-conformance':
        tableName = 'non_conformances';
        break;
      default:
        console.error(`Unsupported source type: ${source}`);
        return false;
    }
    
    const { error } = await supabase
      .from(tableName)
      .update({ capa_id: capaId })
      .eq('id', sourceId);
    
    if (error) {
      console.error(`Error updating ${source} with CAPA ID:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error linking CAPA to ${source}:`, error);
    return false;
  }
};

/**
 * Map severity to CAPA priority
 */
const mapSeverityToPriority = (severity: string): CAPAPriority => {
  switch (severity) {
    case 'Critical':
      return 'critical';
    case 'Major':
      return 'high';
    case 'Minor':
      return 'medium';
    case 'Observation':
      return 'low';
    default:
      return 'medium';
  }
};

/**
 * Map complaint priority to CAPA priority
 */
const mapComplaintPriorityToCapaPriority = (priority: string): CAPAPriority => {
  switch (priority) {
    case 'High':
      return 'high';
    case 'Medium':
      return 'medium';
    case 'Low':
      return 'low';
    case 'Urgent':
      return 'critical';
    default:
      return 'medium';
  }
};

/**
 * Map non-conformance risk level to CAPA priority
 */
const mapNcRiskToPriority = (riskLevel: string): CAPAPriority => {
  switch (riskLevel) {
    case 'High':
      return 'high';
    case 'Medium':
      return 'medium';
    case 'Low':
      return 'low';
    case 'Critical':
      return 'critical';
    default:
      return 'medium';
  }
};

export default {
  convertSourceToCAPA,
  createCapaFromSource
};
