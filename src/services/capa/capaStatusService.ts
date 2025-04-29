
import { CAPAStatus } from '@/types/enums';

/**
 * Compares a CAPA status value with a target status string
 * @param status The current status (can be enum or string)
 * @param targetStatus The target status to compare with
 * @returns boolean indicating if statuses match
 */
export const isStatusEqual = (status: CAPAStatus | string, targetStatus: string): boolean => {
  if (!status) return false;
  
  const normalizedStatus = typeof status === 'string' ? 
    status.replace(/ /g, '_').toLowerCase() : 
    status.toLowerCase();
  
  const normalizedTargetStatus = targetStatus.replace(/ /g, '_').toLowerCase();
  
  return normalizedStatus === normalizedTargetStatus;
};

export default {
  isStatusEqual
};
