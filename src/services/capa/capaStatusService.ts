
import { CAPAStatus, CAPAEffectivenessRating } from '@/types/capa';

// Map frontend status to database status
export const mapStatusToDb = (status: CAPAStatus): string => {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in-progress':
      return 'In Progress';
    case 'closed':
      return 'Closed';
    case 'verified':
      return 'Verified';
    case 'pending-verification':
      return 'Pending Verification';
    case 'overdue':
      return 'Overdue';
    default:
      return 'Open';
  }
};

// Map database status to frontend status
export const mapStatusFromDb = (dbStatus: string): CAPAStatus => {
  switch (dbStatus) {
    case 'Open':
      return 'open';
    case 'In Progress':
      return 'in-progress';
    case 'Closed':
      return 'closed';
    case 'Verified':
      return 'verified';
    case 'Pending Verification':
      return 'pending-verification';
    case 'Overdue':
      return 'overdue';
    default:
      return 'open';
  }
};

// Map frontend effectiveness rating to database effectiveness rating
export const mapEffectivenessRatingToDb = (rating: CAPAEffectivenessRating): string => {
  switch (rating) {
    case 'excellent':
      return 'Excellent';
    case 'effective':
      return 'Effective';
    case 'good':
      return 'Good';
    case 'partially-effective':
      return 'Partially Effective';
    case 'adequate':
      return 'Adequate';
    case 'inadequate':
      return 'Inadequate';
    case 'poor':
      return 'Poor';
    case 'ineffective':
      return 'Ineffective';
    case 'not-verified':
      return 'Not Verified';
    default:
      return 'Not Verified';
  }
};

// Map database effectiveness rating to frontend effectiveness rating
export const mapEffectivenessRatingFromDb = (dbRating: string): CAPAEffectivenessRating => {
  switch (dbRating) {
    case 'Excellent':
      return 'excellent';
    case 'Effective':
      return 'effective';
    case 'Good':
      return 'good';
    case 'Partially Effective':
      return 'partially-effective';
    case 'Adequate':
      return 'adequate';
    case 'Inadequate':
      return 'inadequate';
    case 'Poor':
      return 'poor';
    case 'Ineffective':
      return 'ineffective';
    case 'Not Verified':
      return 'not-verified';
    default:
      return 'not-verified';
  }
};

// Convert user-friendly status to internal status for display
export const mapInternalToStatus = (status: CAPAStatus): string => {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in-progress':
      return 'In Progress';
    case 'closed':
      return 'Closed';
    case 'verified':
      return 'Verified';
    case 'pending-verification':
      return 'Pending Verification';
    case 'overdue':
      return 'Overdue';
    default:
      return 'Open';
  }
};

// Convert internal status to user-friendly status
export const mapStatusToInternal = (status: string): CAPAStatus => {
  switch (status) {
    case 'Open':
      return 'open';
    case 'In Progress':
      return 'in-progress';
    case 'Closed':
      return 'closed';
    case 'Verified':
      return 'verified';
    case 'Pending Verification':
      return 'pending-verification';
    case 'Overdue':
      return 'overdue';
    default:
      return 'open';
  }
};
