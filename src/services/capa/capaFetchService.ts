
import { CAPA } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import { supabase } from '@/integrations/supabase/client';

export const fetchCAPAs = async (): Promise<CAPA[]> => {
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
      created_at: item.created_at,
      updated_at: item.updated_at,
      created_by: item.created_by,
      due_date: item.due_date,
      assigned_to: item.assigned_to,
      source: item.source as CAPASource,
      source_id: item.source_id,
      completion_date: item.completion_date,
      root_cause: item.root_cause,
      corrective_action: item.corrective_action,
      preventive_action: item.preventive_action,
      effectiveness_criteria: item.effectiveness_criteria,
      department: item.department,
      fsma204_compliant: item.fsma204_compliant,
      effectiveness_verified: item.effectiveness_verified,
      effectiveness_rating: item.effectiveness_rating,
      verification_date: item.verification_date,
      verification_method: item.verification_method,
      verified_by: item.verified_by,
    })) as CAPA[];
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    return [];
  }
};

export const fetchCAPAById = async (id: string): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`CAPA with ID ${id} not found`);

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status as CAPAStatus,
      priority: data.priority as CAPAPriority,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by,
      due_date: data.due_date,
      assigned_to: data.assigned_to,
      source: data.source as CAPASource,
      source_id: data.source_id,
      completion_date: data.completion_date,
      root_cause: data.root_cause,
      corrective_action: data.corrective_action,
      preventive_action: data.preventive_action,
      effectiveness_criteria: data.effectiveness_criteria,
      department: data.department,
      fsma204_compliant: data.fsma204_compliant,
      effectiveness_verified: data.effectiveness_verified,
      effectiveness_rating: data.effectiveness_rating,
      verification_date: data.verification_date,
      verification_method: data.verification_method,
      verified_by: data.verified_by,
    } as CAPA;
  } catch (error) {
    console.error('Error fetching CAPA by ID:', error);
    throw error;
  }
};

export const fetchCAPAsBySource = async (source: string, sourceId?: string): Promise<CAPA[]> => {
  try {
    let query = supabase
      .from('capa_actions')
      .select('*')
      .eq('source', source);

    if (sourceId) {
      query = query.eq('source_id', sourceId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status as CAPAStatus,
      priority: item.priority as CAPAPriority,
      created_at: item.created_at,
      updated_at: item.updated_at,
      created_by: item.created_by,
      due_date: item.due_date,
      assigned_to: item.assigned_to,
      source: item.source as CAPASource,
      source_id: item.source_id,
      completion_date: item.completion_date,
      root_cause: item.root_cause,
      corrective_action: item.corrective_action,
      preventive_action: item.preventive_action,
      effectiveness_criteria: item.effectiveness_criteria,
      department: item.department,
      fsma204_compliant: item.fsma204_compliant,
      effectiveness_verified: item.effectiveness_verified,
      effectiveness_rating: item.effectiveness_rating,
      verification_date: item.verification_date,
      verification_method: item.verification_method,
      verified_by: item.verified_by,
    })) as CAPA[];
  } catch (error) {
    console.error('Error fetching CAPAs by source:', error);
    return [];
  }
};

export default {
  fetchCAPAs,
  fetchCAPAById,
  fetchCAPAsBySource
};
