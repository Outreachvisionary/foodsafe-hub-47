
import { CAPAStatus, DbCAPAStatus } from '@/types/capa';

// Map from application CAPAStatus to database status string
export const mapStatusToDb = (status: CAPAStatus): DbCAPAStatus => {
  switch (status) {
    case 'Open': return 'Open';
    case 'In Progress': return 'In Progress';
    case 'Closed': return 'Closed';
    case 'Overdue': return 'Overdue';
    case 'Pending Verification': return 'Pending Verification';
    case 'Verified': return 'Verified';
    default: return ensureValidDbStatus(status as string);
  }
};

// Map from database status string to application CAPAStatus
export const mapDbStatusToInternal = (dbStatus: string): CAPAStatus => {
  switch (dbStatus) {
    case 'Open': return 'Open';
    case 'In Progress': return 'In Progress';
    case 'Closed': return 'Closed';
    case 'Overdue': return 'Overdue';
    case 'Pending Verification': return 'Pending Verification';
    case 'Verified': return 'Verified';
    default: return dbStatus as CAPAStatus;
  }
};

// Helper function to ensure a string status is a valid database status
export const ensureValidDbStatus = (status: string): DbCAPAStatus => {
  switch (status.replace(' ', '_')) {
    case 'Open': return 'Open';
    case 'In_Progress': 
    case 'In Progress': return 'In Progress';
    case 'Closed': return 'Closed';
    case 'Overdue': return 'Overdue';
    case 'Pending_Verification':
    case 'Pending Verification': return 'Pending Verification';
    case 'Verified': return 'Verified';
    // Map any non-matching status to a default
    default: return 'Open';
  }
};

// Helper function to convert from any string format to proper CAPAStatus
export const normalizeStatus = (status: string): CAPAStatus => {
  const lowerStatus = status.toLowerCase();
  
  if (lowerStatus === 'open') return 'Open';
  if (lowerStatus === 'in progress' || lowerStatus === 'in_progress') return 'In Progress';
  if (lowerStatus === 'closed') return 'Closed';
  if (lowerStatus === 'overdue') return 'Overdue';
  if (lowerStatus === 'pending verification' || lowerStatus === 'pending_verification') return 'Pending Verification';
  if (lowerStatus === 'verified') return 'Verified';
  
  return 'Open'; // Default fallback
};
