
import { CAPAStatus } from '@/types/capa';

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
