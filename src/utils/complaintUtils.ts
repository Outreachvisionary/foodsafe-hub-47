
import { ComplaintStatus } from '@/types/complaint';

/**
 * Check if two status values are equivalent
 */
export const isComplaintStatusEqual = (status1: string | ComplaintStatus, status2: string | ComplaintStatus): boolean => {
  if (!status1 || !status2) return false;
  
  // Normalize status strings
  const normalize = (status: string | ComplaintStatus) => {
    return status.toString().toLowerCase().replace(/_/g, ' ');
  };
  
  return normalize(status1) === normalize(status2);
};

/**
 * Get display name for complaint status
 */
export const getComplaintStatusDisplayName = (status: string | ComplaintStatus): string => {
  if (!status) return 'Unknown';
  return status.toString().replace(/_/g, ' ');
};

/**
 * Get color scheme for complaint status badges
 */
export const getComplaintStatusColor = (status: string | ComplaintStatus): { bg: string, text: string, border?: string } => {
  const statusStr = status.toString().toLowerCase();
  
  if (statusStr.includes('new')) {
    return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
  } else if (statusStr.includes('investigation')) {
    return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
  } else if (statusStr.includes('resolved')) {
    return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
  } else if (statusStr.includes('closed')) {
    return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
  } else if (statusStr.includes('reopened')) {
    return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
  }
  
  return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
};

/**
 * Convert string to ComplaintStatus enum value
 */
export const convertToComplaintStatus = (status: string): ComplaintStatus => {
  const normalized = status.replace(/\s+/g, '_');
  
  switch (normalized.toLowerCase()) {
    case 'new':
      return 'New';
    case 'under_investigation':
      return 'Under_Investigation';
    case 'resolved':
      return 'Resolved';
    case 'closed':
      return 'Closed';
    case 'reopened':
      return 'Reopened';
    default:
      return 'New';
  }
};

export default {
  isComplaintStatusEqual,
  getComplaintStatusDisplayName,
  getComplaintStatusColor,
  convertToComplaintStatus
};
