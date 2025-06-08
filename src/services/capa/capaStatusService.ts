
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
      return [CAPAStatus.In_Progress, CAPAStatus.Cancelled];
      
    case CAPAStatus.In_Progress:
      return [CAPAStatus.Under_Review, CAPAStatus.Pending_Verification];
      
    case CAPAStatus.Under_Review:
      return [CAPAStatus.In_Progress, CAPAStatus.Cancelled];
      
    case CAPAStatus.Pending_Verification:
      return [CAPAStatus.Closed, CAPAStatus.In_Progress];
      
    case CAPAStatus.Closed:
      return [CAPAStatus.In_Progress]; // Reopen
      
    case CAPAStatus.Cancelled:
      return [CAPAStatus.Open]; // Reconsider
      
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
    case CAPAStatus.Open.toLowerCase():
      return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      
    case CAPAStatus.In_Progress.toLowerCase().replace(/_/g, ' '):
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      
    case CAPAStatus.Closed.toLowerCase():
      return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      
    case CAPAStatus.Cancelled.toLowerCase():
      return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      
    case CAPAStatus.Pending_Verification.toLowerCase().replace(/_/g, ' '):
      return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
      
    case CAPAStatus.Under_Review.toLowerCase().replace(/_/g, ' '):
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
