
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus, CAPAPriority, CAPASource } from '@/types/capa';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new CAPA
 * @param data CAPA data
 * @returns Newly created CAPA
 */
export const createCAPA = async (data: Omit<CAPA, 'id' | 'status' | 'createdAt' | 'lastUpdated'>): Promise<CAPA> => {
  const newId = uuidv4();
  const now = new Date().toISOString();

  try {
    // Map frontend model to database schema
    const dbRecord = {
      id: newId,
      title: data.title,
      description: data.description,
      status: 'Open' as CAPAStatus,
      priority: data.priority,
      source: data.source,
      root_cause: data.rootCause,
      corrective_action: data.correctiveAction,
      preventive_action: data.preventiveAction,
      due_date: data.dueDate,
      created_by: 'system', // This should be the current user ID in a real app
      created_at: now,
      updated_at: now,
      assigned_to: data.assignedTo || 'unassigned',
      effectiveness_criteria: data.effectivenessCriteria,
      source_id: data.sourceId
    };

    const { data: insertedData, error } = await supabase
      .from('capa_actions')
      .insert(dbRecord)
      .select()
      .single();

    if (error) throw error;

    // Map database record back to frontend model
    return {
      id: insertedData.id,
      title: insertedData.title,
      description: insertedData.description,
      status: insertedData.status as CAPAStatus,
      priority: insertedData.priority as CAPAPriority,
      source: insertedData.source as CAPASource,
      rootCause: insertedData.root_cause,
      correctiveAction: insertedData.corrective_action,
      preventiveAction: insertedData.preventive_action,
      dueDate: insertedData.due_date,
      assignedTo: insertedData.assigned_to,
      createdBy: insertedData.created_by,
      createdAt: insertedData.created_at,
      lastUpdated: insertedData.updated_at,
      effectivenessCriteria: insertedData.effectiveness_criteria,
      sourceId: insertedData.source_id
    };
  } catch (error) {
    console.error('Error creating CAPA:', error);
    throw error;
  }
};

/**
 * Get all CAPAs
 * @returns Array of CAPA items
 */
export const getCAPAs = async (): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status as CAPAStatus,
      priority: item.priority as CAPAPriority,
      source: item.source as CAPASource,
      rootCause: item.root_cause,
      correctiveAction: item.corrective_action,
      preventiveAction: item.preventive_action,
      dueDate: item.due_date,
      assignedTo: item.assigned_to,
      createdBy: item.created_by,
      createdAt: item.created_at,
      lastUpdated: item.updated_at,
      effectivenessCriteria: item.effectiveness_criteria,
      sourceId: item.source_id
    }));
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

/**
 * Get a CAPA by ID
 * @param id CAPA ID
 * @returns CAPA object or null if not found
 */
export const getCAPAById = async (id: string): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw error;
    }

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
    console.error(`Error fetching CAPA with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update a CAPA
 * @param id CAPA ID
 * @param data Updated CAPA data
 * @returns Updated CAPA
 */
export const updateCAPA = async (id: string, data: Partial<CAPA>): Promise<CAPA> => {
  try {
    // Map frontend model to database schema
    const updates: any = {};
    
    if (data.title !== undefined) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.status !== undefined) updates.status = data.status;
    if (data.priority !== undefined) updates.priority = data.priority;
    if (data.source !== undefined) updates.source = data.source;
    if (data.rootCause !== undefined) updates.root_cause = data.rootCause;
    if (data.correctiveAction !== undefined) updates.corrective_action = data.correctiveAction;
    if (data.preventiveAction !== undefined) updates.preventive_action = data.preventiveAction;
    if (data.dueDate !== undefined) updates.due_date = data.dueDate;
    if (data.assignedTo !== undefined) updates.assigned_to = data.assignedTo;
    if (data.effectivenessCriteria !== undefined) updates.effectiveness_criteria = data.effectivenessCriteria;
    if (data.sourceId !== undefined) updates.source_id = data.sourceId;

    // Always update the last updated timestamp
    updates.updated_at = new Date().toISOString();

    const { data: updatedData, error } = await supabase
      .from('capa_actions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Map database record back to frontend model
    return {
      id: updatedData.id,
      title: updatedData.title,
      description: updatedData.description,
      status: updatedData.status as CAPAStatus,
      priority: updatedData.priority as CAPAPriority,
      source: updatedData.source as CAPASource,
      rootCause: updatedData.root_cause,
      correctiveAction: updatedData.corrective_action,
      preventiveAction: updatedData.preventive_action,
      dueDate: updatedData.due_date,
      assignedTo: updatedData.assigned_to,
      createdBy: updatedData.created_by,
      createdAt: updatedData.created_at,
      lastUpdated: updatedData.updated_at,
      effectivenessCriteria: updatedData.effectiveness_criteria,
      sourceId: updatedData.source_id
    };
  } catch (error) {
    console.error(`Error updating CAPA with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a CAPA
 * @param id CAPA ID
 * @returns boolean indicating success
 */
export const deleteCAPA = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting CAPA with ID ${id}:`, error);
    throw error;
  }
};

export default {
  createCAPA,
  getCAPAs,
  getCAPAById,
  updateCAPA,
  deleteCAPA
};
