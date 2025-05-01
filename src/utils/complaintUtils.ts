
import { ComplaintStatus } from '@/types/enums';

/**
 * Compares a string or ComplaintStatus value with a target ComplaintStatus value
 * Handles both string and enum comparisons safely
 */
export const isComplaintStatusEqual = (
  status: string | ComplaintStatus | undefined,
  targetStatus: ComplaintStatus
): boolean => {
  if (!status) return false;
  
  if (typeof status === 'string') {
    // Convert string to normalized form for comparison
    const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
    const normalizedTarget = targetStatus.toString().replace(/ /g, '_').toUpperCase();
    return normalizedStatus === normalizedTarget;
  }
  
  return status === targetStatus;
};

/**
 * Converts a string value to a ComplaintStatus enum
 */
export const stringToComplaintStatus = (status: string): ComplaintStatus => {
  // Normalize string and match with enum
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  const enumValue = ComplaintStatus[normalizedStatus as keyof typeof ComplaintStatus];
  return enumValue || ComplaintStatus.New;
};

/**
 * Formats a ComplaintStatus enum value to a display string
 */
export const formatComplaintStatus = (status: ComplaintStatus): string => {
  return status.toString().replace(/_/g, ' ');
};
