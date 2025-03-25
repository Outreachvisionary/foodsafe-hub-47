
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
  
  async uploadNCAttachment(attachment: Omit<NCAttachment, 'id'>): Promise<NCAttachment> {
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
  }
};

export default nonConformanceService;
