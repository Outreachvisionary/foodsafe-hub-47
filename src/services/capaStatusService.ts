
import { CAPAStatus, mapStatusToDb, mapDbStatusToInternal } from '@/types/capa';

// This function is now deprecated, use the one from @/types/capa instead
export function mapInternalToStatus(status: CAPAStatus): string {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in-progress':
      return 'In Progress';
    case 'pending-verification':
      return 'Pending Verification';
    case 'closed':
      return 'Closed';
    case 'verified':
      return 'Verified';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

// This function is now deprecated, use the one from @/types/capa instead
export function mapStatusToInternal(status: string): CAPAStatus {
  switch (status.toLowerCase().replace(/\s+/g, '-')) {
    case 'open':
      return 'open';
    case 'in-progress':
    case 'in-process':
    case 'investigating':
      return 'in-progress';
    case 'pending-verification':
    case 'pending-review':
      return 'pending-verification';
    case 'closed':
    case 'complete':
    case 'completed':
      return 'closed';
    case 'verified':
    case 'validated':
      return 'verified';
    case 'cancelled':
    case 'canceled':
      return 'cancelled';
    default:
      return 'open';
  }
}

// These functions are now deprecated, use the ones from @/types/capa instead
export { mapStatusToDb, mapDbStatusToInternal };

export default {
  mapStatusToDb,
  mapDbStatusToInternal,
  mapInternalToStatus,
  mapStatusToInternal
};
