
import { CAPAStatus } from '@/types/capa';
import { mapInternalStatusToDb, mapDbStatusToInternal } from '@/services/capa/capaStatusMapper';

// This function is now deprecated, use the one from capaStatusMapper instead
export function mapInternalToStatus(status: CAPAStatus): string {
  return status;
}

// This function is now deprecated, use the one from capaStatusMapper instead
export function mapStatusToInternal(status: string): CAPAStatus {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
  
  switch (normalizedStatus) {
    case 'open':
      return 'Open';
    case 'in-progress':
    case 'in-process':
    case 'investigating':
      return 'In_Progress';
    case 'pending-verification':
    case 'pending-review':
      return 'Pending_Verification';
    case 'closed':
    case 'complete':
    case 'completed':
      return 'Closed';
    case 'verified':
    case 'validated':
      return 'Verified';
    case 'overdue':
      return 'Overdue';
    default:
      return 'Open';
  }
}

// Check if status is equal (case-insensitive)
export const isStatusEqual = (status1: string, status2: string): boolean => {
  if (!status1 || !status2) return false;
  return status1.toLowerCase().replace(/[_\s-]/g, '') === status2.toLowerCase().replace(/[_\s-]/g, '');
};

// Export functions from capaStatusMapper
export { mapInternalStatusToDb, mapDbStatusToInternal };

export default {
  mapInternalStatusToDb,
  mapDbStatusToInternal,
  mapInternalToStatus,
  mapStatusToInternal,
  isStatusEqual
};
