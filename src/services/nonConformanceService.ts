
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

export interface NCAttachment {
  id: string;
  non_conformance_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  description?: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface NCActivity {
  id: string;
  non_conformance_id: string;
  action: string;
  performed_by: string;
  performed_at: string;
  previous_status?: string;
  new_status?: string;
  comments?: string;
}

export interface NCStats {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  byReason: Record<string, number>;
  totalQuantityOnHold: number;
  recentItems: NonConformance[];
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

// Attachment handling
export const fetchNCAttachments = async (nonConformanceId: string): Promise<NCAttachment[]> => {
  try {
    const { data, error } = await supabase
      .from('nc_attachments')
      .select('*')
      .eq('non_conformance_id', nonConformanceId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching NC attachments:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchNCAttachments:', error);
    throw error;
  }
};

export const uploadNCAttachment = async (
  nonConformanceId: string,
  file: File,
  description: string,
  userId: string
): Promise<NCAttachment> => {
  try {
    // Upload file to storage
    const filePath = `non-conformance/${nonConformanceId}/${file.name}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);

    if (storageError) {
      console.error('Error uploading file to storage:', storageError);
      throw storageError;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    // Create attachment record
    const { data, error } = await supabase
      .from('nc_attachments')
      .insert([
        {
          non_conformance_id: nonConformanceId,
          file_name: file.name,
          file_path: publicUrl,
          file_type: file.type,
          file_size: file.size,
          description: description,
          uploaded_by: userId,
          uploaded_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating attachment record:', error);
      throw error;
    }

    // Create activity for the file upload
    await createNCActivity({
      non_conformance_id: nonConformanceId,
      action: 'File uploaded',
      performed_by: userId,
      comments: `File "${file.name}" was uploaded`
    });

    return data;
  } catch (error) {
    console.error('Error in uploadNCAttachment:', error);
    throw error;
  }
};

export const deleteNCAttachment = async (attachmentId: string, userId: string): Promise<boolean> => {
  try {
    // Get attachment details
    const { data: attachmentData, error: fetchError } = await supabase
      .from('nc_attachments')
      .select('*')
      .eq('id', attachmentId)
      .single();

    if (fetchError) {
      console.error('Error fetching attachment details:', fetchError);
      throw fetchError;
    }

    // Delete file from storage
    const filePath = attachmentData.file_path.split('/').slice(-3).join('/');
    const { error: storageError } = await supabase.storage
      .from('attachments')
      .remove([filePath]);

    if (storageError) {
      console.warn('Error removing file from storage:', storageError);
      // Continue with record deletion even if storage delete fails
    }

    // Delete attachment record
    const { error } = await supabase
      .from('nc_attachments')
      .delete()
      .eq('id', attachmentId);

    if (error) {
      console.error('Error deleting attachment record:', error);
      throw error;
    }

    // Create activity for the file deletion
    await createNCActivity({
      non_conformance_id: attachmentData.non_conformance_id,
      action: 'File deleted',
      performed_by: userId,
      comments: `File "${attachmentData.file_name}" was deleted`
    });

    return true;
  } catch (error) {
    console.error('Error in deleteNCAttachment:', error);
    throw error;
  }
};

// Statistics and dashboard data
export const fetchNCStats = async (): Promise<NCStats> => {
  try {
    // Fetch all non-conformances
    const { data: nonConformances, error } = await supabase
      .from('non_conformances')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching non-conformances for stats:', error);
      throw error;
    }

    // Count by status
    const byStatus: Record<string, number> = {};
    // Count by category
    const byCategory: Record<string, number> = {};
    // Count by reason
    const byReason: Record<string, number> = {};
    // Calculate total quantity on hold
    let totalQuantityOnHold = 0;

    nonConformances.forEach((nc) => {
      // Count by status
      byStatus[nc.status] = (byStatus[nc.status] || 0) + 1;

      // Count by category
      const category = nc.item_category || 'Uncategorized';
      byCategory[category] = (byCategory[category] || 0) + 1;

      // Count by reason
      const reason = nc.reason_category || 'Unspecified';
      byReason[reason] = (byReason[reason] || 0) + 1;

      // Add to quantity on hold if status is 'On Hold'
      if (nc.status === 'On Hold' && nc.quantity) {
        totalQuantityOnHold += parseFloat(nc.quantity) || 0;
      }
    });

    // Get 5 most recent items
    const recentItems = nonConformances.slice(0, 5);

    return {
      total: nonConformances.length,
      byStatus,
      byCategory,
      byReason,
      totalQuantityOnHold,
      recentItems,
    };
  } catch (error) {
    console.error('Error in fetchNCStats:', error);
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
  generateCAPAFromNC,
  fetchNCAttachments,
  uploadNCAttachment,
  deleteNCAttachment,
  fetchNCStats
};
