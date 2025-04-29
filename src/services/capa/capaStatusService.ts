
import { CAPAStatus } from '@/types/enums';

// Create a service to check CAPA status
export const isStatusEqual = (status: CAPAStatus | string, targetStatus: string): boolean => {
  if (!status) return false;
  const normalizedStatus = typeof status === 'string' ? 
    status.replace(/ /g, '_').toLowerCase() : 
    status.toLowerCase();
  
  const normalizedTargetStatus = targetStatus.replace(/ /g, '_').toLowerCase();
  
  return normalizedStatus === normalizedTargetStatus;
};

// Helper function to convert string to CAPAStatus enum
export const mapStringToCAPAStatus = (status: string): CAPAStatus => {
  // Convert spaces to underscores and ensure proper case format
  const normalizedStatus = status.replace(/ /g, '_');
  
  // Try to match the normalized status to a CAPAStatus enum value
  switch (normalizedStatus) {
    case 'Open': return CAPAStatus.Open;
    case 'In_Progress': return CAPAStatus.InProgress;
    case 'Under_Review': return CAPAStatus.UnderReview;
    case 'Completed': return CAPAStatus.Completed;
    case 'Closed': return CAPAStatus.Closed;
    case 'Rejected': return CAPAStatus.Rejected;
    case 'On_Hold': return CAPAStatus.OnHold;
    case 'Overdue': return CAPAStatus.Overdue;
    case 'Pending_Verification': return CAPAStatus.PendingVerification;
    case 'Verified': return CAPAStatus.Verified;
    default: return CAPAStatus.Open; // Default to Open if no match
  }
};

export default {
  isStatusEqual,
  mapStringToCAPAStatus
};
