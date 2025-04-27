
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
    case 'On_Hold': return 'On Hold';
    default: return status.replace(/_/g, ' ');
  }
};

/**
 * Maps a database status string to the CAPAStatus enum value
 * @param dbStatus Status string from database
 * @returns The corresponding CAPAStatus enum value
 */
export const mapDBToCAPAStatus = (dbStatus: string): CAPAStatus => {
  const statusMap: Record<string, CAPAStatus> = {
    'Open': 'Open',
    'In Progress': 'In_Progress',
    'Under Review': 'Under_Review',
    'Completed': 'Completed',
    'Closed': 'Closed',
    'Rejected': 'Rejected',
    'On Hold': 'On_Hold',
    'Overdue': 'Overdue',
    'Pending Verification': 'Pending_Verification',
    'Verified': 'Verified'
  };
  
  return statusMap[dbStatus] || 'Open';
};

/**
 * Maps a CAPAStatus enum value to a database-friendly string
 * @param status CAPAStatus enum value
 * @returns A database-compatible status string
 */
export const mapCAPAStatusToDB = (status: CAPAStatus): string => {
  const statusMap: Record<string, string> = {
    'Open': 'Open',
    'In_Progress': 'In Progress',
    'Under_Review': 'Under Review',
    'Completed': 'Completed',
    'Closed': 'Closed',
    'Rejected': 'Rejected',
    'On_Hold': 'On Hold',
    'Overdue': 'Overdue',
    'Pending_Verification': 'Pending Verification',
    'Verified': 'Verified'
  };
  
  return statusMap[status] || 'Open';
};
