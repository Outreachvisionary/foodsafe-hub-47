
import { CAPAStatus } from '@/types/capa';

/**
 * Compares two CAPA statuses for equality, handling both string formats (with spaces or underscores)
 * @param status1 First status to compare
 * @param status2 Second status to compare
 * @returns true if the statuses are equivalent
 */
export const isStatusEqual = (status1: string | CAPAStatus, status2: string | CAPAStatus): boolean => {
  const normalized1 = normalizeStatus(status1);
  const normalized2 = normalizeStatus(status2);
  return normalized1 === normalized2;
};

/**
 * Normalizes a status string by replacing spaces with underscores and converting to lowercase
 * @param status Status to normalize
 * @returns Normalized status string
 */
export const normalizeStatus = (status: string | CAPAStatus): string => {
  if (!status) return '';
  return status.toString().toLowerCase().replace(/ /g, '_');
};

/**
 * Maps a string status to the CAPAStatus enum value
 * @param status Status string to map
 * @returns The corresponding CAPAStatus enum value
 */
export const mapToCAPAStatus = (status: string): CAPAStatus => {
  const normalized = normalizeStatus(status);
  
  switch(normalized) {
    case 'open': return 'Open';
    case 'in_progress': return 'In_Progress';
    case 'under_review': return 'Under_Review';
    case 'completed': return 'Completed';
    case 'closed': return 'Closed';
    case 'rejected': return 'Rejected';
    case 'on_hold': return 'On_Hold';
    case 'overdue': return 'Overdue';
    case 'pending_verification': return 'Pending_Verification';
    case 'verified': return 'Verified';
    default: return 'Open';
  }
};

/**
 * Maps a CAPAStatus enum value to a display-friendly string
 * @param status CAPAStatus enum value
 * @returns A human-readable status string
 */
export const getCAPAStatusLabel = (status: CAPAStatus): string => {
  switch(status) {
    case 'In_Progress': return 'In Progress';
    case 'Under_Review': return 'Under Review';
    case 'Pending_Verification': return 'Pending Verification';
    default: return status;
  }
};
