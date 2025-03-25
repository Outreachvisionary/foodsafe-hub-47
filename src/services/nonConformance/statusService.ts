
import { supabase } from '@/integrations/supabase/client';
import { NonConformance, NCStatus } from '@/types/non-conformance';
import { createNCActivity } from './activityService';

// Update non-conformance status with activity tracking
export const updateNCStatus = async (
  id: string, 
  newStatus: NCStatus, 
  currentStatus: NCStatus,
  userId: string,
  comments?: string
): Promise<NonConformance> => {
  // Start a transaction
  const { data, error } = await supabase.rpc('update_nc_status', {
    nc_id: id,
    new_status: newStatus,
    user_id: userId,
    comment: comments || '', // Provide default empty string to avoid type issues
    prev_status: currentStatus
  });

  if (error) {
    console.error(`Error updating status for non-conformance ${id}:`, error);
    throw error;
  }

  // If no RPC function exists yet, we'll do it manually with multiple queries
  if (!data) {
    // First update the non-conformance status
    const { data: ncData, error: ncError } = await supabase
      .from('non_conformances')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...(newStatus === 'Under Review' ? { review_date: new Date().toISOString() } : {}),
        ...(newStatus === 'Released' || newStatus === 'Disposed' ? { resolution_date: new Date().toISOString() } : {})
      })
      .eq('id', id)
      .select()
      .single();
    
    if (ncError) {
      console.error(`Error updating non-conformance status:`, ncError);
      throw ncError;
    }
    
    // Then record the activity
    await createNCActivity({
      non_conformance_id: id,
      action: `Status changed from ${currentStatus} to ${newStatus}`,
      comments: comments || '', // Ensure we pass a string here too
      performed_by: userId,
      previous_status: currentStatus,
      new_status: newStatus
    });
    
    return ncData as NonConformance;
  }
  
  return data as NonConformance;
};
