
import { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating, NCStatus, TrainingStatus } from '@/types/enums';

export const formatEnumValue = (value: string | CAPAStatus | CAPAPriority | CAPASource): string => {
  if (typeof value === 'string') {
    return value.replace(/_/g, ' ');
  }
  
  return value.replace(/_/g, ' ');
};

export const isStringStatusEqual = (status1: string | CAPAStatus, status2: string | CAPAStatus): boolean => {
  const normalize = (status: string | CAPAStatus): string => {
    if (typeof status === 'string') {
      return status.toLowerCase().replace(/\s+/g, '_');
    }
    return status.toLowerCase();
  };
  
  return normalize(status1) === normalize(status2);
};

// CAPA Status functions
export const stringToCAPAStatus = (status: string): CAPAStatus => {
  switch (status) {
    case 'Open':
      return CAPAStatus.Open;
    case 'In Progress':
      return CAPAStatus.In_Progress;
    case 'Under Review':
      return CAPAStatus.Under_Review;
    case 'Pending Verification':
      return CAPAStatus.Pending_Verification;
    case 'Closed':
      return CAPAStatus.Closed;
    case 'Cancelled':
      return CAPAStatus.Cancelled;
    default:
      return CAPAStatus.Open;
  }
};

export const capaStatusToString = (status: CAPAStatus): string => {
  switch (status) {
    case CAPAStatus.Open:
      return 'Open';
    case CAPAStatus.In_Progress:
      return 'In Progress';
    case CAPAStatus.Under_Review:
      return 'Under Review';
    case CAPAStatus.Pending_Verification:
      return 'Pending Verification';
    case CAPAStatus.Closed:
      return 'Closed';
    case CAPAStatus.Cancelled:
      return 'Cancelled';
    default:
      return 'Open';
  }
};

// Effectiveness Rating functions
export const effectivenessRatingToString = (rating: CAPAEffectivenessRating): string => {
  switch (rating) {
    case CAPAEffectivenessRating.Effective:
      return 'Effective';
    case CAPAEffectivenessRating.Partially_Effective:
      return 'Partially Effective';
    case CAPAEffectivenessRating.Not_Effective:
      return 'Not Effective';
    case CAPAEffectivenessRating.Pending:
      return 'Pending';
    default:
      return 'Pending';
  }
};

export const stringToEffectivenessRating = (rating: string): CAPAEffectivenessRating => {
  switch (rating) {
    case 'Effective':
      return CAPAEffectivenessRating.Effective;
    case 'Partially Effective':
      return CAPAEffectivenessRating.Partially_Effective;
    case 'Not Effective':
      return CAPAEffectivenessRating.Not_Effective;
    case 'Pending':
      return CAPAEffectivenessRating.Pending;
    default:
      return CAPAEffectivenessRating.Pending;
  }
};

// Non-Conformance Status functions
export const stringToNCStatus = (status: string): NCStatus => {
  switch (status) {
    case 'On Hold':
      return NCStatus.On_Hold;
    case 'Under Review':
      return NCStatus.Under_Review;
    case 'Released':
      return NCStatus.Released;
    case 'Resolved':
      return NCStatus.Resolved;
    case 'Disposed':
      return NCStatus.Disposed;
    case 'Closed':
      return NCStatus.Closed;
    default:
      return NCStatus.On_Hold;
  }
};

export const ncStatusToString = (status: NCStatus): string => {
  switch (status) {
    case NCStatus.On_Hold:
      return 'On Hold';
    case NCStatus.Under_Review:
      return 'Under Review';
    case NCStatus.Released:
      return 'Released';
    case NCStatus.Resolved:
      return 'Resolved';
    case NCStatus.Disposed:
      return 'Disposed';
    case NCStatus.Closed:
      return 'Closed';
    default:
      return 'On Hold';
  }
};

// Generic status comparison
export const isStatusEqual = (status1: any, status2: any): boolean => {
  if (typeof status1 === 'string' && typeof status2 === 'string') {
    return status1.toLowerCase().replace(/\s+/g, '_') === status2.toLowerCase().replace(/\s+/g, '_');
  }
  return status1 === status2;
};

// Training Status functions
export const stringToTrainingStatus = (status: string): TrainingStatus => {
  switch (status) {
    case 'Not Started':
      return TrainingStatus.Not_Started;
    case 'In Progress':
      return TrainingStatus.In_Progress;
    case 'Completed':
      return TrainingStatus.Completed;
    case 'Overdue':
      return TrainingStatus.Overdue;
    case 'Cancelled':
      return TrainingStatus.Cancelled;
    default:
      return TrainingStatus.Not_Started;
  }
};

export const trainingStatusToString = (status: TrainingStatus): string => {
  switch (status) {
    case TrainingStatus.Not_Started:
      return 'Not Started';
    case TrainingStatus.In_Progress:
      return 'In Progress';
    case TrainingStatus.Completed:
      return 'Completed';
    case TrainingStatus.Overdue:
      return 'Overdue';
    case TrainingStatus.Cancelled:
      return 'Cancelled';
    default:
      return 'Not Started';
  }
};
