
import { supabase } from '@/integrations/supabase/client';
import { 
  NonConformance, 
  NCActivity, 
  NCAttachment, 
  NCStatus,
  NCStats
} from '@/types/non-conformance';

/**
 * Fetch all non-conformances
 */
export const fetchNonConformances = async (): Promise<NonConformance[]> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .order('reported_date', { ascending: false });

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

/**
 * Fetch a non-conformance by ID
 */
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

/**
 * Create a new non-conformance
 */
export const createNonConformance = async (nonConformance: Omit<NonConformance, 'id' | 'created_at' | 'updated_at'>): Promise<NonConformance> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .insert([nonConformance])
      .select()
      .single();

    if (error) {
      console.error('Error creating non-conformance:', error);
      throw error;
    }

    // Create activity record for creation
    await createNCActivity({
      non_conformance_id: data.id,
      action: 'Non-conformance created',
      performed_by: nonConformance.created_by
    });

    return data;
  } catch (error) {
    console.error('Error in createNonConformance:', error);
    throw error;
  }
};

/**
 * Update an existing non-conformance
 */
export const updateNonConformance = async (id: string, updates: Partial<NonConformance>, userId: string): Promise<NonConformance> => {
  try {
    // First get the current record to track changes
    const { data: current } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('id', id)
      .single();

    // Apply updates
    const { data, error } = await supabase
      .from('non_conformances')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating non-conformance:', error);
      throw error;
    }

    // Create activity record for update
    if (current && updates.status && current.status !== updates.status) {
      await createNCActivity({
        non_conformance_id: id,
        action: 'Status changed',
        performed_by: userId,
        previous_status: current.status,
        new_status: updates.status,
        comments: `Status changed from ${current.status} to ${updates.status}`
      });
    } else {
      await createNCActivity({
        non_conformance_id: id,
        action: 'Non-conformance updated',
        performed_by: userId
      });
    }

    return data;
  } catch (error) {
    console.error('Error in updateNonConformance:', error);
    throw error;
  }
};

/**
 * Update the status of a non-conformance
 */
export const updateNCStatus = async (id: string, newStatus: NCStatus, userId: string): Promise<void> => {
  try {
    // Get the current status first
    const { data: current, error: fetchError } = await supabase
      .from('non_conformances')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching current status:', fetchError);
      throw fetchError;
    }

    const previousStatus = current?.status;

    // Update the status
    const { error: updateError } = await supabase
      .from('non_conformances')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...(newStatus === 'Resolved' ? { resolution_date: new Date().toISOString() } : {}),
        ...(newStatus === 'Under Review' ? { review_date: new Date().toISOString() } : {})
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating status:', updateError);
      throw updateError;
    }

    // Record the status change
    await createNCActivity({
      non_conformance_id: id,
      action: 'Status changed',
      performed_by: userId,
      previous_status: previousStatus,
      new_status: newStatus,
      comments: `Status changed from ${previousStatus} to ${newStatus}`
    });
  } catch (error) {
    console.error('Error in updateNCStatus:', error);
    throw error;
  }
};

/**
 * Delete a non-conformance
 */
export const deleteNonConformance = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('non_conformances')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting non-conformance:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteNonConformance:', error);
    throw error;
  }
};

/**
 * Fetch activities for a non-conformance
 */
export const fetchNCActivities = async (nonConformanceId: string): Promise<NCActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('nc_activities')
      .select('*')
      .eq('non_conformance_id', nonConformanceId)
      .order('performed_at', { ascending: false });

    if (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchNCActivities:', error);
    throw error;
  }
};

/**
 * Create a new activity for a non-conformance
 */
export const createNCActivity = async (activity: Omit<NCActivity, 'id' | 'performed_at'>): Promise<NCActivity> => {
  try {
    const { data, error } = await supabase
      .from('nc_activities')
      .insert([activity])
      .select()
      .single();

    if (error) {
      console.error('Error creating activity:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createNCActivity:', error);
    throw error;
  }
};

/**
 * Fetch attachments for a non-conformance
 */
export const fetchNCAttachments = async (nonConformanceId: string): Promise<NCAttachment[]> => {
  try {
    const { data, error } = await supabase
      .from('nc_attachments')
      .select('*')
      .eq('non_conformance_id', nonConformanceId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching attachments:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchNCAttachments:', error);
    throw error;
  }
};

/**
 * Upload an attachment for a non-conformance
 */
export const uploadNCAttachment = async (
  nonConformanceId: string,
  file: File,
  description: string,
  uploadedBy: string
): Promise<NCAttachment> => {
  try {
    // First upload the file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${nonConformanceId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(fileName);

    // Create the attachment record
    const attachment = {
      non_conformance_id: nonConformanceId,
      file_name: file.name,
      file_path: publicUrl,
      file_size: file.size,
      file_type: file.type,
      description,
      uploaded_by: uploadedBy
    };

    const { data, error } = await supabase
      .from('nc_attachments')
      .insert([attachment])
      .select()
      .single();

    if (error) {
      console.error('Error creating attachment record:', error);
      throw error;
    }

    // Create activity record for the upload
    await createNCActivity({
      non_conformance_id: nonConformanceId,
      action: 'Attachment uploaded',
      performed_by: uploadedBy,
      comments: `Uploaded file: ${file.name}`
    });

    return data;
  } catch (error) {
    console.error('Error in uploadNCAttachment:', error);
    throw error;
  }
};

/**
 * Fetch statistics for non-conformances
 */
export const fetchNCStats = async (): Promise<NCStats> => {
  try {
    // Get all non-conformances
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .order('reported_date', { ascending: false });

    if (error) {
      console.error('Error fetching data for stats:', error);
      throw error;
    }

    const nonConformances = data || [];
    
    // Initialize stats object
    const stats: NCStats = {
      total: nonConformances.length,
      totalQuantityOnHold: 0,
      byStatus: {} as Record<NCStatus, number>,
      byCategory: {},
      byReason: {},
      recentItems: nonConformances.slice(0, 5)
    };

    // Calculate statistics
    nonConformances.forEach(nc => {
      // Total quantity on hold
      if (nc.quantity_on_hold) {
        stats.totalQuantityOnHold += Number(nc.quantity_on_hold);
      }
      
      // By status
      if (nc.status) {
        stats.byStatus[nc.status] = (stats.byStatus[nc.status] || 0) + 1;
      }
      
      // By category
      if (nc.item_category) {
        stats.byCategory[nc.item_category] = (stats.byCategory[nc.item_category] || 0) + 1;
      }
      
      // By reason
      if (nc.reason_category) {
        stats.byReason[nc.reason_category] = (stats.byReason[nc.reason_category] || 0) + 1;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error in fetchNCStats:', error);
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
  fetchNCActivities,
  createNCActivity,
  fetchNCAttachments,
  uploadNCAttachment,
  fetchNCStats
};
