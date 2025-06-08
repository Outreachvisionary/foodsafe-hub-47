
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
      // From Open, can move to In_Progress or Cancelled
      return [CAPAStatus.In_Progress, CAPAStatus.Cancelled];
      
    case CAPAStatus.In_Progress:
      // From In_Progress, can move to Under_Review or Pending_Verification
      return [CAPAStatus.Under_Review, CAPAStatus.Pending_Verification];
      
    case CAPAStatus.Pending_Verification:
      // From Pending_Verification, can move to Closed or back to In_Progress
      return [CAPAStatus.Closed, CAPAStatus.In_Progress];
      
    case CAPAStatus.Under_Review:
      // From Under_Review, can move to In_Progress or Cancelled
      return [CAPAStatus.In_Progress, CAPAStatus.Cancelled];
      
    case CAPAStatus.Closed:
      // From Closed, can reopen to In_Progress
      return [CAPAStatus.In_Progress];
      
    case CAPAStatus.Cancelled:
      // From Cancelled, can reopen to Open
      return [CAPAStatus.Open];
    
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
    { from: CAPAStatus.Open, to: CAPAStatus.In_Progress },
    { from: CAPAStatus.Open, to: CAPAStatus.Cancelled },
    { from: CAPAStatus.In_Progress, to: CAPAStatus.Under_Review },
    { from: CAPAStatus.In_Progress, to: CAPAStatus.Pending_Verification },
    { from: CAPAStatus.Under_Review, to: CAPAStatus.In_Progress },
    { from: CAPAStatus.Under_Review, to: CAPAStatus.Cancelled },
    { from: CAPAStatus.Pending_Verification, to: CAPAStatus.Closed },
    { from: CAPAStatus.Pending_Verification, to: CAPAStatus.In_Progress },
    { from: CAPAStatus.Closed, to: CAPAStatus.In_Progress },
    { from: CAPAStatus.Cancelled, to: CAPAStatus.Open }
  ];
};
