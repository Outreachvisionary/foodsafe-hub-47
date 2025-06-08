
import { Complaint, ComplaintFilter } from '@/types/complaint';
import { ComplaintStatus, ComplaintCategory, ComplaintPriority } from '@/types/enums';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Helper function to convert enum to database string
const complaintCategoryToDbString = (category: ComplaintCategory): string => {
  switch (category) {
    case ComplaintCategory.Product_Quality:
      return 'Product Quality';
    case ComplaintCategory.Food_Safety:
      return 'Food Safety';
    case ComplaintCategory.Foreign_Material:
      return 'Foreign Material';
    case ComplaintCategory.Packaging:
      return 'Packaging';
    case ComplaintCategory.Delivery:
      return 'Delivery';
    case ComplaintCategory.Service:
      return 'Service';
    case ComplaintCategory.Labeling:
      return 'Labeling';
    case ComplaintCategory.Other:
      return 'Other';
    default:
      return 'Other';
  }
};

const complaintStatusToDbString = (status: ComplaintStatus): string => {
  switch (status) {
    case ComplaintStatus.New:
      return 'New';
    case ComplaintStatus.Under_Investigation:
      return 'Under Investigation';
    case ComplaintStatus.Resolved:
      return 'Resolved';
    case ComplaintStatus.Closed:
      return 'Closed';
    default:
      return 'New';
  }
};

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
          query = query.in('status', statusStrings);
        } else {
          query = query.eq('status', complaintStatusToDbString(filters.status));
        }
      }
      
      if (filters.category) {
        if (Array.isArray(filters.category)) {
          const categoryStrings = filters.category.map(c => complaintCategoryToDbString(c));
          query = query.in('category', categoryStrings);
        } else {
          query = query.eq('category', complaintCategoryToDbString(filters.category));
        }
      }
      
      if (filters.priority) {
        if (Array.isArray(filters.priority)) {
          const priorityStrings = filters.priority.map(p => p.toString());
          query = query.in('priority', priorityStrings);
        } else {
          query = query.eq('priority', filters.priority.toString());
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
    // Convert enum values to database strings
    const dbComplaint = {
      ...complaint,
      category: complaintCategoryToDbString(complaint.category),
      status: complaint.status ? complaintStatusToDbString(complaint.status) : 'New'
    };

    const { data, error } = await supabase
      .from('complaints')
      .insert(dbComplaint)
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
    
    // Convert enum values to database strings
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
        status: status as "New" | "Under Investigation" | "Resolved" | "Closed", 
        updated_at: new Date().toISOString(),
        resolution_date: status === 'Resolved' ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Note: complaint_activities table doesn't exist in the database schema
    // Commenting out for now to avoid errors
    
    return data as unknown as Complaint;
  } catch (error) {
    console.error('Error updating complaint status:', error);
    throw new Error('Failed to update complaint status');
  }
};

// Fetch activities for a specific complaint
export const fetchComplaintActivities = async (complaintId: string) => {
  try {
    // Note: complaint_activities table doesn't exist in the database schema
    // Return empty array for now
    console.log('Complaint activities not available - table does not exist');
    return [];
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
    // Note: complaint_activities table doesn't exist in the database schema
    // Return mock data for now
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
        source: 'Customer Complaint',
        priority: complaint.priority?.toLowerCase() || 'medium',
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
    
    // Record this activity (if complaint_activities table existed)
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
      if (complaint.priority) {
        stats.byPriority[complaint.priority] = (stats.byPriority[complaint.priority] || 0) + 1;
      }
      
      // Count high priority open complaints
      if ((complaint.status === 'New' || complaint.status === 'Under Investigation') && 
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
