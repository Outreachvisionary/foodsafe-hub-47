
import { Complaint, ComplaintStatus, ComplaintCategory, ComplaintPriority } from '@/types/complaint';

/**
 * Maps a complaint object to the database-friendly format
 */
export const mapComplaintToDb = (complaint: Partial<Complaint>) => {
  return {
    ...complaint
  };
};

/**
 * Checks if a complaint status is equal to a target status
 */
export const isComplaintStatusEqual = (status: any, targetStatus: ComplaintStatus): boolean => {
  if (!status) return false;
  
  // Handle string comparison, normalizing underscores vs. spaces
  if (typeof status === 'string' && typeof targetStatus === 'string') {
    const normalizedStatus = status.replace(/ /g, '_').toLowerCase();
    const normalizedTarget = targetStatus.replace(/ /g, '_').toLowerCase();
    return normalizedStatus === normalizedTarget;
  }
  
  return status === targetStatus;
};
