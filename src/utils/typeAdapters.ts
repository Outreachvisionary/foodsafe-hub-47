
import { DocumentCategory, DocumentStatus, CheckoutStatus, TrainingStatus, CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating, NCStatus } from '@/types/enums';

// Generic enum formatting function
export const formatEnumValue = (value: string | undefined): string => {
  if (!value) return 'N/A';
  return value.replace(/_/g, ' ');
};

// Document Category conversions
export const documentCategoryToString = (category: DocumentCategory): string => {
  switch (category) {
    case DocumentCategory.SOP:
      return 'SOP';
    case DocumentCategory.Policy:
      return 'Policy';
    case DocumentCategory.Form:
      return 'Form';
    case DocumentCategory.Certificate:
      return 'Certificate';
    case DocumentCategory.Audit_Report:
      return 'Audit Report';
    case DocumentCategory.HACCP_Plan:
      return 'HACCP Plan';
    case DocumentCategory.Training_Material:
      return 'Training Material';
    case DocumentCategory.Supplier_Documentation:
      return 'Supplier Documentation';
    case DocumentCategory.Risk_Assessment:
      return 'Risk Assessment';
    case DocumentCategory.Other:
      return 'Other';
    default:
      return 'Other';
  }
};

export const stringToDocumentCategory = (category: string): DocumentCategory => {
  switch (category) {
    case 'SOP':
      return DocumentCategory.SOP;
    case 'Policy':
      return DocumentCategory.Policy;
    case 'Form':
      return DocumentCategory.Form;
    case 'Certificate':
      return DocumentCategory.Certificate;
    case 'Audit Report':
      return DocumentCategory.Audit_Report;
    case 'HACCP Plan':
      return DocumentCategory.HACCP_Plan;
    case 'Training Material':
      return DocumentCategory.Training_Material;
    case 'Supplier Documentation':
      return DocumentCategory.Supplier_Documentation;
    case 'Risk Assessment':
      return DocumentCategory.Risk_Assessment;
    case 'Other':
      return DocumentCategory.Other;
    default:
      return DocumentCategory.Other;
  }
};

// Document Status conversions
export const documentStatusToString = (status: DocumentStatus): string => {
  switch (status) {
    case DocumentStatus.Draft:
      return 'Draft';
    case DocumentStatus.Pending_Approval:
      return 'Pending Approval';
    case DocumentStatus.Pending_Review:
      return 'Pending Review';
    case DocumentStatus.Approved:
      return 'Approved';
    case DocumentStatus.Published:
    case DocumentStatus.Active:
      return 'Published';
    case DocumentStatus.Archived:
      return 'Archived';
    case DocumentStatus.Expired:
      return 'Expired';
    case DocumentStatus.Rejected:
      return 'Rejected';
    default:
      return 'Draft';
  }
};

export const stringToDocumentStatus = (status: string): DocumentStatus => {
  switch (status) {
    case 'Draft':
      return DocumentStatus.Draft;
    case 'Pending Approval':
      return DocumentStatus.Pending_Approval;
    case 'Pending Review':
      return DocumentStatus.Pending_Review;
    case 'Approved':
      return DocumentStatus.Approved;
    case 'Published':
      return DocumentStatus.Published;
    case 'Archived':
      return DocumentStatus.Archived;
    case 'Expired':
      return DocumentStatus.Expired;
    case 'Rejected':
      return DocumentStatus.Rejected;
    default:
      return DocumentStatus.Draft;
  }
};

// Checkout Status conversions
export const checkoutStatusToString = (status: CheckoutStatus): string => {
  switch (status) {
    case CheckoutStatus.Available:
      return 'Available';
    case CheckoutStatus.Checked_Out:
      return 'Checked_Out';
    case CheckoutStatus.Locked:
      return 'Locked';
    default:
      return 'Available';
  }
};

export const stringToCheckoutStatus = (status: string): CheckoutStatus => {
  switch (status) {
    case 'Available':
      return CheckoutStatus.Available;
    case 'Checked_Out':
    case 'Checked Out':
      return CheckoutStatus.Checked_Out;
    case 'Locked':
      return CheckoutStatus.Locked;
    default:
      return CheckoutStatus.Available;
  }
};

// Training Status conversions
export const trainingStatusToString = (status: TrainingStatus | string): string => {
  if (typeof status === 'string') return status;
  return String(status);
};

export const stringToTrainingStatus = (status: string): TrainingStatus => {
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  return normalizedStatus as unknown as TrainingStatus;
};

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

// Effectiveness Rating conversions
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

// Non-Conformance Status conversions
export const stringToNCStatus = (status: string): NCStatus => {
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  return normalizedStatus as unknown as NCStatus;
};

export const ncStatusToString = (status: NCStatus | string): string => {
  if (typeof status === 'string') return status;
  return String(status);
};

// Generic status comparison functions
export const isStringStatusEqual = (status1: string, status2: string): boolean => {
  return status1 === status2;
};

export const isStatusEqual = (status1: any, status2: any): boolean => {
  return status1 === status2;
};
