
import { Complaint, ComplaintFilter } from '@/types/complaint';
import { ComplaintStatus, ComplaintCategory, ComplaintPriority } from '@/types/enums';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Fetch all complaints with optional filtering
export const fetchComplaints = async (filters?: ComplaintFilter): Promise<Complaint[]> => {
  try {
    let query = supabase
      .from('complaints')
      .select('*')
      .order('reported_date', { ascending: false });
    
    // Apply filters if provided
    if (filters) {
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }
      
      if (filters.category) {
        if (Array.isArray(filters.category)) {
          query = query.in('category', filters.category);
        } else {
          query = query.eq('category', filters.category);
        }
      }
      
      if (filters.priority) {
        if (Array.isArray(filters.priority)) {
          query = query.in('priority', filters.priority);
        } else {
          query = query.eq('priority', filters.priority);
        }
      }
      
      if (filters.dateRange) {
        query = query
          .gte('reported_date', filters.dateRange.start)
          .lte('reported_date', filters.dateRange.end);
      }
      
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,customer_name.ilike.%${filters.searchTerm}%`);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as unknown as Complaint[];
  } catch (error) {
    console.error('Error fetching complaints:', error);
    toast({
      title: "Failed to load complaints",
      description: "There was an error fetching the complaints data.",
      variant: "destructive"
    });
    return [];
  }
};

// Fetch a complaint by its ID
export const fetchComplaintById = async (id: string): Promise<Complaint> => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return data as unknown as Complaint;
  } catch (error) {
    console.error('Error fetching complaint:', error);
    throw new Error('Failed to fetch complaint details');
  }
};

// Create a new complaint
export const createComplaint = async (complaint: Omit<Complaint, 'id' | 'created_at' | 'updated_at'>): Promise<Complaint> => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .insert(complaint)
      .select()
      .single();

    if (error) throw error;
    
    return data as unknown as Complaint;
  } catch (error) {
    console.error('Error creating complaint:', error);
    throw new Error('Failed to create complaint');
  }
};

// Update an existing complaint
export const updateComplaint = async (id: string, updates: Partial<Complaint>): Promise<Complaint> => {
  try {
    // Don't allow updates to id, created_at, and similar fields
    const { id: _, created_at, updated_at, ...updateData } = updates;
    
    const { data, error } = await supabase
      .from('complaints')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return data as unknown as Complaint;
  } catch (error) {
    console.error('Error updating complaint:', error);
    throw new Error('Failed to update complaint');
  }
};

// Update a complaint's status
export const updateComplaintStatus = async (
  id: string, 
  status: string,
  userId: string
): Promise<Complaint> => {
  try {
    const { data: complaint, error: fetchError } = await supabase
      .from('complaints')
      .select('status')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    const oldStatus = complaint.status;
    
    const { data, error } = await supabase
      .from('complaints')
      .update({ 
        status, 
        updated_at: new Date().toISOString(),
        resolution_date: status === 'Resolved' ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Also create an activity log for this status change
    await supabase
      .from('complaint_activities')
      .insert({
        complaint_id: id,
        action_type: 'Status Change',
        description: `Status changed from ${oldStatus} to ${status}`,
        performed_by: userId,
        old_status: oldStatus,
        new_status: status
      });
    
    return data as unknown as Complaint;
  } catch (error) {
    console.error('Error updating complaint status:', error);
    throw new Error('Failed to update complaint status');
  }
};

// Fetch activities for a specific complaint
export const fetchComplaintActivities = async (complaintId: string) => {
  try {
    const { data, error } = await supabase
      .from('complaint_activities')
      .select('*')
      .eq('complaint_id', complaintId)
      .order('performed_at', { ascending: false });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching complaint activities:', error);
    throw new Error('Failed to fetch complaint activity history');
  }
};

// Add a new activity to a complaint
export const addComplaintActivity = async (
  complaintId: string, 
  activityType: string, 
  description: string, 
  userId: string
) => {
  try {
    const { data, error } = await supabase
      .from('complaint_activities')
      .insert({
        complaint_id: complaintId,
        action_type: activityType,
        description,
        performed_by: userId
      })
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error adding complaint activity:', error);
    throw new Error('Failed to record complaint activity');
  }
};

// Create a CAPA from a complaint
export const createCAPAFromComplaint = async (complaintId: string, userId: string) => {
  try {
    // Get complaint details first
    const { data: complaint, error: fetchError } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', complaintId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Create a new CAPA
    const { data: capa, error: capaError } = await supabase
      .from('capa_actions')
      .insert({
        title: `CAPA for ${complaint.title}`,
        description: complaint.description,
        source: 'CustomerComplaint',
        priority: complaint.priority.toLowerCase(),
        status: 'Open',
        created_by: userId,
        assigned_to: complaint.assigned_to || userId,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default due date: 1 week
      })
      .select()
      .single();
      
    if (capaError) throw capaError;
    
    // Link the CAPA to the complaint
    const { error: updateError } = await supabase
      .from('complaints')
      .update({ 
        capa_id: capa.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', complaintId);
      
    if (updateError) throw updateError;
    
    // Record this activity
    await addComplaintActivity(
      complaintId,
      'CAPA Created',
      `CAPA action created with ID: ${capa.id}`,
      userId
    );
    
    return capa;
  } catch (error) {
    console.error('Error creating CAPA from complaint:', error);
    throw new Error('Failed to create CAPA');
  }
};

// Get statistics on complaints
export const getComplaintStatistics = async () => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('status, category, priority');
      
    if (error) throw error;
    
    const stats = {
      total: data.length,
      byStatus: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      openHighPriority: 0,
      avgResolutionTime: 0
    };
    
    // Calculate statistics
    data.forEach((complaint) => {
      // By status
      stats.byStatus[complaint.status] = (stats.byStatus[complaint.status] || 0) + 1;
      
      // By category
      stats.byCategory[complaint.category] = (stats.byCategory[complaint.category] || 0) + 1;
      
      // By priority
      stats.byPriority[complaint.priority] = (stats.byPriority[complaint.priority] || 0) + 1;
      
      // Count high priority open complaints
      if ((complaint.status === 'New' || complaint.status === 'Under_Investigation') && 
          (complaint.priority === 'High' || complaint.priority === 'Critical')) {
        stats.openHighPriority++;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting complaint statistics:', error);
    throw new Error('Failed to calculate complaint statistics');
  }
};

export default {
  fetchComplaints,
  fetchComplaintById,
  createComplaint,
  updateComplaint,
  updateComplaintStatus,
  fetchComplaintActivities,
  addComplaintActivity,
  createCAPAFromComplaint,
  getComplaintStatistics
};
