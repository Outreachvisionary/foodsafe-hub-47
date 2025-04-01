
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NCStatus, NCItemCategory, NCReasonCategory } from '@/types/non-conformance';

export interface NonConformance {
  id: string;
  title: string;
  description: string;
  item_name: string;
  item_id?: string;
  item_category: NCItemCategory;
  reason_category: NCReasonCategory;
  reason_details?: string;
  reported_date: string;
  status: NCStatus;
  assigned_to?: string;
  reviewer?: string;
  location?: string;
  department?: string;
  priority?: string;
  risk_level?: string;
  quantity?: number;
  quantity_on_hold?: number;
  units?: string;
  resolution_details?: string;
  resolution_date?: string;
  review_date?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  capa_id?: string;
  tags?: string[];
}

export interface NCActivity {
  id: string;
  non_conformance_id: string;
  action: string;
  comments?: string;
  performed_by: string;
  performed_at?: string;
  previous_status?: NCStatus;
  new_status?: NCStatus;
}

export interface NCAttachment {
  id: string;
  non_conformance_id: string;
  file_name: string;
  file_type: string;
  file_path: string;
  file_size: number;
  description?: string;
  uploaded_by: string;
  uploaded_at?: string;
}

export interface NCStats {
  total: number;
  totalQuantityOnHold: number;
  byStatus: Record<NCStatus, number>;
  byCategory: Record<string, number>;
  byReason: Record<string, number>;
  recentItems: NonConformance[];
}

// Fetch statistics for NC dashboard
export const fetchNCStats = async (): Promise<NCStats> => {
  try {
    const { data: nonConformances, error } = await supabase
      .from('non_conformances')
      .select('*')
      .order('reported_date', { ascending: false });
      
    if (error) throw error;
    
    // Calculate statistics
    const stats: NCStats = {
      total: nonConformances.length,
      totalQuantityOnHold: nonConformances.reduce((sum, nc) => sum + (nc.quantity_on_hold || 0), 0),
      byStatus: {} as Record<NCStatus, number>,
      byCategory: {},
      byReason: {},
      recentItems: nonConformances.slice(0, 5) as NonConformance[]
    };
    
    // Initialize status counters
    const statusValues: NCStatus[] = ['On Hold', 'Under Review', 'Released', 'Disposed'];
    statusValues.forEach(status => {
      stats.byStatus[status] = 0;
    });
    
    // Count items by status, category, and reason
    nonConformances.forEach(nc => {
      // Count by status
      if (stats.byStatus[nc.status as NCStatus] !== undefined) {
        stats.byStatus[nc.status as NCStatus]++;
      }
      
      // Count by category
      if (!stats.byCategory[nc.item_category]) {
        stats.byCategory[nc.item_category] = 0;
      }
      stats.byCategory[nc.item_category]++;
      
      // Count by reason
      if (!stats.byReason[nc.reason_category]) {
        stats.byReason[nc.reason_category] = 0;
      }
      stats.byReason[nc.reason_category]++;
    });
    
    return stats;
  } catch (error) {
    console.error('Error fetching NC statistics:', error);
    toast.error('Failed to load non-conformance statistics');
    throw error;
  }
};

// Fetch non-conformances
export const fetchNonConformances = async (): Promise<NonConformance[]> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .order('reported_date', { ascending: false });
      
    if (error) throw error;
    
    return data as NonConformance[] || [];
  } catch (error) {
    console.error('Error fetching non-conformances:', error);
    toast.error('Failed to load non-conformances');
    throw error;
  }
};

// Fetch a single non-conformance by ID
export const fetchNonConformanceById = async (id: string): Promise<NonConformance | null> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data as NonConformance;
  } catch (error) {
    console.error(`Error fetching non-conformance with ID ${id}:`, error);
    toast.error('Failed to load non-conformance details');
    throw error;
  }
};

// Create a new non-conformance
export const createNonConformance = async (nonConformance: Omit<NonConformance, 'id'>): Promise<NonConformance> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .insert(nonConformance)
      .select()
      .single();
      
    if (error) throw error;
    
    // Record the creation activity
    await createNCActivity({
      non_conformance_id: data.id,
      action: 'Created non-conformance record',
      performed_by: nonConformance.created_by,
      new_status: nonConformance.status
    });
    
    return data as NonConformance;
  } catch (error) {
    console.error('Error creating non-conformance:', error);
    toast.error('Failed to create non-conformance record');
    throw error;
  }
};

// Update an existing non-conformance
export const updateNonConformance = async (id: string, updates: Partial<NonConformance>): Promise<NonConformance> => {
  try {
    // Get the current status before updating
    const { data: current } = await supabase
      .from('non_conformances')
      .select('status')
      .eq('id', id)
      .single();
      
    const previousStatus = current?.status as NCStatus;
    
    // Update the non-conformance
    const { data, error } = await supabase
      .from('non_conformances')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // If status changed, record the activity
    if (updates.status && updates.status !== previousStatus) {
      await createNCActivity({
        non_conformance_id: id,
        action: `Status changed from ${previousStatus} to ${updates.status}`,
        performed_by: updates.assigned_to || 'System',
        previous_status: previousStatus,
        new_status: updates.status
      });
    }
    
    return data as NonConformance;
  } catch (error) {
    console.error(`Error updating non-conformance with ID ${id}:`, error);
    toast.error('Failed to update non-conformance record');
    throw error;
  }
};

// Update NC status specifically
export const updateNCStatus = async (id: string, newStatus: NCStatus, updatedBy: string): Promise<NonConformance> => {
  try {
    return await updateNonConformance(id, { 
      status: newStatus,
      updated_at: new Date().toISOString(),
      assigned_to: updatedBy
    });
  } catch (error) {
    console.error(`Error updating status for non-conformance with ID ${id}:`, error);
    toast.error('Failed to update non-conformance status');
    throw error;
  }
};

// Update NC quantity specifically
export const updateNCQuantity = async (id: string, quantity: number, quantityOnHold: number, updatedBy: string): Promise<NonConformance> => {
  try {
    return await updateNonConformance(id, { 
      quantity,
      quantity_on_hold: quantityOnHold,
      updated_at: new Date().toISOString(),
      assigned_to: updatedBy
    });
  } catch (error) {
    console.error(`Error updating quantities for non-conformance with ID ${id}:`, error);
    toast.error('Failed to update non-conformance quantities');
    throw error;
  }
};

// Delete a non-conformance
export const deleteNonConformance = async (id: string): Promise<void> => {
  try {
    // First delete any related activities
    await supabase
      .from('nc_activities')
      .delete()
      .eq('non_conformance_id', id);
      
    // Then delete any related attachments
    await supabase
      .from('nc_attachments')
      .delete()
      .eq('non_conformance_id', id);
      
    // Finally delete the non-conformance
    const { error } = await supabase
      .from('non_conformances')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting non-conformance with ID ${id}:`, error);
    toast.error('Failed to delete non-conformance record');
    throw error;
  }
};

// Create a new activity record
export const createNCActivity = async (activity: Omit<NCActivity, 'id'>): Promise<NCActivity> => {
  try {
    const { data, error } = await supabase
      .from('nc_activities')
      .insert({
        ...activity,
        performed_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data as NCActivity;
  } catch (error) {
    console.error('Error creating activity record:', error);
    // Don't show toast for this as it's a background operation
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
      
    if (error) throw error;
    
    return data as NCActivity[] || [];
  } catch (error) {
    console.error(`Error fetching activities for non-conformance with ID ${nonConformanceId}:`, error);
    toast.error('Failed to load activity history');
    throw error;
  }
};

// Upload an attachment for a non-conformance
export const uploadNCAttachment = async (
  nonConformanceId: string,
  file: File,
  description: string,
  uploadedBy: string
): Promise<NCAttachment> => {
  try {
    // First upload the file to storage
    const timestamp = new Date().getTime();
    const filePath = `non-conformances/${nonConformanceId}/${timestamp}_${file.name}`;
    
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: urlData } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
      
    // Create the attachment record
    const { data, error } = await supabase
      .from('nc_attachments')
      .insert({
        non_conformance_id: nonConformanceId,
        file_name: file.name,
        file_type: file.type,
        file_path: urlData.publicUrl,
        file_size: file.size,
        description,
        uploaded_by: uploadedBy,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Create an activity record for the upload
    await createNCActivity({
      non_conformance_id: nonConformanceId,
      action: `Attached file: ${file.name}`,
      performed_by: uploadedBy
    });
    
    return data as NCAttachment;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    toast.error('Failed to upload attachment');
    throw error;
  }
};

// Fetch attachments for a non-conformance
export const fetchNCAttachments = async (nonConformanceId: string): Promise<NCAttachment[]> => {
  try {
    const { data, error } = await supabase
      .from('nc_attachments')
      .select('*')
      .eq('non_conformance_id', nonConformanceId)
      .order('uploaded_at', { ascending: false });
      
    if (error) throw error;
    
    return data as NCAttachment[] || [];
  } catch (error) {
    console.error(`Error fetching attachments for non-conformance with ID ${nonConformanceId}:`, error);
    toast.error('Failed to load attachments');
    throw error;
  }
};

// Delete an attachment
export const deleteNCAttachment = async (attachmentId: string, nonConformanceId: string): Promise<void> => {
  try {
    // Get the attachment details first for the file path
    const { data: attachment, error: fetchError } = await supabase
      .from('nc_attachments')
      .select('file_path, file_name, uploaded_by')
      .eq('id', attachmentId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Delete the record
    const { error } = await supabase
      .from('nc_attachments')
      .delete()
      .eq('id', attachmentId);
      
    if (error) throw error;
    
    // Try to delete the file from storage if we can parse the path
    try {
      const url = new URL(attachment.file_path);
      const path = url.pathname.split('/').slice(2).join('/'); // Remove /storage/v1/object/public/ prefix
      
      await supabase.storage
        .from('documents')
        .remove([path]);
    } catch (storageError) {
      console.error('Unable to delete file from storage:', storageError);
      // Continue even if storage deletion fails
    }
    
    // Create activity record for the deletion
    await createNCActivity({
      non_conformance_id: nonConformanceId,
      action: `Deleted attachment: ${attachment.file_name}`,
      performed_by: attachment.uploaded_by
    });
  } catch (error) {
    console.error(`Error deleting attachment with ID ${attachmentId}:`, error);
    toast.error('Failed to delete attachment');
    throw error;
  }
};

// Get documents related to a non-conformance
export const getDocumentsRelatedToNC = async (nonConformanceId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('module_relationships')
      .select(`
        *,
        documents:target_id (*)
      `)
      .eq('source_id', nonConformanceId)
      .eq('source_type', 'non_conformances')
      .eq('target_type', 'documents');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching documents related to NC ${nonConformanceId}:`, error);
    toast.error('Failed to load related documents');
    throw error;
  }
};

// Get training sessions related to a non-conformance
export const getTrainingRelatedToNC = async (nonConformanceId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('module_relationships')
      .select(`
        *,
        training_sessions:target_id (*)
      `)
      .eq('source_id', nonConformanceId)
      .eq('source_type', 'non_conformances')
      .eq('target_type', 'training_sessions');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching training related to NC ${nonConformanceId}:`, error);
    toast.error('Failed to load related training sessions');
    throw error;
  }
};

// Get audits related to a non-conformance
export const getAuditsRelatedToNC = async (nonConformanceId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('module_relationships')
      .select(`
        *,
        audits:target_id (*)
      `)
      .eq('source_id', nonConformanceId)
      .eq('source_type', 'non_conformances')
      .eq('target_type', 'audits');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching audits related to NC ${nonConformanceId}:`, error);
    toast.error('Failed to load related audits');
    throw error;
  }
};

export default {
  fetchNonConformances,
  fetchNonConformanceById,
  createNonConformance,
  updateNonConformance,
  deleteNonConformance,
  createNCActivity,
  fetchNCActivities,
  uploadNCAttachment,
  fetchNCAttachments,
  deleteNCAttachment,
  fetchNCStats,
  updateNCStatus,
  updateNCQuantity,
  getDocumentsRelatedToNC,
  getTrainingRelatedToNC,
  getAuditsRelatedToNC
};
