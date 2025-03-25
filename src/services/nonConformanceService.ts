
import { supabase } from '@/integrations/supabase/client';
import { 
  NonConformance, 
  NCAttachment, 
  NCActivity, 
  NCNotification,
  NCStats,
  NCFilter
} from '@/types/non-conformance';

// Non-Conformance CRUD operations
export const fetchNonConformances = async (filters?: NCFilter): Promise<NonConformance[]> => {
  let query = supabase
    .from('non_conformances')
    .select('*');
  
  // Apply filters if provided
  if (filters) {
    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }
    
    if (filters.item_category && filters.item_category.length > 0) {
      query = query.in('item_category', filters.item_category);
    }
    
    if (filters.reason_category && filters.reason_category.length > 0) {
      query = query.in('reason_category', filters.reason_category);
    }
    
    if (filters.date_range) {
      if (filters.date_range.start) {
        query = query.gte('reported_date', filters.date_range.start);
      }
      if (filters.date_range.end) {
        query = query.lte('reported_date', filters.date_range.end);
      }
    }
    
    if (filters.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }
    
    if (filters.location) {
      query = query.eq('location', filters.location);
    }
    
    if (filters.department) {
      query = query.eq('department', filters.department);
    }
    
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,item_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching non-conformances:', error);
    throw error;
  }
  
  return data as NonConformance[];
};

export const fetchNonConformanceById = async (id: string): Promise<NonConformance> => {
  const { data, error } = await supabase
    .from('non_conformances')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching non-conformance with ID ${id}:`, error);
    throw error;
  }
  
  return data as NonConformance;
};

export const createNonConformance = async (nonConformance: Omit<NonConformance, 'id'>): Promise<NonConformance> => {
  const { data, error } = await supabase
    .from('non_conformances')
    .insert(nonConformance)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating non-conformance:', error);
    throw error;
  }
  
  return data as NonConformance;
};

export const updateNonConformance = async (id: string, updates: Partial<NonConformance>): Promise<NonConformance> => {
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
    console.error(`Error updating non-conformance with ID ${id}:`, error);
    throw error;
  }
  
  return data as NonConformance;
};

export const deleteNonConformance = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('non_conformances')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting non-conformance with ID ${id}:`, error);
    throw error;
  }
};

// Update non-conformance status with activity tracking
export const update_nc_status = async (
  id: string, 
  newStatus: NonConformance['status'], 
  currentStatus: NonConformance['status'],
  userId: string,
  comments?: string
): Promise<NonConformance> => {
  // Start a transaction
  const { data, error } = await supabase.rpc('update_nc_status', {
    nc_id: id,
    new_status: newStatus,
    user_id: userId,
    comment: comments || '', // Fix: Use empty string instead of null/undefined
    prev_status: currentStatus
  });

  if (error) {
    console.error(`Error updating status for non-conformance ${id}:`, error);
    throw error;
  }

  // If no RPC function exists yet, we'll do it manually with multiple queries
  if (!data) {
    // First update the non-conformance status
    const { data: ncData, error: ncError } = await supabase
      .from('non_conformances')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...(newStatus === 'Under Review' ? { review_date: new Date().toISOString() } : {}),
        ...(newStatus === 'Released' || newStatus === 'Disposed' ? { resolution_date: new Date().toISOString() } : {})
      })
      .eq('id', id)
      .select()
      .single();
    
    if (ncError) {
      console.error(`Error updating non-conformance status:`, ncError);
      throw ncError;
    }
    
    // Then record the activity
    const { error: activityError } = await supabase
      .from('nc_activities')
      .insert({
        non_conformance_id: id,
        action: `Status changed from ${currentStatus} to ${newStatus}`,
        comments,
        performed_by: userId,
        previous_status: currentStatus,
        new_status: newStatus
      });
    
    if (activityError) {
      console.error(`Error recording non-conformance activity:`, activityError);
      throw activityError;
    }
    
    return ncData as NonConformance;
  }
  
  return data as NonConformance;
};

// Attachments
export const fetchNCAttachments = async (nonConformanceId: string): Promise<NCAttachment[]> => {
  const { data, error } = await supabase
    .from('nc_attachments')
    .select('*')
    .eq('non_conformance_id', nonConformanceId);
  
  if (error) {
    console.error(`Error fetching attachments for non-conformance ${nonConformanceId}:`, error);
    throw error;
  }
  
  return data as NCAttachment[];
};

export const uploadNCAttachment = async (
  nonConformanceId: string,
  file: File,
  description: string,
  userId: string
): Promise<NCAttachment> => {
  // Generate unique path for the file
  const filePath = `non-conformance/${nonConformanceId}/${Date.now()}_${file.name}`;
  
  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error('Error uploading attachment:', uploadError);
    throw uploadError;
  }
  
  // Create database record for the attachment
  const { data, error } = await supabase
    .from('nc_attachments')
    .insert({
      non_conformance_id: nonConformanceId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      file_path: filePath,
      description,
      uploaded_by: userId
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating attachment record:', error);
    throw error;
  }
  
  return data as NCAttachment;
};

export const deleteNCAttachment = async (id: string, filePath: string): Promise<void> => {
  // Delete file from storage
  const { error: storageError } = await supabase.storage
    .from('attachments')
    .remove([filePath]);
  
  if (storageError) {
    console.error(`Error deleting attachment file:`, storageError);
    throw storageError;
  }
  
  // Delete record from database
  const { error } = await supabase
    .from('nc_attachments')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting attachment record:`, error);
    throw error;
  }
};

// Activities
export const fetchNCActivities = async (nonConformanceId: string): Promise<NCActivity[]> => {
  const { data, error } = await supabase
    .from('nc_activities')
    .select('*')
    .eq('non_conformance_id', nonConformanceId)
    .order('performed_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching activities for non-conformance ${nonConformanceId}:`, error);
    throw error;
  }
  
  return data as NCActivity[];
};

// Create a log entry that's not related to status change
export const createNCActivity = async (activity: Omit<NCActivity, 'id'>): Promise<NCActivity> => {
  const { data, error } = await supabase
    .from('nc_activities')
    .insert(activity)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating activity log:', error);
    throw error;
  }
  
  return data as NCActivity;
};

// Notifications
export const fetchNCNotifications = async (nonConformanceId: string): Promise<NCNotification[]> => {
  const { data, error } = await supabase
    .from('nc_notifications')
    .select('*')
    .eq('non_conformance_id', nonConformanceId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching notifications for non-conformance ${nonConformanceId}:`, error);
    throw error;
  }
  
  return data as NCNotification[];
};

export const createNCNotification = async (notification: Omit<NCNotification, 'id' | 'is_read' | 'created_at'>): Promise<NCNotification> => {
  const { data, error } = await supabase
    .from('nc_notifications')
    .insert({
      ...notification,
      is_read: false
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
  
  return data as NCNotification;
};

export const markNCNotificationAsRead = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('nc_notifications')
    .update({ is_read: true })
    .eq('id', id);
  
  if (error) {
    console.error(`Error marking notification as read:`, error);
    throw error;
  }
};

// Statistics and Dashboard Data
export const fetchNCStats = async (): Promise<NCStats> => {
  // Get total count
  const { count: total, error: countError } = await supabase
    .from('non_conformances')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.error('Error fetching non-conformance count:', countError);
    throw countError;
  }
  
  // Get counts by status
  const { data: statusData, error: statusError } = await supabase
    .from('non_conformances')
    .select('status')
    .order('status');
  
  if (statusError) {
    console.error('Error fetching status counts:', statusError);
    throw statusError;
  }
  
  // Get counts by category
  const { data: categoryData, error: categoryError } = await supabase
    .from('non_conformances')
    .select('item_category')
    .order('item_category');
  
  if (categoryError) {
    console.error('Error fetching category counts:', categoryError);
    throw categoryError;
  }
  
  // Get counts by reason
  const { data: reasonData, error: reasonError } = await supabase
    .from('non_conformances')
    .select('reason_category')
    .order('reason_category');
  
  if (reasonError) {
    console.error('Error fetching reason counts:', reasonError);
    throw reasonError;
  }
  
  // Get recent items
  const { data: recentItems, error: recentError } = await supabase
    .from('non_conformances')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (recentError) {
    console.error('Error fetching recent items:', recentError);
    throw recentError;
  }
  
  // Process the data
  const byStatus: Record<string, number> = {};
  statusData.forEach(item => {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
  });
  
  const byCategory: Record<string, number> = {};
  categoryData.forEach(item => {
    byCategory[item.item_category] = (byCategory[item.item_category] || 0) + 1;
  });
  
  const byReason: Record<string, number> = {};
  reasonData.forEach(item => {
    byReason[item.reason_category] = (byReason[item.reason_category] || 0) + 1;
  });
  
  return {
    total: total || 0,
    byStatus: byStatus as Record<any, number>,
    byCategory: byCategory as Record<any, number>,
    byReason: byReason as Record<any, number>,
    recentItems: recentItems as NonConformance[]
  };
};

// CAPA Integration
export const linkNCToCapa = async (nonConformanceId: string, capaId: string): Promise<void> => {
  // Update the non-conformance with the CAPA ID
  const { error: ncError } = await supabase
    .from('non_conformances')
    .update({ capa_id: capaId })
    .eq('id', nonConformanceId);
  
  if (ncError) {
    console.error(`Error linking non-conformance to CAPA:`, ncError);
    throw ncError;
  }
  
  // Create a relationship in the module_relationships table
  const { error: relError } = await supabase
    .from('module_relationships')
    .insert({
      source_id: nonConformanceId,
      source_type: 'non_conformance',
      target_id: capaId,
      target_type: 'capa',
      relationship_type: 'capa_generated_from',
      created_by: 'system' // This should be the user ID in a real app
    });
  
  if (relError) {
    console.error(`Error creating module relationship:`, relError);
    throw relError;
  }
};

// Module Integration - Training
export const getTrainingRelatedToNC = async (nonConformanceId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('module_relationships')
    .select(`
      *,
      training_sessions:target_id(*)
    `)
    .eq('source_id', nonConformanceId)
    .eq('source_type', 'non_conformance')
    .eq('target_type', 'training');
  
  if (error) {
    console.error(`Error fetching related training:`, error);
    throw error;
  }
  
  return data;
};

// Module Integration - Documents
export const getDocumentsRelatedToNC = async (nonConformanceId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('module_relationships')
    .select(`
      *,
      documents:target_id(*)
    `)
    .eq('source_id', nonConformanceId)
    .eq('source_type', 'non_conformance')
    .eq('target_type', 'document');
  
  if (error) {
    console.error(`Error fetching related documents:`, error);
    throw error;
  }
  
  return data;
};

// Module Integration - Audits
export const getAuditsRelatedToNC = async (nonConformanceId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('module_relationships')
    .select(`
      *,
      audits:target_id(*)
    `)
    .eq('source_id', nonConformanceId)
    .eq('source_type', 'non_conformance')
    .eq('target_type', 'audit');
  
  if (error) {
    console.error(`Error fetching related audits:`, error);
    throw error;
  }
  
  return data;
};
