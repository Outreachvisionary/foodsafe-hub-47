
import { CheckoutStatus, DocumentStatus, CAPAStatus, CAPAEffectivenessRating } from '@/types/enums';
import { Document } from '@/types/document';

export const isCheckoutStatus = (value: string, status: CheckoutStatus): boolean => {
  return value?.replace(/ /g, '_').toLowerCase() === status.toLowerCase();
};

export const isDocumentStatus = (value: string, status: DocumentStatus): boolean => {
  return value?.replace(/ /g, '_').toLowerCase() === status.toLowerCase();
};

export const isCAPAStatus = (value: string, status: CAPAStatus): boolean => {
  return value?.replace(/ /g, '_').toLowerCase() === status.toLowerCase();
};

export const isEffectivenessRating = (value: string, rating: CAPAEffectivenessRating): boolean => {
  return value?.replace(/ /g, '_').toLowerCase() === rating.toLowerCase();
};

// Add function for adapting document model
export const adaptDocumentToModel = (doc: any): Document => {
  return {
    ...doc,
    status: doc.status as DocumentStatus,
    checkout_status: doc.checkout_status as CheckoutStatus
  };
};

// Add function to convert string to CAPAStatus
export const convertToCAPAStatus = (statusString: string): CAPAStatus => {
  const normalizedStatus = statusString.replace(/ /g, '_');
  
  switch(normalizedStatus) {
    case 'Open': return CAPAStatus.Open;
    case 'In_Progress': return CAPAStatus.InProgress;
    case 'Under_Review': return CAPAStatus.UnderReview;
    case 'Completed': return CAPAStatus.Completed;
    case 'Closed': return CAPAStatus.Closed;
    case 'Rejected': return CAPAStatus.Rejected;
    case 'On_Hold': return CAPAStatus.OnHold;
    case 'Overdue': return CAPAStatus.Overdue;
    case 'Pending_Verification': return CAPAStatus.PendingVerification;
    case 'Verified': return CAPAStatus.Verified;
    default: return CAPAStatus.Open;
  }
};

// Add function to convert string to CAPAEffectivenessRating
export const convertToEffectivenessRating = (rating: string): CAPAEffectivenessRating => {
  const normalizedRating = rating.replace(/ /g, '_');
  
  switch(normalizedRating) {
    case 'Not_Effective': return CAPAEffectivenessRating.NotEffective;
    case 'Partially_Effective': return CAPAEffectivenessRating.PartiallyEffective;
    case 'Effective': return CAPAEffectivenessRating.Effective;
    case 'Highly_Effective': return CAPAEffectivenessRating.HighlyEffective;
    default: return CAPAEffectivenessRating.NotEffective;
  }
};

export const mapDocumentStatusFromString = (status: string): DocumentStatus => {
  const normalizedStatus = status.replace(/ /g, '_');
  
  switch(normalizedStatus) {
    case 'Draft': return DocumentStatus.Draft;
    case 'In_Review': return DocumentStatus.InReview;
    case 'Pending_Review': return DocumentStatus.PendingReview;
    case 'Pending_Approval': return DocumentStatus.PendingApproval;
    case 'Approved': return DocumentStatus.Approved;
    case 'Published': return DocumentStatus.Published;
    case 'Archived': return DocumentStatus.Archived;
    case 'Rejected': return DocumentStatus.Rejected;
    case 'Obsolete': return DocumentStatus.Obsolete;
    case 'Active': return DocumentStatus.Active;
    case 'Expired': return DocumentStatus.Expired;
    default: return DocumentStatus.Draft;
  }
};
