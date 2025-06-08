
import { CAPAStatus, CAPAPriority, CAPASource, EffectivenessRating } from '@/types/enums';

// CAPA Status conversion functions
export const capaStatusToString = (status: CAPAStatus): string => {
  return status.toString();
};

export const stringToCAPAStatus = (status: string): CAPAStatus => {
  // Handle database values that might use underscores or spaces
  const normalizedStatus = status.replace(/ /g, '_');
  
  switch (normalizedStatus) {
    case 'Open':
      return CAPAStatus.Open;
    case 'In_Progress':
    case 'In Progress':
      return CAPAStatus.In_Progress;
    case 'Under_Review':
    case 'Under Review':
      return CAPAStatus.Under_Review;
    case 'Pending_Verification':
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

// CAPA Priority conversion functions
export const capaPriorityToString = (priority: CAPAPriority): string => {
  return priority.toString();
};

export const stringToCAPAPriority = (priority: string): CAPAPriority => {
  switch (priority) {
    case 'Critical':
      return CAPAPriority.Critical;
    case 'High':
      return CAPAPriority.High;
    case 'Medium':
      return CAPAPriority.Medium;
    case 'Low':
      return CAPAPriority.Low;
    default:
      return CAPAPriority.Medium;
  }
};

// CAPA Source conversion functions
export const capaSourceToString = (source: CAPASource): string => {
  return source.toString();
};

export const stringToCAPASource = (source: string): CAPASource => {
  const normalizedSource = source.replace(/_/g, ' ');
  
  switch (normalizedSource) {
    case 'Audit':
      return CAPASource.Audit;
    case 'Customer Complaint':
    case 'Customer_Complaint':
      return CAPASource.Customer_Complaint;
    case 'Non Conformance':
    case 'Non_Conformance':
      return CAPASource.Non_Conformance;
    case 'Internal Review':
    case 'Internal_Review':
      return CAPASource.Internal_Review;
    case 'Internal Report':
    case 'Internal_Report':
      return CAPASource.Internal_Report;
    case 'Management Review':
    case 'Management_Review':
      return CAPASource.Management_Review;
    case 'Complaint':
      return CAPASource.Complaint;
    case 'Supplier Issue':
    case 'Supplier_Issue':
      return CAPASource.Supplier_Issue;
    case 'Other':
      return CAPASource.Other;
    default:
      return CAPASource.Other;
  }
};

// Effectiveness Rating conversion functions
export const effectivenessRatingToString = (rating: EffectivenessRating): string => {
  return rating.toString();
};

export const stringToEffectivenessRating = (rating: string): EffectivenessRating => {
  const normalizedRating = rating.replace(/_/g, ' ');
  
  switch (normalizedRating) {
    case 'Effective':
      return EffectivenessRating.Effective;
    case 'Partially Effective':
    case 'Partially_Effective':
      return EffectivenessRating.Partially_Effective;
    case 'Not Effective':
    case 'Not_Effective':
      return EffectivenessRating.Not_Effective;
    case 'Pending':
      return EffectivenessRating.Pending;
    default:
      return EffectivenessRating.Pending;
  }
};
