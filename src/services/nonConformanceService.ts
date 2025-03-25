
import { supabase } from '@/integrations/supabase/client';
import { NonConformance, NCStatus, NCActivity, NCStats, NCAttachment } from '@/types/non-conformance';

// Create a function to handle type safety for NC status
function ensureValidStatus(status: string): NCStatus {
  const validStatuses: NCStatus[] = ['On Hold', 'Under Review', 'Released', 'Disposed'];
  
  if (validStatuses.includes(status as NCStatus)) {
    return status as NCStatus;
  }
  
  // Default to 'On Hold' if an invalid status is provided
  console.warn(`Invalid status "${status}" provided, defaulting to "On Hold"`);
  return 'On Hold';
}

// Export the service object with all functions
const nonConformanceService = {
  async fetchNonConformances(): Promise<NonConformance[]> {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .order('reported_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching non-conformances:', error);
      throw error;
    }
    
    return data as NonConformance[];
  },
  
  async fetchNonConformanceById(id: string): Promise<NonConformance> {
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
  },
  
  async createNonConformance(nc: Omit<NonConformance, 'id'>): Promise<NonConformance> {
    const { data, error } = await supabase
      .from('non_conformances')
      .insert({
        ...nc,
        status: ensureValidStatus(nc.status) // Ensure status is valid
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating non-conformance:', error);
      throw error;
    }
    
    return data as NonConformance;
  },
  
  async updateNonConformance(id: string, updates: Partial<NonConformance>): Promise<NonConformance> {
    // If status is being updated, ensure it's valid
    if (updates.status) {
      updates.status = ensureValidStatus(updates.status);
    }
    
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
  },
  
  async deleteNonConformance(id: string): Promise<void> {
    const { error } = await supabase
      .from('non_conformances')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting non-conformance with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Activities
  async fetchNCActivities(ncId: string): Promise<NCActivity[]> {
    const { data, error } = await supabase
      .from('nc_activities')
      .select('*')
      .eq('non_conformance_id', ncId)
      .order('performed_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching activities for non-conformance ${ncId}:`, error);
      throw error;
    }
    
    return data as NCActivity[];
  },
  
  async createNCActivity(activity: Omit<NCActivity, 'id'>): Promise<NCActivity> {
    // Ensure status values are valid if present
    const sanitizedActivity = {
      ...activity,
      previous_status: activity.previous_status ? ensureValidStatus(activity.previous_status) : undefined,
      new_status: activity.new_status ? ensureValidStatus(activity.new_status) : undefined
    };
    
    const { data, error } = await supabase
      .from('nc_activities')
      .insert(sanitizedActivity)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating non-conformance activity:', error);
      throw error;
    }
    
    return data as NCActivity;
  },
  
  // Status update function
  async updateNCStatus(
    id: string, 
    newStatus: NCStatus, 
    previousStatus: NCStatus, 
    userId: string, 
    comments?: string
  ): Promise<void> {
    // Update the non-conformance status
    const { error: updateError } = await supabase
      .from('non_conformances')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...(newStatus === 'Under Review' ? { review_date: new Date().toISOString() } : {}),
        ...(newStatus === 'Released' || newStatus === 'Disposed' ? { resolution_date: new Date().toISOString() } : {})
      })
      .eq('id', id);
    
    if (updateError) {
      console.error(`Error updating non-conformance status:`, updateError);
      throw updateError;
    }
    
    // Create an activity record for the status change
    const activity = {
      non_conformance_id: id,
      action: `Status changed from ${previousStatus} to ${newStatus}`,
      performed_by: userId,
      performed_at: new Date().toISOString(),
      previous_status: previousStatus,
      new_status: newStatus,
      comments
    };
    
    await this.createNCActivity(activity);
  },
  
  // Quantity update function
  async updateNCQuantity(
    id: string,
    newQuantity: number,
    previousQuantity: number,
    userId: string,
    comments?: string
  ): Promise<void> {
    // Update the non-conformance quantity
    const { error: updateError } = await supabase
      .from('non_conformances')
      .update({
        quantity_on_hold: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (updateError) {
      console.error(`Error updating non-conformance quantity:`, updateError);
      throw updateError;
    }
    
    // Create an activity record for the quantity change
    const activity = {
      non_conformance_id: id,
      action: `Quantity on hold changed from ${previousQuantity} to ${newQuantity}`,
      performed_by: userId,
      performed_at: new Date().toISOString(),
      comments
    };
    
    await this.createNCActivity(activity);
  },
  
  // Attachments
  async fetchNCAttachments(ncId: string): Promise<NCAttachment[]> {
    const { data, error } = await supabase
      .from('nc_attachments')
      .select('*')
      .eq('non_conformance_id', ncId);
    
    if (error) {
      console.error(`Error fetching attachments for non-conformance ${ncId}:`, error);
      throw error;
    }
    
    return data as NCAttachment[];
  },
  
  async uploadNCAttachment(
    ncId: string, 
    file: File, 
    description: string, 
    userId: string
  ): Promise<NCAttachment> {
    // In a real implementation, you would upload the file to storage first
    // For this example, we'll just create a record without actual file upload
    const attachment = {
      non_conformance_id: ncId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      file_path: `/attachments/${ncId}/${file.name}`, // Add the required file_path field
      description,
      uploaded_by: userId,
      uploaded_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('nc_attachments')
      .insert(attachment)
      .select()
      .single();
    
    if (error) {
      console.error('Error uploading non-conformance attachment:', error);
      throw error;
    }
    
    return data as NCAttachment;
  },
  
  async deleteNCAttachment(id: string): Promise<void> {
    const { error } = await supabase
      .from('nc_attachments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting non-conformance attachment with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Statistics
  async fetchNCStats(): Promise<NCStats> {
    const { data: nonConformances, error } = await supabase
      .from('non_conformances')
      .select('*');
    
    if (error) {
      console.error('Error fetching non-conformance statistics:', error);
      throw error;
    }
    
    const recentItems = nonConformances
      .sort((a, b) => new Date(b.reported_date).getTime() - new Date(a.reported_date).getTime())
      .slice(0, 5) as NonConformance[];
    
    const byStatus = nonConformances.reduce((acc: Record<NCStatus, number>, nc) => {
      const status = ensureValidStatus(nc.status);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<NCStatus, number>);
    
    const byCategory = nonConformances.reduce((acc: Record<string, number>, nc) => {
      acc[nc.item_category] = (acc[nc.item_category] || 0) + 1;
      return acc;
    }, {});
    
    const byReason = nonConformances.reduce((acc: Record<string, number>, nc) => {
      acc[nc.reason_category] = (acc[nc.reason_category] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total: nonConformances.length,
      totalQuantityOnHold: nonConformances.reduce((sum, nc) => sum + (nc.quantity_on_hold || 0), 0),
      byStatus,
      byCategory,
      byReason,
      recentItems
    };
  },
  
  // Integration-related functions
  async getDocumentsRelatedToNC(ncId: string): Promise<any[]> {
    // This would be implemented when the document integration is ready
    // For now, return mock data
    return [
      {
        id: 'doc-rel-1',
        target_id: 'doc-1',
        documents: {
          title: 'SOP for Handling Non-Conformance',
          category: 'SOP',
          created_at: new Date().toISOString()
        }
      },
      {
        id: 'doc-rel-2',
        target_id: 'doc-2',
        documents: {
          title: 'Quality Control Checklist',
          category: 'Form',
          created_at: new Date().toISOString()
        }
      }
    ];
  },
  
  async getTrainingRelatedToNC(ncId: string): Promise<any[]> {
    // This would be implemented when the training integration is ready
    // For now, return mock data
    return [
      {
        id: 'train-rel-1',
        target_id: 'train-1',
        training_sessions: {
          title: 'Quality Control Training',
          training_type: 'Mandatory',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    ];
  },
  
  async getAuditsRelatedToNC(ncId: string): Promise<any[]> {
    // This would be implemented when the audits integration is ready
    // For now, return mock data
    return [
      {
        id: 'audit-rel-1',
        target_id: 'audit-1',
        audits: {
          title: 'Quarterly Quality Audit',
          audit_type: 'Internal',
          status: 'Scheduled',
          due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    ];
  }
};

export default nonConformanceService;

// Re-export individual functions for direct import
export const {
  fetchNonConformances,
  fetchNonConformanceById,
  createNonConformance,
  updateNonConformance,
  deleteNonConformance,
  fetchNCActivities,
  createNCActivity,
  updateNCStatus,
  updateNCQuantity,
  fetchNCAttachments,
  uploadNCAttachment,
  deleteNCAttachment,
  fetchNCStats,
  getDocumentsRelatedToNC,
  getTrainingRelatedToNC,
  getAuditsRelatedToNC
} = nonConformanceService;
