
import { CAPAStatus } from '@/types/enums';

/**
 * Check if two status values are equivalent, handling different formats
 */
export const isStatusEqual = (status: CAPAStatus | string, targetStatus: CAPAStatus | string): boolean => {
  if (!status || !targetStatus) return false;
  
  // Normalize both status strings to lowercase without underscores
  const normalizeStatus = (s: string): string => {
    return s.replace(/_/g, ' ').toLowerCase();
  };
  
  const normalizedStatus = normalizeStatus(status.toString());
  const normalizedTarget = normalizeStatus(targetStatus.toString());
  
  return normalizedStatus === normalizedTarget;
};

/**
 * Get the next available statuses based on current status
 */
export const getNextAvailableStatuses = (currentStatus: CAPAStatus): CAPAStatus[] => {
  switch (currentStatus) {
    case CAPAStatus.Open:
      return [CAPAStatus.InProgress, CAPAStatus.Rejected, CAPAStatus.OnHold];
      
    case CAPAStatus.InProgress:
      return [CAPAStatus.OnHold, CAPAStatus.Completed, CAPAStatus.PendingVerification];
      
    case CAPAStatus.OnHold:
      return [CAPAStatus.InProgress, CAPAStatus.Rejected];
      
    case CAPAStatus.Completed:
      return [CAPAStatus.PendingVerification, CAPAStatus.Verified, CAPAStatus.Closed];
      
    case CAPAStatus.PendingVerification:
      return [CAPAStatus.Verified, CAPAStatus.InProgress];
      
    case CAPAStatus.Verified:
      return [CAPAStatus.Closed];
      
    case CAPAStatus.Closed:
      return [CAPAStatus.InProgress]; // Reopen
      
    case CAPAStatus.Rejected:
      return [CAPAStatus.Open]; // Reconsider
      
    case CAPAStatus.Overdue:
      return [CAPAStatus.InProgress, CAPAStatus.OnHold, CAPAStatus.Rejected];
      
    case CAPAStatus.UnderReview:
      return [CAPAStatus.InProgress, CAPAStatus.OnHold, CAPAStatus.Rejected];
      
    default:
      return [CAPAStatus.Open];
  }
};

/**
 * Get display name for a status value
 */
export const getStatusDisplayName = (status: CAPAStatus | string): string => {
  if (!status) return 'Unknown';
  
  return status.toString().replace(/_/g, ' ');
};

/**
 * Get color information for status badge
 */
export const getStatusColorInfo = (status: CAPAStatus | string): { bg: string; text: string; border?: string } => {
  if (!status) return { bg: 'bg-gray-100', text: 'text-gray-800' };
  
  const statusStr = status.toString().toLowerCase();
  
  switch (statusStr) {
    case 'open':
      return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      
    case 'in_progress':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      
    case 'completed':
      return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      
    case 'closed':
      return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
      
    case 'rejected':
      return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      
    case 'on_hold':
      return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' };
      
    case 'overdue':
      return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      
    case 'pending_verification':
      return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
      
    case 'verified':
      return { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' };
      
    case 'under_review':
      return { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' };
      
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
  }
};

export default {
  isStatusEqual,
  getNextAvailableStatuses,
  getStatusDisplayName,
  getStatusColorInfo
};
