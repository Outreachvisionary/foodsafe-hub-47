
import { CAPAStatus } from '@/types/capa';

// These are the actual status values allowed in the database table
export type DbCAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification';

// Map frontend status values to database status values
export const mapStatusToDb = (status: CAPAStatus): DbCAPAStatus => {
  const statusMap: Record<CAPAStatus, DbCAPAStatus> = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'closed': 'Closed',
    'verified': 'Closed' // Map 'verified' to 'Closed' since we don't have a 'Verified' option in database
  };
  return statusMap[status] || 'Open';
};

// Map database status values to frontend status values
export const mapStatusFromDb = (dbStatus: string): CAPAStatus => {
  const dbStatusLower = dbStatus.toLowerCase();
  if (dbStatusLower === 'in progress') return 'in-progress';
  if (['open', 'closed', 'verified'].includes(dbStatusLower)) {
    return dbStatusLower as CAPAStatus;
  }
  return 'open';
};
