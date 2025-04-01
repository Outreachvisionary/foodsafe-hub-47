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

export const fetchNCStats = async (): Promise<NCStats> => {
  try {
    const { data: nonConformances, error } = await supabase
      .from('non_conformances')
      .select('*')
      .order('reported_date', { ascending: false });
      
    if (error) throw error;
    
    const stats: NCStats = {
      total: nonConformances.length,
      totalQuantityOnHold: nonConformances.reduce((sum, nc) => sum + (nc.quantity_on_hold || 0), 0),
      byStatus: {} as Record<NCStatus, number>,
      byCategory: {},
      byReason: {},
      recentItems: nonConformances.slice(0, 5) as NonConformance[]
    };
    
    const statusValues: NCStatus[] = ['On Hold', 'Under Review', 'Released', 'Disposed'];
    statusValues.forEach(status => {
      stats.byStatus[status] = 0;
    });
    
    nonConformances.forEach(nc => {
      if (stats.byStatus[nc.status as NCStatus] !== undefined) {
        stats.byStatus[nc.status as NCStatus]++;
      }
      
      if (!stats.byCategory[nc.item_category]) {
        stats.byCategory[nc.item_category] = 0;
      }
      stats.byCategory[nc.item_category]++;
      
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

export const createNonConformance = async (nonConformance: Omit<NonConformance, 'id'>): Promise<NonConformance> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .insert(nonConformance)
      .select()
      .single();
      
    if (error) throw error;
    
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

export const updateNonConformance = async (id: string, updates: Partial<NonConformance>): Promise<NonConformance> => {
  try {
    const { data: current } = await supabase
      .from('non_conformances')
      .select('status')
      .eq('id', id)
      .single();
      
    const previousStatus = current?.status as NCStatus;
    
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

export const updateNCStatus = async (id: string, newStatus: NCStatus, updatedBy: string, comment: string = ''): Promise<NonConformance> => {
  try {
    const { data: current } = await supabase
      .from('non_conformances')
      .select('status')
      .eq('id', id)
      .single();
      
    if (!current) throw new Error('Non-conformance not found');
    
    const { data, error } = await supabase.rpc('update_nc_status', {
      nc_id: id,
      new_status: newStatus,
      user_id: updatedBy,
      comment: comment,
      prev_status: current.status
    });
    
    if (error) throw error;
    
    return data as NonConformance;
  } catch (error) {
    console.error(`Error updating status for non-conformance with ID ${id}:`, error);
    toast.error('Failed to update non-conformance status');
    throw error;
  }
};

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

export const deleteNonConformance = async (id: string): Promise<void> => {
  try {
    await supabase
      .from('nc_activities')
      .delete()
      .eq('non_conformance_id', id);
      
    await supabase
      .from('nc_attachments')
      .delete()
      .eq('non_conformance_id', id);
      
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
    throw error;
  }
};

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

export const uploadNCAttachment = async (
  nonConformanceId: string,
  file: File,
  description: string,
  uploadedBy: string
): Promise<NCAttachment> => {
  try {
    const timestamp = new Date().getTime();
    const filePath = `non-conformances/${nonConformanceId}/${timestamp}_${file.name}`;
    
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    const { data: urlData } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
      
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

export const deleteNCAttachment = async (attachmentId: string, nonConformanceId: string): Promise<void> => {
  try {
    const { data: attachment, error: fetchError } = await supabase
      .from('nc_attachments')
      .select('file_path, file_name, uploaded_by')
      .eq('id', attachmentId)
      .single();
      
    if (fetchError) throw fetchError;
    
    const { error } = await supabase
      .from('nc_attachments')
      .delete()
      .eq('id', attachmentId);
      
    if (error) throw error;
    
    try {
      const url = new URL(attachment.file_path);
      const path = url.pathname.split('/').slice(2).join('/'); // Remove /storage/v1/object/public/ prefix
      
      await supabase.storage
        .from('documents')
        .remove([path]);
    } catch (storageError) {
      console.error('Unable to delete file from storage:', storageError);
    }
    
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

export const getDocumentsRelatedToNC = async (nonConformanceId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase.rpc('get_related_items', {
      p_source_id: nonConformanceId,
      p_source_type: 'non_conformances',
      p_target_type: 'documents'
    });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      const docIds = data.map(item => item.target_id);
      
      const { data: documents, error: docError } = await supabase
        .from('documents')
        .select('*')
        .in('id', docIds);
        
      if (docError) throw docError;
      
      return data.map(rel => {
        const doc = documents?.find(d => d.id === rel.target_id);
        return {
          ...rel,
          document: doc
        };
      });
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching documents related to NC ${nonConformanceId}:`, error);
    toast.error('Failed to load related documents');
    throw error;
  }
};

export const getTrainingRelatedToNC = async (nonConformanceId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase.rpc('get_related_items', {
      p_source_id: nonConformanceId,
      p_source_type: 'non_conformances',
      p_target_type: 'training_sessions'
    });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      const sessionIds = data.map(item => item.target_id);
      
      const { data: sessions, error: sessionsError } = await supabase
        .from('training_sessions')
        .select('*')
        .in('id', sessionIds);
        
      if (sessionsError) throw sessionsError;
      
      return data.map(rel => {
        const session = sessions?.find(s => s.id === rel.target_id);
        return {
          ...rel,
          training_session: session
        };
      });
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching training related to NC ${nonConformanceId}:`, error);
    toast.error('Failed to load related training sessions');
    throw error;
  }
};

export const getAuditsRelatedToNC = async (nonConformanceId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase.rpc('get_related_items', {
      p_source_id: nonConformanceId,
      p_source_type: 'non_conformances',
      p_target_type: 'audits'
    });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      const auditIds = data.map(item => item.target_id);
      
      const { data: audits, error: auditsError } = await supabase
        .from('audits')
        .select('*')
        .in('id', auditIds);
        
      if (auditsError) throw auditsError;
      
      return data.map(rel => {
        const audit = audits?.find(a => a.id === rel.target_id);
        return {
          ...rel,
          audit: audit
        };
      });
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching audits related to NC ${nonConformanceId}:`, error);
    toast.error('Failed to load related audits');
    throw error;
  }
};

export const createNCRelationship = async (
  nonConformanceId: string,
  targetId: string,
  targetType: string,
  relationshipType: string,
  createdBy: string
): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('module_relationships')
      .insert({
        source_id: nonConformanceId,
        source_type: 'non_conformances',
        target_id: targetId,
        target_type: targetType,
        relationship_type: relationshipType,
        created_by: createdBy
      })
      .select()
      .single();
      
    if (error) throw error;
    
    await createNCActivity({
      non_conformance_id: nonConformanceId,
      action: `Linked to ${targetType}: ${targetId}`,
      performed_by: createdBy
    });
    
    return data;
  } catch (error) {
    console.error(`Error creating relationship for NC ${nonConformanceId}:`, error);
    toast.error('Failed to create relationship');
    throw error;
  }
};

export const removeNCRelationship = async (
  nonConformanceId: string,
  targetId: string,
  targetType: string,
  performedBy: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('module_relationships')
      .delete()
      .eq('source_id', nonConformanceId)
      .eq('source_type', 'non_conformances')
      .eq('target_id', targetId)
      .eq('target_type', targetType);
      
    if (error) throw error;
    
    await createNCActivity({
      non_conformance_id: nonConformanceId,
      action: `Unlinked from ${targetType}: ${targetId}`,
      performed_by: performedBy
    });
  } catch (error) {
    console.error(`Error removing relationship for NC ${nonConformanceId}:`, error);
    toast.error('Failed to remove relationship');
    throw error;
  }
};

export const subscribeToNCUpdates = (callback: (payload: any) => void) => {
  return supabase
    .channel('public:non_conformances')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'non_conformances' }, 
      callback
    )
    .subscribe();
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
  getAuditsRelatedToNC,
  createNCRelationship,
  removeNCRelationship,
  subscribeToNCUpdates
};
