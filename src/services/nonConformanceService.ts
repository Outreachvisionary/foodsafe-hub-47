
import { supabase } from '@/integrations/supabase/client';
import { NCActivity, NonConformance, NCStatus, NCFilter, NCStats, NCAttachment } from '@/types/non-conformance';

// Fetch Non-Conformance items
export const fetchNonConformances = async (): Promise<NonConformance[]> => {
  const { data, error } = await supabase
    .from('non_conformances')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching non-conformances:', error);
    throw error;
  }
  
  return data as NonConformance[];
};

// Fetch a single Non-Conformance by ID
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

// Create a new Non-Conformance
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

// Update a Non-Conformance
export const updateNonConformance = async (id: string, updates: Partial<NonConformance>): Promise<NonConformance> => {
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
  
  return data as NonConformance;
};

// Update Non-Conformance status with RPC function
export const updateNCStatus = async (
  ncId: string, 
  newStatus: NCStatus, 
  prevStatus: NCStatus,
  userId: string, 
  comment: string
): Promise<void> => {
  // Using .rpc with explicitly typed parameters to fix type error
  const { error } = await supabase.rpc('update_nc_status', {
    nc_id: ncId,
    new_status: newStatus as unknown as string, // Type cast to resolve type error
    user_id: userId,
    comment: comment,
    prev_status: prevStatus as unknown as string // Type cast to resolve type error
  });
  
  if (error) {
    console.error('Error updating NC status:', error);
    throw error;
  }
};

// Update Non-Conformance quantity
export const updateNCQuantity = async (
  ncId: string,
  quantity: number,
  quantityOnHold: number
): Promise<NonConformance> => {
  const { data, error } = await supabase
    .from('non_conformances')
    .update({
      quantity: quantity,
      quantity_on_hold: quantityOnHold,
      updated_at: new Date().toISOString()
    })
    .eq('id', ncId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating NC quantity:', error);
    throw error;
  }
  
  return data as NonConformance;
};

// Delete a Non-Conformance
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

// Fetch NC Activities
export const fetchNCActivities = async (nonConformanceId: string): Promise<NCActivity[]> => {
  const { data, error } = await supabase
    .from('nc_activities')
    .select('*')
    .eq('non_conformance_id', nonConformanceId)
    .order('performed_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching activities for NC ${nonConformanceId}:`, error);
    throw error;
  }
  
  return data as NCActivity[];
};

// Fetch NC Attachments
export const fetchNCAttachments = async (nonConformanceId: string) => {
  const { data, error } = await supabase
    .from('nc_attachments')
    .select('*')
    .eq('non_conformance_id', nonConformanceId);
  
  if (error) {
    console.error(`Error fetching attachments for NC ${nonConformanceId}:`, error);
    throw error;
  }
  
  return data;
};

// Create NC Activity with proper type handling
export const createNCActivity = async (activity: {
  non_conformance_id: string;
  action: string;
  comments?: string;
  performed_by: string;
  previous_status?: NCStatus;
  new_status?: NCStatus;
}) => {
  // Type assertion to handle the string types correctly for Supabase
  const formattedActivity = {
    ...activity,
    previous_status: activity.previous_status as unknown as string,
    new_status: activity.new_status as unknown as string
  };

  const { data, error } = await supabase
    .from('nc_activities')
    .insert(formattedActivity)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating NC activity:', error);
    throw error;
  }
  
  return data;
};

// Upload NC Attachment
export const uploadNCAttachment = async (
  nonConformanceId: string,
  file: File,
  description: string,
  uploadedBy: string
): Promise<NCAttachment> => {
  // First upload the file to Supabase Storage
  const filePath = `nc-attachments/${nonConformanceId}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }
  
  // Then create a record in the nc_attachments table
  const attachment = {
    non_conformance_id: nonConformanceId,
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    file_path: filePath,
    description: description,
    uploaded_by: uploadedBy
  };
  
  const { data, error } = await supabase
    .from('nc_attachments')
    .insert(attachment)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating attachment record:', error);
    throw error;
  }
  
  return data as NCAttachment;
};

// Fetch NC Stats
export const fetchNCStats = async (): Promise<NCStats> => {
  // Get all non-conformances
  const { data: nonConformances, error } = await supabase
    .from('non_conformances')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching NC stats:', error);
    throw error;
  }
  
  // Calculate stats
  const stats: NCStats = {
    total: nonConformances.length,
    totalQuantityOnHold: nonConformances.reduce(
      (sum, nc) => sum + (nc.quantity_on_hold || 0), 
      0
    ),
    byStatus: {
      'On Hold': 0,
      'Under Review': 0,
      'Released': 0,
      'Disposed': 0
    },
    byCategory: {
      'Processing Equipment': 0,
      'Product Storage Tanks': 0,
      'Finished Products': 0,
      'Raw Products': 0,
      'Packaging Materials': 0,
      'Other': 0
    },
    byReason: {
      'Contamination': 0,
      'Quality Issues': 0,
      'Regulatory Non-Compliance': 0,
      'Equipment Malfunction': 0,
      'Documentation Error': 0,
      'Process Deviation': 0,
      'Other': 0
    },
    recentItems: nonConformances.slice(0, 5) as NonConformance[]
  };
  
  // Populate the counts
  nonConformances.forEach(nc => {
    if (nc.status && stats.byStatus[nc.status as NCStatus] !== undefined) {
      stats.byStatus[nc.status as NCStatus]++;
    }
    
    if (nc.item_category && stats.byCategory[nc.item_category] !== undefined) {
      stats.byCategory[nc.item_category]++;
    }
    
    if (nc.reason_category && stats.byReason[nc.reason_category] !== undefined) {
      stats.byReason[nc.reason_category]++;
    }
  });
  
  return stats;
};

// Functions for related documents, training, and audits
export const getDocumentsRelatedToNC = async (nonConformanceId: string) => {
  // This would be a real implementation with actual queries in production
  return [];
};

export const getTrainingRelatedToNC = async (nonConformanceId: string) => {
  // This would be a real implementation with actual queries in production
  return [];
};

export const getAuditsRelatedToNC = async (nonConformanceId: string) => {
  // This would be a real implementation with actual queries in production
  return [];
};
