
import { CAPAStatus } from '@/types/capa';

// Define UI display values for statuses
export type CAPAStatusDisplay = 'Open' | 'In Progress' | 'Closed' | 'Verified';

// Define database values for statuses
type DbCAPAStatus = 'open' | 'in_progress' | 'closed' | 'verified';

// Map from UI display to internal values
const statusToInternalMap: Record<CAPAStatusDisplay, CAPAStatus> = {
  'Open': 'open',
  'In Progress': 'in-progress',
  'Closed': 'closed',
  'Verified': 'verified'
};

// Map from internal to UI display values
const internalToStatusMap: Record<CAPAStatus, CAPAStatusDisplay> = {
  'open': 'Open',
  'in-progress': 'In Progress',
  'closed': 'Closed',
  'verified': 'Verified'
};

// Map from UI to Database values
const statusToDbMap: Record<CAPAStatus, DbCAPAStatus> = {
  'open': 'open',
  'in-progress': 'in_progress',
  'closed': 'closed',
  'verified': 'verified'
};

// Map from Database to UI values
const dbToStatusMap: Record<DbCAPAStatus, CAPAStatus> = {
  'open': 'open',
  'in_progress': 'in-progress',
  'closed': 'closed',
  'verified': 'verified'
};

export const mapStatusToInternal = (displayStatus: CAPAStatusDisplay): CAPAStatus => {
  return statusToInternalMap[displayStatus] || 'open';
};

export const mapInternalToStatus = (internalStatus: CAPAStatus): CAPAStatusDisplay => {
  return internalToStatusMap[internalStatus] || 'Open';
};

export const mapStatusToDatabaseValue = (status: CAPAStatus): DbCAPAStatus => {
  return statusToDbMap[status] || 'open';
};

export const mapDatabaseValueToStatus = (dbStatus: DbCAPAStatus): CAPAStatus => {
  return dbToStatusMap[dbStatus] || 'open';
};

// Export the mapping functions with alias names for backward compatibility
export const mapStatusToDb = mapStatusToDatabaseValue;
export const mapStatusFromDb = mapDatabaseValueToStatus;

// Get the next status in the workflow 
export const getNextStatus = (currentStatus: CAPAStatus): CAPAStatus => {
  switch (currentStatus) {
    case 'open':
      return 'in-progress';
    case 'in-progress':
      return 'closed';
    case 'closed':
      return 'verified';
    default:
      return 'open';
  }
};

// Check if a status transition is valid
export const isValidStatusTransition = (currentStatus: CAPAStatus, newStatus: CAPAStatus): boolean => {
  if (currentStatus === newStatus) return true;
  
  switch (currentStatus) {
    case 'open':
      return newStatus === 'in-progress' || newStatus === 'closed';
    case 'in-progress':
      return newStatus === 'open' || newStatus === 'closed';
    case 'closed':
      return newStatus === 'verified' || newStatus === 'in-progress';
    case 'verified':
      return newStatus === 'closed';
    default:
      return false;
  }
};

// Get all possible transitions for a status
export const getPossibleStatusTransitions = (currentStatus: CAPAStatus): CAPAStatus[] => {
  switch (currentStatus) {
    case 'open':
      return ['in-progress', 'closed'];
    case 'in-progress':
      return ['open', 'closed'];
    case 'closed':
      return ['verified', 'in-progress'];
    case 'verified':
      return ['closed'];
    default:
      return ['open'];
  }
};
