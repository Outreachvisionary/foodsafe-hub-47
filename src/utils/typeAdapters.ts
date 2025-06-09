
import { DocumentCategory, DocumentStatus, CheckoutStatus } from '@/types/enums';

export const formatEnumValue = (value: string): string => {
  return value.replace(/_/g, ' ');
};

// Status comparison utilities
export const isStringStatusEqual = (status1: string, status2: string): boolean => {
  return status1.toLowerCase() === status2.toLowerCase();
};

export const isStatusEqual = (status1: any, status2: any): boolean => {
  return String(status1).toLowerCase() === String(status2).toLowerCase();
};

// Document Category conversions
export const documentCategoryToString = (category: DocumentCategory): string => {
  return category;
};

export const stringToDocumentCategory = (category: string): DocumentCategory => {
  // Handle the mapping from database strings to enum values
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
  return status;
};

export const stringToDocumentStatus = (status: string): DocumentStatus => {
  switch (status) {
    case 'Draft':
      return DocumentStatus.Draft;
    case 'Pending Approval':
      return DocumentStatus.Pending_Approval;
    case 'Pending Review':
      return DocumentStatus.PendingReview;
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
  return status;
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

// CAPA Status conversions
export const stringToCAPAStatus = (status: string): any => {
  return status; // For now, return as string until CAPA enums are fully implemented
};

// Training related conversions
export const trainingStatusToString = (status: any): string => {
  return String(status);
};

export const stringToTrainingStatus = (status: string): any => {
  return status;
};

// Non-conformance related conversions
export const stringToNCStatus = (status: string): any => {
  return status;
};

// Effectiveness rating conversions
export const effectivenessRatingToString = (rating: any): string => {
  return String(rating);
};
