
import { CAPAStatus } from '@/types/capa';

// Define database values for statuses
type DbCAPAStatus = 'open' | 'in_progress' | 'closed' | 'verified';

// Map from UI to Database values
const statusToDbMap: Record<CAPAStatus, DbCAPAStatus> = {
  'Open': 'open',
  'In Progress': 'in_progress',
  'Closed': 'closed',
  'Verified': 'verified'
};

// Map from Database to UI values
const dbToStatusMap: Record<DbCAPAStatus, CAPAStatus> = {
  'open': 'Open',
  'in_progress': 'In Progress',
  'closed': 'Closed',
  'verified': 'Verified'
};

export const mapStatusToDatabaseValue = (status: CAPAStatus): DbCAPAStatus => {
  return statusToDbMap[status] || 'open';
};

export const mapDatabaseValueToStatus = (dbStatus: DbCAPAStatus): CAPAStatus => {
  return dbToStatusMap[dbStatus] || 'Open';
};

// Get the next status in the workflow 
export const getNextStatus = (currentStatus: CAPAStatus): CAPAStatus => {
  switch (currentStatus) {
    case 'Open':
      return 'In Progress';
    case 'In Progress':
      return 'Closed';
    case 'Closed':
      return 'Verified';
    default:
      return 'Open';
  }
};

// Check if a status transition is valid
export const isValidStatusTransition = (currentStatus: CAPAStatus, newStatus: CAPAStatus): boolean => {
  if (currentStatus === newStatus) return true;
  
  switch (currentStatus) {
    case 'Open':
      return newStatus === 'In Progress' || newStatus === 'Closed';
    case 'In Progress':
      return newStatus === 'Open' || newStatus === 'Closed';
    case 'Closed':
      return newStatus === 'Verified' || newStatus === 'In Progress';
    case 'Verified':
      return newStatus === 'Closed';
    default:
      return false;
  }
};

// Get all possible transitions for a status
export const getPossibleStatusTransitions = (currentStatus: CAPAStatus): CAPAStatus[] => {
  switch (currentStatus) {
    case 'Open':
      return ['In Progress', 'Closed'];
    case 'In Progress':
      return ['Open', 'Closed'];
    case 'Closed':
      return ['Verified', 'In Progress'];
    case 'Verified':
      return ['Closed'];
    default:
      return ['Open'];
  }
};
