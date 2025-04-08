import { supabase } from '@/integrations/supabase/client';
import { 
  NonConformance, 
  NCActivity, 
  NCFilter, 
  NCStats,
  NCAttachment,
  NCStatus
} from '@/types/non-conformance';

// Re-export types for components to use
export type { NonConformance, NCActivity, NCFilter, NCStats, NCAttachment };

// Fetch all non-conformances
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

// Fetch a single non-conformance by ID
export const fetchNonConformanceById = async (id: string): Promise<NonConformance> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching non-conformance with ID ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`Non-conformance with ID ${id} not found`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error in fetchNonConformanceById for ID ${id}:`, error);
    throw error;
  }
};

// Create a new non-conformance
export const createNonConformance = async (nonConformance: Omit<NonConformance, 'id'>): Promise<NonConformance> => {
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
    
    if (!data) {
      throw new Error('Failed to create non-conformance');
    }
    
    // Log the activity
    await logNCActivity({
      non_conformance_id: data.id,
      action: 'Created',
      performed_by: nonConformance.created_by,
      new_status: nonConformance.status,
    });
    
    return data;
  } catch (error) {
    console.error('Error in createNonConformance:', error);
    throw error;
  }
};

// Update an existing non-conformance
export const updateNonConformance = async (
  id: string, 
  updates: Partial<NonConformance>,
  userId: string
): Promise<NonConformance> => {
  try {
    // Fetch the current state first to track changes
    const current = await fetchNonConformanceById(id);
    
    const { data, error } = await supabase
      .from('non_conformances')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating non-conformance with ID ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`Failed to update non-conformance with ID ${id}`);
    }
    
    // Log activity if status changed
    if (updates.status && updates.status !== current.status) {
      await logNCActivity({
        non_conformance_id: id,
        action: `Status changed from ${current.status} to ${updates.status}`,
        performed_by: userId,
        previous_status: current.status,
        new_status: updates.status,
        comments: updates.resolution_details,
      });
    }
    
    return data;
  } catch (error) {
    console.error(`Error in updateNonConformance for ID ${id}:`, error);
    throw error;
  }
};

// Delete a non-conformance
export const deleteNonConformance = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('non_conformances')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting non-conformance with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in deleteNonConformance for ID ${id}:`, error);
    throw error;
  }
};

// Update NC status
export const updateNCStatus = async (
  id: string,
  newStatus: NCStatus,
  userId: string
): Promise<NonConformance> => {
  try {
    // Get current NC to store previous status
    const current = await fetchNonConformanceById(id);
    
    // Update the status
    const { data, error } = await supabase
      .from('non_conformances')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating status for non-conformance with ID ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`Failed to update status for non-conformance with ID ${id}`);
    }
    
    // Log the status change
    await logNCActivity({
      non_conformance_id: id,
      action: `Status changed from ${current.status} to ${newStatus}`,
      performed_by: userId,
      previous_status: current.status,
      new_status: newStatus,
    });
    
    return data;
  } catch (error) {
    console.error(`Error in updateNCStatus for ID ${id}:`, error);
    throw error;
  }
};

// Create NC activity
export const createNCActivity = async (activity: {
  non_conformance_id: string;
  action: string;
  performed_by: string;
}): Promise<NCActivity> => {
  try {
    const { data, error } = await supabase
      .from('nc_activities')
      .insert([activity])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating NC activity:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to create NC activity');
    }
    
    return data;
  } catch (error) {
    console.error('Error in createNCActivity:', error);
    throw error;
  }
};

// Log an activity for a non-conformance
export const logNCActivity = async (activity: Omit<NCActivity, 'id' | 'performed_at'>): Promise<NCActivity> => {
  try {
    const { data, error } = await supabase
      .from('nc_activities')
      .insert([activity])
      .select()
      .single();
      
    if (error) {
      console.error('Error logging NC activity:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to log NC activity');
    }
    
    return data;
  } catch (error) {
    console.error('Error in logNCActivity:', error);
    throw error;
  }
};

// Fetch activities for a non-conformance
export const fetchNCActivities = async (nonConformanceId: string): Promise<NCActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('nc_activities')
      .select('*')
      .eq('non_conformance_id', nonConformanceId)
      .order('performed_at', { ascending: false });
      
    if (error) {
      console.error(`Error fetching activities for non-conformance with ID ${nonConformanceId}:`, error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error in fetchNCActivities for ID ${nonConformanceId}:`, error);
    throw error;
  }
};

// Filter non-conformances based on criteria
export const filterNonConformances = async (filter: NCFilter): Promise<NonConformance[]> => {
  try {
    let query = supabase
      .from('non_conformances')
      .select('*');
      
    if (filter.status && filter.status.length > 0) {
      query = query.in('status', filter.status);
    }
    
    if (filter.item_category && filter.item_category.length > 0) {
      query = query.in('item_category', filter.item_category);
    }
    
    if (filter.reason_category && filter.reason_category.length > 0) {
      query = query.in('reason_category', filter.reason_category);
    }
    
    if (filter.date_range) {
      if (filter.date_range.start) {
        query = query.gte('reported_date', filter.date_range.start);
      }
      if (filter.date_range.end) {
        query = query.lte('reported_date', filter.date_range.end);
      }
    }
    
    if (filter.search) {
      query = query.or(`title.ilike.%${filter.search}%,item_name.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
    }
    
    const { data, error } = await query.order('reported_date', { ascending: false });
    
    if (error) {
      console.error('Error filtering non-conformances:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in filterNonConformances:', error);
    throw error;
  }
};

// Fetch statistics for non-conformances
export const fetchNCStats = async (): Promise<NCStats> => {
  try {
    const nonConformances = await fetchNonConformances();
    
    const stats: NCStats = {
      total: nonConformances.length,
      totalQuantityOnHold: 0,
      byStatus: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byReason: {} as Record<string, number>,
      recentItems: nonConformances.slice(0, 5)
    };
    
    nonConformances.forEach(nc => {
      // Count by status
      stats.byStatus[nc.status] = (stats.byStatus[nc.status] || 0) + 1;
      
      // Count by category
      stats.byCategory[nc.item_category] = (stats.byCategory[nc.item_category] || 0) + 1;
      
      // Count by reason
      stats.byReason[nc.reason_category] = (stats.byReason[nc.reason_category] || 0) + 1;
      
      // Sum quantity on hold
      if (nc.quantity_on_hold) {
        stats.totalQuantityOnHold += nc.quantity_on_hold;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error in fetchNCStats:', error);
    throw error;
  }
};

export const fetchNCAttachments = async (nonConformanceId: string): Promise<NCAttachment[]> => {
  try {
    const { data, error } = await supabase
      .from('nc_attachments')
      .select('*')
      .eq('non_conformance_id', nonConformanceId)
      .order('uploaded_at', { ascending: false });
      
    if (error) {
      console.error(`Error fetching attachments for non-conformance with ID ${nonConformanceId}:`, error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error in fetchNCAttachments for ID ${nonConformanceId}:`, error);
    throw error;
  }
};

export const uploadNCAttachment = async (
  nonConformanceId: string,
  file: File,
  description: string,
  uploadedBy: string
): Promise<NCAttachment> => {
  try {
    // First upload the file to storage
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `non-conformance/${nonConformanceId}/${fileName}`;
    
    const { data: fileData, error: fileError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);
      
    if (fileError) {
      console.error('Error uploading file:', fileError);
      throw fileError;
    }
    
    // Then create a record in the database
    const attachmentData = {
      non_conformance_id: nonConformanceId,
      file_name: fileName,
      file_path: filePath,
      file_type: file.type,
      file_size: file.size,
      description,
      uploaded_by: uploadedBy
    };
    
    const { data, error } = await supabase
      .from('nc_attachments')
      .insert([attachmentData])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating attachment record:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to create attachment record');
    }
    
    return data;
  } catch (error) {
    console.error(`Error in uploadNCAttachment for NC ID ${nonConformanceId}:`, error);
    throw error;
  }
};

export const deleteNCAttachment = async (attachmentId: string): Promise<void> => {
  try {
    // First get the attachment to know the file path
    const { data: attachment, error: fetchError } = await supabase
      .from('nc_attachments')
      .select('*')
      .eq('id', attachmentId)
      .single();
      
    if (fetchError) {
      console.error(`Error fetching attachment with ID ${attachmentId}:`, fetchError);
      throw fetchError;
    }
    
    if (!attachment) {
      throw new Error(`Attachment with ID ${attachmentId} not found`);
    }
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('attachments')
      .remove([attachment.file_path]);
      
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue anyway to delete the database record
    }
    
    // Delete the record from the database
    const { error } = await supabase
      .from('nc_attachments')
      .delete()
      .eq('id', attachmentId);
      
    if (error) {
      console.error(`Error deleting attachment record with ID ${attachmentId}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in deleteNCAttachment for ID ${attachmentId}:`, error);
    throw error;
  }
};

// Generate CAPA from non-conformance
export const generateCAPAFromNC = async (nonConformanceId: string): Promise<{ id: string }> => {
  try {
    const nc = await fetchNonConformanceById(nonConformanceId);
    
    // Create a CAPA based on the nonconformance
    const { data, error } = await supabase
      .from('capa_actions')
      .insert({
        title: `CAPA for ${nc.title}`,
        description: nc.description || '',
        source: 'non_conformance',
        sourceId: nonConformanceId,
        priority: nc.priority || 'medium',
        status: 'Open',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignedTo: nc.assigned_to || nc.created_by,
        department: nc.department,
        rootCause: '',
        correctiveAction: '',
        preventiveAction: '',
        createdBy: nc.created_by
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error generating CAPA from non-conformance:', error);
      throw error;
    }
    
    // Update the non-conformance with the new CAPA ID
    await supabase
      .from('non_conformances')
      .update({ capa_id: data.id })
      .eq('id', nonConformanceId);
      
    return { id: data.id };
  } catch (error) {
    console.error('Error in generateCAPAFromNC:', error);
    throw error;
  }
};

// Create a default export for compatibility
const nonConformanceService = {
  fetchNonConformances,
  fetchNonConformanceById,
  createNonConformance,
  updateNonConformance,
  deleteNonConformance,
  logNCActivity,
  fetchNCActivities,
  filterNonConformances,
  fetchNCStats,
  fetchNCAttachments,
  uploadNCAttachment,
  deleteNCAttachment,
  updateNCStatus,
  createNCActivity,
  generateCAPAFromNC
};

export default nonConformanceService;
