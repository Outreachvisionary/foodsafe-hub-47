
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
