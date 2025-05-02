import { Complaint } from '@/types/complaint';
import { ComplaintStatus } from '@/types/enums';
import { supabase } from '@/integrations/supabase/client';

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

// Get a complaint by ID
export const getComplaintById = async (id: string): Promise<Complaint> => {
  // This function is the same as fetchComplaintById for compatibility
  return fetchComplaintById(id);
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
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Also create an activity log for this status change
    await supabase.from('complaint_activities').insert({
      complaint_id: id,
      action: `Status changed to ${status}`,
      performed_by: userId,
    });
    
    return data as unknown as Complaint;
  } catch (error) {
    console.error('Error updating complaint status:', error);
    throw new Error('Failed to update complaint status');
  }
};
