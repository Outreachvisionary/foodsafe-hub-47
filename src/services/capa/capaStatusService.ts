
import { CAPAStatus } from '@/types/capa';
import { mapInternalStatusToDb } from './capaStatusMapper';

/**
 * Safely compares CAPA statuses, handling variant formats
 * Useful because status can be stored in different formats (with underscore or space)
 */
export const isStatusEqual = (status1: CAPAStatus | string, status2: CAPAStatus | string): boolean => {
  // Normalize both statuses to the same format (replace underscores with spaces)
  const normalizeStatus = (status: string): string => {
    return status.replace('_', ' ');
  };

  return normalizeStatus(status1) === normalizeStatus(status2);
};

/**
 * Checks if a CAPA status is considered "closed" (includes Closed and Verified)
 */
export const isClosed = (status: CAPAStatus): boolean => {
  return status === 'Closed' || status === 'Verified';
};

/**
 * Gets the appropriate CSS style class based on the CAPA status
 */
export const getStatusColor = (status: CAPAStatus): string => {
  if (isStatusEqual(status, 'Open')) {
    return 'text-blue-600';
  } else if (isStatusEqual(status, 'In_Progress')) {
    return 'text-yellow-600';
  } else if (isStatusEqual(status, 'Closed')) {
    return 'text-gray-600';
  } else if (isStatusEqual(status, 'Overdue')) {
    return 'text-red-600';
  } else if (isStatusEqual(status, 'Pending_Verification')) {
    return 'text-purple-600';
  } else if (isStatusEqual(status, 'Verified')) {
    return 'text-green-600';
  }
  return 'text-gray-600';
};
