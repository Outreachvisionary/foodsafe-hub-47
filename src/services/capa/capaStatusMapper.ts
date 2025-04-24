
import { CAPAStatus } from '@/types/capa';

export type DbCAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | 'Verified';

// Map database status to internal application status
export const mapDbStatusToInternal = (dbStatus: DbCAPAStatus): CAPAStatus => {
  switch (dbStatus) {
    case 'Open':
      return 'Open';
    case 'In Progress':
      return 'In_Progress';
    case 'Closed':
      return 'Closed';
    case 'Overdue':
      return 'Overdue';
    case 'Pending Verification':
      return 'Pending_Verification';
    case 'Verified':
      return 'Verified';
    default:
      return 'Open';
  }
};

// Map internal application status to database status
export const mapInternalStatusToDb = (internalStatus: CAPAStatus): DbCAPAStatus => {
  switch (internalStatus) {
    case 'Open':
      return 'Open';
    case 'In_Progress':
      return 'In Progress';
    case 'Closed':
      return 'Closed';
    case 'Overdue':
      return 'Overdue';
    case 'Pending_Verification':
      return 'Pending Verification';
    case 'Verified':
      return 'Verified';
    default:
      return 'Open';
  }
};

export const mapStatusToInternal = mapDbStatusToInternal;
