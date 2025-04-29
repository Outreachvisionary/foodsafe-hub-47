
import { CheckoutStatus, DocumentStatus, CAPAStatus, CAPAEffectivenessRating } from '@/types/enums';

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
