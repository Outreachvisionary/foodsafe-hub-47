
import { CAPAStatus } from '@/types/capa';

// Convert from UI status display to database status value
export const mapStatusToDb = (status: CAPAStatus): string => {
  switch (status) {
    case 'Open': return 'open';
    case 'In Progress': return 'in_progress';
    case 'Closed': return 'closed';
    case 'Verified': return 'verified';
    default: return 'open';
  }
};

// Convert from database status value to UI status display
export const mapStatusFromDb = (dbStatus: string): CAPAStatus => {
  switch (dbStatus) {
    case 'open': return 'Open';
    case 'in_progress': return 'In Progress';
    case 'closed': return 'Closed';
    case 'verified': return 'Verified';
    default: return 'Open';
  }
};

export default {
  mapStatusToDb,
  mapStatusFromDb
};
