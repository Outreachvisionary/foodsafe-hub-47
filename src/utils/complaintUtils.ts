
import { ComplaintStatus } from '@/types/complaint';

/**
 * Check if two status values are equivalent
 */
export const isComplaintStatusEqual = (status1: string | ComplaintStatus, status2: string | ComplaintStatus): boolean => {
  if (!status1 || !status2) return false;
  
  // Normalize status strings - handle both underscore and space variations
  const normalize = (status: string | ComplaintStatus) => {
    return status.toString().toLowerCase().replace(/[_\s]/g, '');
  };
  
  return normalize(status1) === normalize(status2);
};

/**
 * Get display name for complaint status
 */
export const getComplaintStatusDisplayName = (status: string | ComplaintStatus): string => {
  if (!status) return 'Unknown';
  
  // Convert database format to display format
  const statusMap: Record<string, string> = {
    'Under_Investigation': 'Under Investigation',
    'Under Investigation': 'Under Investigation',
    'Product_Quality': 'Product Quality',
    'Product Quality': 'Product Quality',
    'Foreign_Material': 'Foreign Material',
    'Foreign Material': 'Foreign Material',
    'Customer_Service': 'Customer Service',
    'Customer Service': 'Customer Service'
  };
  
  return statusMap[status.toString()] || status.toString();
};

/**
 * Get color scheme for complaint status badges
 */
export const getComplaintStatusColor = (status: string | ComplaintStatus): { bg: string, text: string, border?: string } => {
  const statusStr = status.toString().toLowerCase().replace(/[_\s]/g, '');
  
  if (statusStr.includes('new')) {
    return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
  } else if (statusStr.includes('under') || statusStr.includes('investigation')) {
    return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
  } else if (statusStr.includes('resolved')) {
    return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
  } else if (statusStr.includes('closed')) {
    return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
  } else if (statusStr.includes('escalated')) {
    return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
  }
  
  return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
};

/**
 * Convert string to ComplaintStatus enum value
 */
export const convertToComplaintStatus = (status: string): ComplaintStatus => {
  const statusMap: Record<string, ComplaintStatus> = {
    'new': 'New',
    'under_investigation': 'Under Investigation',
    'under investigation': 'Under Investigation',
    'resolved': 'Resolved',
    'closed': 'Closed',
    'escalated': 'Escalated'
  };
  
  const normalized = status.toLowerCase().replace(/[_\s]/g, '_');
  return statusMap[normalized] || 'New';
};

export default {
  isComplaintStatusEqual,
  getComplaintStatusDisplayName,
  getComplaintStatusColor,
  convertToComplaintStatus
};
