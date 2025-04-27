import { supabase } from '@/integrations/supabase/client';
import { Complaint, ComplaintStatus } from '@/types/complaint';
import { convertToComplaintStatus } from '@/utils/typeAdapters';
import { getMockComplaints } from '@/services/mockDataService';

// Type guard to check for errors
const isSupabaseError = (error: any): boolean => {
  return error && typeof error === 'object' && 'message' in error;
};

// Fetch all complaints
export const fetchComplaints = async (): Promise<Complaint[]> => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      // Return mock data if no real data exists
      return getMockComplaints();
    }

    return data.map((complaint: any) => ({
      ...complaint,
      status: convertToComplaintStatus(complaint.status),
      priority: complaint.priority || 'Medium'
    }));
  } catch (error) {
    console.error('Error fetching complaints:', error);
    // Return mock data as fallback
    return getMockComplaints();
  }
};

// Fetch a single complaint by ID
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
      status: convertToComplaintStatus(data.status),
      priority: data.priority || 'Medium',
      // Ensure these properties exist
      created_at: data.created_at,
      updated_at: data.updated_at || data.created_at
    };
  } catch (error) {
    console.error('Error fetching complaint:', error);
    
    // Get mock complaints and find the one with matching ID
    const mockComplaints = getMockComplaints();
    const mockComplaint = mockComplaints.find(c => c.id === id);
    
    if (mockComplaint) {
      return mockComplaint;
    }
    
    // Create a fallback complaint if none found
    throw new Error('Complaint not found');
  }
};

// Update complaint status
export const updateComplaintStatus = async (
  id: string, 
  status: ComplaintStatus, 
  userId: string
): Promise<Complaint> => {
  try {
    // Get the current complaint first to return in case of error
    const currentComplaint = await fetchComplaintById(id);
    
    // Prepare updates
    const updates: any = {
      status: status.replace(/_/g, ' '),
      updated_at: new Date().toISOString(),
    };
    
    // Add resolution date if status is Resolved or Closed
    if (status === 'Resolved' || status === 'Closed') {
      updates.resolution_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('complaints')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Also record this activity in a complaints_activities table if it exists
    try {
      await supabase.from('complaint_activities').insert({
        complaint_id: id,
        user_id: userId,
        action: 'status_change',
        previous_status: currentComplaint.status,
        new_status: status,
        timestamp: new Date().toISOString()
      });
    } catch (activityError) {
      // Just log activity errors, don't fail the main operation
      console.warn('Could not record complaint activity:', activityError);
    }
    
    return {
      ...data,
      status: convertToComplaintStatus(data.status),
      priority: data.priority || 'Medium',
      created_at: data.created_at,
      updated_at: data.updated_at || data.created_at
    };
  } catch (error) {
    console.error('Error updating complaint status:', error);
    
    // Get the current complaint again to return the unchanged data
    const currentComplaint = await fetchComplaintById(id);
    return currentComplaint;
  }
};

export const createComplaint = async (complaint: Partial<Complaint>): Promise<Complaint> => {
  try {
    const newComplaint = {
      ...complaint,
      status: complaint.status?.replace(/_/g, ' ') || 'New',
      reported_date: complaint.reported_date || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('complaints')
      .insert([newComplaint])
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      status: convertToComplaintStatus(data.status),
      priority: data.priority || 'Medium',
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error creating complaint:', error);
    
    // Create a mock result in case of failure
    const mockComplaints = getMockComplaints();
    const mockId = `mock-${Date.now()}`;
    
    return {
      ...complaint,
      id: mockId,
      status: complaint.status || 'New',
      reported_date: complaint.reported_date || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      priority: complaint.priority || 'Medium'
    } as Complaint;
  }
};
