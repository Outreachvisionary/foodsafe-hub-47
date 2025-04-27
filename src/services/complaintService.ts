
import { Complaint, ComplaintStatus } from '@/types/complaint';
import { supabase } from '@/integrations/supabase/client';

export async function fetchComplaints(): Promise<Complaint[]> {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
}

export async function fetchComplaintById(id: string): Promise<Complaint> {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching complaint ${id}:`, error);
    throw error;
  }
}

export async function updateComplaintStatus(
  id: string, 
  status: ComplaintStatus, 
  userId: string,
  comment?: string
): Promise<Complaint> {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
        ...(status === 'Resolved' || status === 'Closed' ? { resolution_date: new Date().toISOString() } : {})
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Log activity for this update
    await supabase.from('complaint_activities').insert({
      complaint_id: id,
      action_type: 'status_change',
      performed_by: userId,
      details: `Status changed to ${status}`,
      comments: comment || ''
    });

    return data;
  } catch (error) {
    console.error(`Error updating complaint ${id} status:`, error);
    throw error;
  }
}

export async function createComplaint(complaint: Partial<Complaint>): Promise<Complaint> {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .insert(complaint)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating complaint:', error);
    throw error;
  }
}

export async function updateComplaint(id: string, updates: Partial<Complaint>): Promise<Complaint> {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating complaint ${id}:`, error);
    throw error;
  }
}

export async function deleteComplaint(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting complaint ${id}:`, error);
    throw error;
  }
}
