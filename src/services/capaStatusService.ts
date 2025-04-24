
import { CAPAStatus } from '@/types/capa';
import { mapStatusToDb, mapDbStatusToInternal } from '@/services/capa/capaStatusMapper';

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
      return 'In Progress';
    case 'pending-verification':
    case 'pending-review':
      return 'Pending Verification';
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

// These functions are now deprecated, use the ones from capaStatusMapper instead
export { mapStatusToDb, mapDbStatusToInternal };

// Check if status is equal (case-insensitive)
export const isStatusEqual = (status1: string, status2: string): boolean => {
  if (!status1 || !status2) return false;
  return status1.toLowerCase().replace(/[_\s-]/g, '') === status2.toLowerCase().replace(/[_\s-]/g, '');
};

export default {
  mapStatusToDb,
  mapDbStatusToInternal,
  mapInternalToStatus,
  mapStatusToInternal,
  isStatusEqual
};
