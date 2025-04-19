
import { CAPAStatus } from '@/types/capa';

export type DbCAPAStatus = 'open' | 'in_progress' | 'pending_verification' | 'closed' | 'verified' | 'cancelled';

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

export function mapStatusToDb(status: CAPAStatus): DbCAPAStatus {
  switch (status) {
    case 'open':
      return 'open';
    case 'in-progress':
      return 'in_progress';
    case 'pending-verification':
      return 'pending_verification';
    case 'closed':
      return 'closed';
    case 'verified':
      return 'verified';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'open';
  }
}

export function mapStatusFromDb(dbStatus: DbCAPAStatus): CAPAStatus {
  switch (dbStatus) {
    case 'open':
      return 'open';
    case 'in_progress':
      return 'in-progress';
    case 'pending_verification':
      return 'pending-verification';
    case 'closed':
      return 'closed';
    case 'verified':
      return 'verified';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'open';
  }
}
