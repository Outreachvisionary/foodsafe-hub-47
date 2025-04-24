
import { CAPAStatus } from '@/types/capa';

// This type corresponds to the database enum type
export type DbCAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | 'Verified';

// Map internal application status to the database format
export function mapInternalStatusToDb(status: CAPAStatus): DbCAPAStatus {
  switch (status) {
    case 'In_Progress':
      return 'In Progress';
    case 'Pending_Verification':
      return 'Pending Verification';
    default:
      return status as DbCAPAStatus;
  }
}

// Map database status to internal application status
export function mapDbStatusToInternal(dbStatus: DbCAPAStatus): CAPAStatus {
  switch (dbStatus) {
    case 'In Progress':
      return 'In_Progress';
    case 'Pending Verification':
      return 'Pending_Verification';
    default:
      return dbStatus as CAPAStatus;
  }
}

// Export convenience aliases
export const internalToDbStatusMap = mapInternalStatusToDb;
export const dbToInternalStatusMap = mapDbStatusToInternal;

// Check if status is equal (case-insensitive)
export const isStatusEqual = (status1: string, status2: string): boolean => {
  if (!status1 || !status2) return false;
  return status1.toLowerCase().replace(/[_\s-]/g, '') === status2.toLowerCase().replace(/[_\s-]/g, '');
};

export default {
  mapInternalStatusToDb,
  mapDbStatusToInternal,
  isStatusEqual
};
