
import { DocumentCategory, DocumentStatus, CheckoutStatus } from '@/types/enums';

// Document Category conversions
export const documentCategoryToDbString = (category: DocumentCategory): string => {
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
export const documentStatusToDbString = (status: DocumentStatus): string => {
  switch (status) {
    case DocumentStatus.Draft:
      return 'Draft';
    case DocumentStatus.Pending_Approval:
      return 'Pending Approval';
    case DocumentStatus.PendingReview:
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
export const checkoutStatusToDbString = (status: CheckoutStatus): string => {
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
