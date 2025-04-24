
import { CAPAStatus } from '@/types/capa';

// This type corresponds to the database enum type
export type DbCAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | 'Verified';

// Map internal application status to the database format
export const mapInternalStatusToDb = (status: CAPAStatus): DbCAPAStatus => {
  switch (status) {
    case 'In_Progress':
      return 'In Progress';
    case 'Pending_Verification':
      return 'Pending Verification';
    default:
      return status as DbCAPAStatus;
  }
};

// Map database status to internal application status
export const mapDbStatusToInternal = (dbStatus: DbCAPAStatus): CAPAStatus => {
  switch (dbStatus) {
    case 'In Progress':
      return 'In_Progress';
    case 'Pending Verification':
      return 'Pending_Verification';
    default:
      return dbStatus as CAPAStatus;
  }
};
