import { Complaint, ComplaintFilter, CreateComplaintRequest } from '@/types/complaint';
import { ComplaintStatus, ComplaintCategory, ComplaintPriority } from '@/types/enums';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  complaintCategoryToDbString, 
  complaintStatusToDbString, 
  stringToComplaintCategory, 
  stringToComplaintStatus,
  stringToComplaintPriority
} from '@/utils/complaintAdapters';

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
          const statusStrings = filters.status.map(s => complaintStatusToDbString(s));
          query = query.in('status', statusStrings as any);
        } else {
          query = query.eq('status', complaintStatusToDbString(filters.status) as any);
        }
      }
      
      if (filters.category) {
        if (Array.isArray(filters.category)) {
          const categoryStrings = filters.category.map(c => complaintCategoryToDbString(c));
          query = query.in('category', categoryStrings as any);
        } else {
          query = query.eq('category', complaintCategoryToDbString(filters.category) as any);
        }
      }
      
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,customer_name.ilike.%${filters.searchTerm}%`);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      category: stringToComplaintCategory(item.category),
      status: stringToComplaintStatus(item.status),
      priority: undefined // Priority field doesn't exist in database
    }));
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
    
    return {
      ...data,
      category: stringToComplaintCategory(data.category),
      status: stringToComplaintStatus(data.status),
      priority: undefined // Priority field doesn't exist in database
    };
  } catch (error) {
    console.error('Error fetching complaint:', error);
    throw new Error('Failed to fetch complaint details');
  }
};

// Create a new complaint
export const createComplaint = async (complaint: CreateComplaintRequest): Promise<Complaint> => {
  try {
    const dbComplaint = {
      title: complaint.title,
      description: complaint.description,
      category: complaintCategoryToDbString(complaint.category),
      status: 'New',
      reported_date: new Date().toISOString(),
      created_by: complaint.created_by,
      customer_name: complaint.customer_name,
      customer_contact: complaint.customer_contact,
      product_involved: complaint.product_involved,
      lot_number: complaint.lot_number
    };

    const { data, error } = await supabase
      .from('complaints')
      .insert(dbComplaint)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      category: stringToComplaintCategory(data.category),
      status: stringToComplaintStatus(data.status),
      priority: undefined // Priority field doesn't exist in database
    };
  } catch (error) {
    console.error('Error creating complaint:', error);
    throw new Error('Failed to create complaint');
  }
};

// Update an existing complaint
export const updateComplaint = async (id: string, updates: Partial<Complaint>): Promise<Complaint> => {
  try {
    const { id: _, created_at, updated_at, priority, ...updateData } = updates;
    
    const dbUpdates: any = { ...updateData, updated_at: new Date().toISOString() };
    if (updateData.category) {
      dbUpdates.category = complaintCategoryToDbString(updateData.category);
    }
    if (updateData.status) {
      dbUpdates.status = complaintStatusToDbString(updateData.status);
    }
    
    const { data, error } = await supabase
      .from('complaints')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      category: stringToComplaintCategory(data.category),
      status: stringToComplaintStatus(data.status),
      priority: undefined // Priority field doesn't exist in database
    };
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
    const { data, error } = await supabase
      .from('complaints')
      .update({ 
        status: status as any, 
        updated_at: new Date().toISOString(),
        resolution_date: status === 'Resolved' ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      category: stringToComplaintCategory(data.category),
      status: stringToComplaintStatus(data.status),
      priority: undefined // Priority field doesn't exist in database
    };
  } catch (error) {
    console.error('Error updating complaint status:', error);
    throw new Error('Failed to update complaint status');
  }
};

// Fetch activities for a specific complaint (placeholder)
export const fetchComplaintActivities = async (complaintId: string) => {
  try {
    console.log('Complaint activities not available - table does not exist');
    return [];
  } catch (error) {
    console.error('Error fetching complaint activities:', error);
    throw new Error('Failed to fetch complaint activity history');
  }
};

// Add a new activity to a complaint (placeholder)
export const addComplaintActivity = async (
  complaintId: string, 
  activityType: string, 
  description: string, 
  userId: string
) => {
  try {
    console.log('Complaint activity logging not available - table does not exist');
    return null;
  } catch (error) {
    console.error('Error adding complaint activity:', error);
    throw new Error('Failed to record complaint activity');
  }
};

// Create a CAPA from a complaint
export const createCAPAFromComplaint = async (complaintId: string, userId: string) => {
  try {
    const { data: complaint, error: fetchError } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', complaintId)
      .single();
      
    if (fetchError) throw fetchError;
    
    const { data: capa, error: capaError } = await supabase
      .from('capa_actions')
      .insert({
        title: `CAPA for ${complaint.title}`,
        description: complaint.description,
        source: 'Customer Complaint',
        priority: 'medium',
        status: 'Open',
        created_by: userId,
        assigned_to: complaint.assigned_to || userId,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();
      
    if (capaError) throw capaError;
    
    const { error: updateError } = await supabase
      .from('complaints')
      .update({ 
        capa_id: capa.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', complaintId);
      
    if (updateError) throw updateError;
    
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
      .select('status, category');
      
    if (error) throw error;
    
    const stats = {
      total: data.length,
      byStatus: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      openHighPriority: 0,
      avgResolutionTime: 0
    };
    
    data.forEach((complaint) => {
      stats.byStatus[complaint.status] = (stats.byStatus[complaint.status] || 0) + 1;
      stats.byCategory[complaint.category] = (stats.byCategory[complaint.category] || 0) + 1;
      
      if ((complaint.status === 'New' || complaint.status === 'Under Investigation')) {
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
