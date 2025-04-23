
import { CAPAStatus } from '@/types/capa';

export const mapStatusToDb = (status: CAPAStatus): string => {
  switch (status.toLowerCase()) {
    case 'open': return 'Open';
    case 'in progress': return 'In_Progress';
    case 'closed': return 'Closed';
    case 'overdue': return 'Overdue';
    case 'pending verification': return 'Pending_Verification';
    default: return status;
  }
};

export const mapDbStatusToInternal = (dbStatus: string): CAPAStatus => {
  switch (dbStatus) {
    case 'Open': return 'Open';
    case 'In_Progress': return 'In Progress';
    case 'Closed': return 'Closed';
    case 'Overdue': return 'Overdue';
    case 'Pending_Verification': return 'Pending Verification';
    default: return dbStatus as CAPAStatus;
  }
};

// Helper function to ensure a string status is a valid database status
export const ensureValidDbStatus = (status: string): "Open" | "In_Progress" | "Closed" | "Overdue" | "Pending_Verification" => {
  switch (status) {
    case 'Open': return 'Open';
    case 'In_Progress': return 'In_Progress';
    case 'Closed': return 'Closed';
    case 'Overdue': return 'Overdue';
    case 'Pending_Verification': return 'Pending_Verification';
    // Map any non-matching status to a default
    default: return 'Open';
  }
};
