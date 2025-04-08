
import { supabase } from '@/integrations/supabase/client';

// Define some types to match what the existing code is expecting
export type NCStatus = 'On Hold' | 'Open' | 'Under Review' | 'Resolved' | 'Closed';

export interface NonConformance {
  id: string;
  title: string;
  description?: string;
  itemName: string;
  itemCategory: string;
  reasonCategory?: string;
  status: NCStatus;
  reportedDate: string;
  createdBy: string;
  assignedTo?: string;
  capa_id?: string;
  risk_level?: string;
  priority?: string;
  [key: string]: any; // Allow additional properties
}

// Basic CRUD operations
export const fetchNonConformances = async (): Promise<NonConformance[]> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching non-conformances:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchNonConformances:', error);
    throw error;
  }
};

export const fetchNonConformanceById = async (id: string): Promise<NonConformance | null> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching non-conformance by ID:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchNonConformanceById:', error);
    throw error;
  }
};

export const createNonConformance = async (nonConformance: Partial<NonConformance>): Promise<NonConformance> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .insert([{
        ...nonConformance,
        reported_date: new Date().toISOString(),
        status: 'On Hold'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating non-conformance:', error);
      throw error;
    }

    // Create initial activity
    await createNCActivity({
      non_conformance_id: data.id,
      action: 'Created',
      performed_by: nonConformance.createdBy || 'system',
      comments: 'Non-conformance record created'
    });

    return data;
  } catch (error) {
    console.error('Error in createNonConformance:', error);
    throw error;
  }
};

export const updateNonConformance = async (id: string, updates: Partial<NonConformance>, userId: string): Promise<NonConformance> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating non-conformance:', error);
      throw error;
    }

    // Create activity for the update
    await createNCActivity({
      non_conformance_id: id,
      action: 'Updated',
      performed_by: userId,
      comments: 'Non-conformance details updated'
    });

    return data;
  } catch (error) {
    console.error('Error in updateNonConformance:', error);
    throw error;
  }
};

export const updateNCStatus = async (id: string, newStatus: NCStatus, userId: string): Promise<NonConformance> => {
  try {
    // Get current status
    const { data: currentData } = await supabase
      .from('non_conformances')
      .select('status')
      .eq('id', id)
      .single();

    const oldStatus = currentData?.status;

    // Update status
    const { data, error } = await supabase
      .from('non_conformances')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...((newStatus === 'Resolved' || newStatus === 'Closed') ? { resolution_date: new Date().toISOString() } : {})
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating non-conformance status:', error);
      throw error;
    }

    // Create activity for the status change
    await createNCActivity({
      non_conformance_id: id,
      action: 'Status changed',
      performed_by: userId,
      previous_status: oldStatus,
      new_status: newStatus,
      comments: `Status changed from ${oldStatus} to ${newStatus}`
    });

    return data;
  } catch (error) {
    console.error('Error in updateNCStatus:', error);
    throw error;
  }
};

export const deleteNonConformance = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('non_conformances')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting non-conformance:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteNonConformance:', error);
    throw error;
  }
};

// Activity tracking
export const createNCActivity = async (activity: any): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('nc_activities')
      .insert([{
        ...activity,
        performed_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating NC activity:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createNCActivity:', error);
    throw error;
  }
};

export const fetchNCActivities = async (nonConformanceId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('nc_activities')
      .select('*')
      .eq('non_conformance_id', nonConformanceId)
      .order('performed_at', { ascending: false });

    if (error) {
      console.error('Error fetching NC activities:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchNCActivities:', error);
    throw error;
  }
};

// CAPA Integration
export const generateCAPAFromNC = async (nonConformanceId: string): Promise<any> => {
  try {
    // Get the NC details
    const { data: ncData, error: ncError } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('id', nonConformanceId)
      .single();

    if (ncError) throw ncError;

    // Create a CAPA
    const { data: capaData, error: capaError } = await supabase
      .from('capa_actions')
      .insert([{
        title: `CAPA for ${ncData.title}`,
        description: ncData.description || '',
        source: 'non_conformance',
        source_id: nonConformanceId,
        priority: ncData.priority || 'medium',
        status: 'Open',
        created_by: ncData.created_by,
        assigned_to: ncData.assigned_to || ncData.created_by,
        department: ncData.department,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
      }])
      .select()
      .single();

    if (capaError) throw capaError;

    // Update the NC with the CAPA ID
    const { error: updateError } = await supabase
      .from('non_conformances')
      .update({ capa_id: capaData.id })
      .eq('id', nonConformanceId);

    if (updateError) throw updateError;

    // Log activity
    await createNCActivity({
      non_conformance_id: nonConformanceId,
      action: 'CAPA Generated',
      performed_by: ncData.created_by,
      comments: `CAPA ${capaData.id} generated from this non-conformance`
    });

    return capaData;
  } catch (error) {
    console.error('Error in generateCAPAFromNC:', error);
    throw error;
  }
};

export default {
  fetchNonConformances,
  fetchNonConformanceById,
  createNonConformance,
  updateNonConformance,
  updateNCStatus,
  deleteNonConformance,
  createNCActivity,
  fetchNCActivities,
  generateCAPAFromNC
};
