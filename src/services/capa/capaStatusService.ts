
import { CAPAStatus, CAPAEffectivenessRating } from '@/types/capa';

export type DbCAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | 'Verified';
export type DbCAPAEffectivenessRating = 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Verified' | 'Adequate' | 'Inadequate';

// Map frontend status (kebab-case) to database status (Title Case)
export const mapStatusToDb = (status: CAPAStatus): DbCAPAStatus => {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in-progress':
      return 'In Progress';
    case 'closed':
      return 'Closed';
    case 'overdue':
      return 'Overdue';
    case 'pending-verification':
      return 'Pending Verification';
    case 'verified':
      return 'Verified';
    default:
      return 'Open';
  }
};

// Map database status (Title Case) to frontend status (kebab-case)
export const mapStatusFromDb = (dbStatus: DbCAPAStatus): CAPAStatus => {
  switch (dbStatus) {
    case 'Open':
      return 'open';
    case 'In Progress':
      return 'in-progress';
    case 'Closed':
      return 'closed';
    case 'Overdue':
      return 'overdue';
    case 'Pending Verification':
      return 'pending-verification';
    case 'Verified':
      return 'verified';
    default:
      return 'open';
  }
};

// Map frontend effectiveness rating (kebab-case) to database effectiveness rating (Title Case)
export const mapEffectivenessRatingToDb = (rating: CAPAEffectivenessRating): DbCAPAEffectivenessRating => {
  switch (rating) {
    case 'effective':
      return 'Effective';
    case 'partially-effective':
      return 'Partially Effective';
    case 'ineffective':
      return 'Ineffective';
    case 'not-verified':
      return 'Not Verified';
    case 'adequate':
      return 'Adequate';
    case 'inadequate':
      return 'Inadequate';
    default:
      return 'Not Verified';
  }
};

// Map database effectiveness rating (Title Case) to frontend effectiveness rating (kebab-case)
export const mapEffectivenessRatingFromDb = (dbRating: DbCAPAEffectivenessRating): CAPAEffectivenessRating => {
  switch (dbRating) {
    case 'Effective':
      return 'effective';
    case 'Partially Effective':
      return 'partially-effective';
    case 'Ineffective':
      return 'ineffective';
    case 'Not Verified':
      return 'not-verified';
    case 'Adequate':
      return 'adequate';
    case 'Inadequate':
      return 'inadequate';
    default:
      return 'not-verified';
  }
};

// For loosely comparing status values regardless of format
export const statusEquals = (status1: string, status2: string): boolean => {
  const normalized1 = status1.toLowerCase().replace(/[\s-]/g, '');
  const normalized2 = status2.toLowerCase().replace(/[\s-]/g, '');
  return normalized1 === normalized2;
};

// For loosely comparing effectiveness rating values regardless of format
export const effectivenessRatingEquals = (rating1: string, rating2: string): boolean => {
  const normalized1 = rating1.toLowerCase().replace(/[\s-]/g, '');
  const normalized2 = rating2.toLowerCase().replace(/[\s-]/g, '');
  return normalized1 === normalized2;
};
