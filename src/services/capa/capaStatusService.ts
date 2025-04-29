
import { CAPAStatus } from '@/types/enums';

// Create a service to check CAPA status
export const isStatusEqual = (status: CAPAStatus | string, targetStatus: string): boolean => {
  if (!status) return false;
  const normalizedStatus = typeof status === 'string' ? 
    status.replace(/ /g, '_').toLowerCase() : 
    status.toLowerCase();
  
  const normalizedTargetStatus = targetStatus.replace(/ /g, '_').toLowerCase();
  
  return normalizedStatus === normalizedTargetStatus;
};

export default {
  isStatusEqual,
};
