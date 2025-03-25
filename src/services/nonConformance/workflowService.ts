
import { supabase } from '@/integrations/supabase/client';
import { NonConformance } from '@/types/non-conformance';
import { createNCNotification } from './notificationService';
import { createNCActivity } from './activityService';
import { linkNCToCapa } from './integrationService';
import { updateNCStatus } from './statusService';

/**
 * Initiates a hold workflow for a non-conformance item
 * This includes updating status, creating notifications, and recording activity
 */
export const initiateHoldWorkflow = async (
  id: string,
  userId: string,
  currentStatus: NonConformance['status'],
  comments?: string,
  assignToUsers?: string[]
): Promise<NonConformance> => {
  // Update the status to On Hold
  const updatedNC = await updateNCStatus(id, 'On Hold', currentStatus, userId, comments);
  
  // Create notification for management
  await createNCNotification({
    non_conformance_id: id,
    message: `Item ${updatedNC.item_name} has been placed on hold. Reason: ${comments || 'No reason provided'}`,
    notification_type: 'status_change',
    target_users: assignToUsers || []
  });
  
  // Record activity
  await createNCActivity({
    non_conformance_id: id,
    action: 'Hold workflow initiated',
    comments: comments || '',
    performed_by: userId
  });
  
  return updatedNC;
};

/**
 * Initiates a review workflow for a non-conformance item
 */
export const initiateReviewWorkflow = async (
  id: string,
  userId: string,
  currentStatus: NonConformance['status'],
  reviewerId: string,
  comments?: string
): Promise<NonConformance> => {
  // Update status to Under Review
  const updatedNC = await updateNCStatus(id, 'Under Review', currentStatus, userId, comments);
  
  // Assign reviewer
  const { error } = await supabase
    .from('non_conformances')
    .update({
      reviewer: reviewerId,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) {
    console.error(`Error assigning reviewer for non-conformance ${id}:`, error);
    throw error;
  }
  
  // Create notification for reviewer
  await createNCNotification({
    non_conformance_id: id,
    message: `You have been assigned to review non-conformance item ${updatedNC.item_name}`,
    notification_type: 'review_assignment',
    target_users: [reviewerId]
  });
  
  // Record activity
  await createNCActivity({
    non_conformance_id: id,
    action: 'Review workflow initiated',
    comments: `Reviewer assigned: ${reviewerId}`,
    performed_by: userId
  });
  
  return updatedNC;
};

/**
 * Initiates a CAPA workflow for a non-conformance item
 */
export const initiateCAPAWorkflow = async (
  id: string,
  userId: string,
  capaId: string,
  comments?: string
): Promise<void> => {
  try {
    // Link NC to CAPA
    await linkNCToCapa(id, capaId);
    
    // Record activity
    await createNCActivity({
      non_conformance_id: id,
      action: 'CAPA workflow initiated',
      comments: comments || `Linked to CAPA ID: ${capaId}`,
      performed_by: userId
    });
    
    // Create notification
    await createNCNotification({
      non_conformance_id: id,
      message: `A CAPA process has been initiated for this non-conformance item`,
      notification_type: 'capa_initiated',
      target_users: [] // Will be sent to all relevant users
    });
  } catch (error) {
    console.error(`Error initiating CAPA workflow for non-conformance ${id}:`, error);
    throw error;
  }
};

/**
 * Checks if a non-conformance item requires escalation
 * based on status duration and returns relevant information
 */
export const checkEscalationRules = async (id: string): Promise<{
  requires_escalation: boolean;
  days_in_current_status: number;
  escalation_level: 'low' | 'medium' | 'high';
}> => {
  const { data, error } = await supabase
    .from('non_conformances')
    .select('status, updated_at')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error checking escalation rules for non-conformance ${id}:`, error);
    throw error;
  }
  
  const currentDate = new Date();
  const statusDate = new Date(data.updated_at);
  const diffTime = Math.abs(currentDate.getTime() - statusDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Define escalation rules based on days in current status
  let requires_escalation = false;
  let escalation_level: 'low' | 'medium' | 'high' = 'low';
  
  if (data.status === 'On Hold' && diffDays > 7) {
    requires_escalation = true;
    escalation_level = diffDays > 14 ? 'high' : 'medium';
  } else if (data.status === 'Under Review' && diffDays > 5) {
    requires_escalation = true;
    escalation_level = diffDays > 10 ? 'high' : 'medium';
  }
  
  return {
    requires_escalation,
    days_in_current_status: diffDays,
    escalation_level
  };
};
