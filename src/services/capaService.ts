
import { CAPA } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';
import { supabase } from '@/integrations/supabase/client';
import { convertDatabaseCAPAToModel } from '@/utils/typeAdapters';

export async function getCAPAs(): Promise<CAPA[]> {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(convertDatabaseCAPAToModel);
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    return [];
  }
}

export async function getCAPAById(id: string): Promise<CAPA | null> {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return convertDatabaseCAPAToModel(data);
  } catch (error) {
    console.error(`Error fetching CAPA with ID ${id}:`, error);
    return null;
  }
}

export async function createCAPA(capaData: Partial<CAPA>): Promise<CAPA | null> {
  try {
    // Convert our CAPA object to the database schema
    const dbCapa = {
      title: capaData.title,
      description: capaData.description,
      status: capaData.status || CAPAStatus.Open,
      priority: capaData.priority,
      source: capaData.source,
      source_id: capaData.source_id,
      assigned_to: capaData.assigned_to,
      created_by: capaData.created_by,
      due_date: capaData.due_date,
      root_cause: capaData.root_cause,
      corrective_action: capaData.corrective_action,
      preventive_action: capaData.preventive_action,
      effectiveness_criteria: capaData.effectiveness_criteria,
      department: capaData.department,
      fsma204_compliant: capaData.fsma204_compliant || false
    };

    const { data, error } = await supabase
      .from('capa_actions')
      .insert(dbCapa)
      .select()
      .single();

    if (error) throw error;

    return convertDatabaseCAPAToModel(data);
  } catch (error) {
    console.error('Error creating CAPA:', error);
    return null;
  }
}

export async function updateCAPA(id: string, capaData: Partial<CAPA>): Promise<CAPA | null> {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .update({
        title: capaData.title,
        description: capaData.description,
        status: capaData.status,
        priority: capaData.priority,
        source: capaData.source,
        assigned_to: capaData.assigned_to,
        due_date: capaData.due_date,
        root_cause: capaData.root_cause,
        corrective_action: capaData.corrective_action,
        preventive_action: capaData.preventive_action,
        effectiveness_criteria: capaData.effectiveness_criteria,
        department: capaData.department,
        fsma204_compliant: capaData.fsma204_compliant,
        completion_date: capaData.completion_date,
        verification_method: capaData.verification_method,
        effectiveness_rating: capaData.effectiveness_rating,
        verified_by: capaData.verified_by,
        verification_date: capaData.verification_date,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return convertDatabaseCAPAToModel(data);
  } catch (error) {
    console.error(`Error updating CAPA with ID ${id}:`, error);
    return null;
  }
}

export async function deleteCAPA(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error(`Error deleting CAPA with ID ${id}:`, error);
    return false;
  }
}

// Function to map a complaint to a CAPA for complaint management
export function mapComplaintToDb(complaintData: any): Partial<CAPA> {
  return {
    title: `CAPA for Complaint: ${complaintData.title || 'Untitled Complaint'}`,
    description: complaintData.description || '',
    source: 'Customer_Complaint',
    source_id: complaintData.id,
    status: CAPAStatus.Open,
    priority: complaintData.severity || 'Medium',
    created_by: complaintData.created_by || 'System',
    department: complaintData.department || '',
    due_date: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 14); // Default to 14 days from now
      return date.toISOString();
    })()
  };
}
