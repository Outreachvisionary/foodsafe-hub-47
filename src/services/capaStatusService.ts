
import { CAPAStatus } from '@/types/enums';
import { stringToCAPAStatus } from '@/utils/capaAdapters';

// Get all possible next statuses based on current status
export const getNextValidStatuses = (currentStatus: CAPAStatus | string): CAPAStatus[] => {
  // Convert string status to enum if needed
  const status = typeof currentStatus === 'string' 
    ? stringToCAPAStatus(currentStatus)
    : currentStatus;
  
  switch (status) {
    case CAPAStatus.Open:
      // From Open, can move to In_Progress or On_Hold
      return [CAPAStatus.InProgress, CAPAStatus.OnHold];
      
    case CAPAStatus.InProgress:
      // From In_Progress, can move to Completed, On_Hold, or Pending_Verification
      return [CAPAStatus.Completed, CAPAStatus.OnHold, CAPAStatus.PendingVerification];
      
    case CAPAStatus.PendingVerification:
      // From Pending_Verification, can move to Verified, Rejected, or In_Progress (if needing more work)
      return [CAPAStatus.Verified, CAPAStatus.Rejected, CAPAStatus.InProgress];
      
    case CAPAStatus.Verified:
      // From Verified, can only move to Closed
      return [CAPAStatus.Closed];
      
    case CAPAStatus.Rejected:
      // From Rejected, can move back to In_Progress for more work
      return [CAPAStatus.InProgress];
      
    case CAPAStatus.OnHold:
      // From On_Hold, can move to Open or In_Progress
      return [CAPAStatus.Open, CAPAStatus.InProgress];
    
    default:
      // Default, return all statuses
      return Object.values(CAPAStatus);
  }
};

// Check if a status can be moved to another
export const canChangeStatus = (currentStatus: CAPAStatus | string, newStatus: CAPAStatus | string): boolean => {
  const fromStatus = typeof currentStatus === 'string' ? stringToCAPAStatus(currentStatus) : currentStatus;
  const toStatus = typeof newStatus === 'string' ? stringToCAPAStatus(newStatus) : newStatus;
  
  const validNextStatuses = getNextValidStatuses(fromStatus);
  return validNextStatuses.includes(toStatus);
};

// Get status transitions for workflow visualization
export const getStatusTransitions = () => {
  return [
    { from: CAPAStatus.Open, to: CAPAStatus.InProgress },
    { from: CAPAStatus.Open, to: CAPAStatus.OnHold },
    { from: CAPAStatus.InProgress, to: CAPAStatus.Completed },
    { from: CAPAStatus.InProgress, to: CAPAStatus.PendingVerification },
    { from: CAPAStatus.InProgress, to: CAPAStatus.OnHold },
    { from: CAPAStatus.PendingVerification, to: CAPAStatus.Verified },
    { from: CAPAStatus.PendingVerification, to: CAPAStatus.Rejected },
    { from: CAPAStatus.PendingVerification, to: CAPAStatus.InProgress },
    { from: CAPAStatus.Verified, to: CAPAStatus.Closed },
    { from: CAPAStatus.Rejected, to: CAPAStatus.InProgress },
    { from: CAPAStatus.OnHold, to: CAPAStatus.Open },
    { from: CAPAStatus.OnHold, to: CAPAStatus.InProgress }
  ];
};
