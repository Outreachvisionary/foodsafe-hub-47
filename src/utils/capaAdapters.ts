
import { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/enums';

// CAPA Status conversions
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

// CAPA Priority conversions
export const stringToCAPAPriority = (priority: string): CAPAPriority => {
  switch (priority?.toLowerCase()) {
    case 'critical':
      return CAPAPriority.Critical;
    case 'high':
      return CAPAPriority.High;
    case 'medium':
      return CAPAPriority.Medium;
    case 'low':
      return CAPAPriority.Low;
    default:
      return CAPAPriority.Medium;
  }
};

export const capaPriorityToString = (priority: CAPAPriority): string => {
  switch (priority) {
    case CAPAPriority.Critical:
      return 'Critical';
    case CAPAPriority.High:
      return 'High';
    case CAPAPriority.Medium:
      return 'Medium';
    case CAPAPriority.Low:
      return 'Low';
    default:
      return 'Medium';
  }
};

// CAPA Source conversions
export const stringToCAPASource = (source: string): CAPASource => {
  switch (source) {
    case 'Audit':
      return CAPASource.Audit;
    case 'Customer Complaint':
      return CAPASource.Customer_Complaint;
    case 'Non Conformance':
      return CAPASource.Non_Conformance;
    case 'Internal Review':
      return CAPASource.Internal_Review;
    case 'Internal Report':
      return CAPASource.Internal_Report;
    case 'Management Review':
      return CAPASource.Management_Review;
    case 'Complaint':
      return CAPASource.Complaint;
    case 'Supplier Issue':
      return CAPASource.Supplier_Issue;
    case 'Other':
      return CAPASource.Other;
    default:
      return CAPASource.Other;
  }
};

export const capaSourceToString = (source: CAPASource): string => {
  switch (source) {
    case CAPASource.Audit:
      return 'Audit';
    case CAPASource.Customer_Complaint:
      return 'Customer Complaint';
    case CAPASource.Non_Conformance:
      return 'Non Conformance';
    case CAPASource.Internal_Review:
      return 'Internal Review';
    case CAPASource.Internal_Report:
      return 'Internal Report';
    case CAPASource.Management_Review:
      return 'Management Review';
    case CAPASource.Complaint:
      return 'Complaint';
    case CAPASource.Supplier_Issue:
      return 'Supplier Issue';
    case CAPASource.Other:
      return 'Other';
    default:
      return 'Other';
  }
};

// Effectiveness Rating conversions
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
