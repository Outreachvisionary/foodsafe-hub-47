
import { NCStatus, DocumentStatus, CheckoutStatus, TrainingStatus } from '@/types/enums';
import { NonConformance } from '@/types/non-conformance';

// NC Status conversions
export const ncStatusToString = (status: NCStatus): string => {
  return status.toString();
};

export const stringToNCStatus = (status: string): NCStatus => {
  // Handle cases with spaces vs underscores
  const normalizedStatus = status.replace(/ /g, '').toUpperCase();
  
  switch(normalizedStatus) {
    case 'OPEN': return NCStatus.Open;
    case 'ONHOLD': return NCStatus.OnHold;
    case 'UNDERREVIEW': return NCStatus.UnderReview;
    case 'INPROGRESS': return NCStatus.InProgress;
    case 'RESOLVED': return NCStatus.Resolved;
    case 'COMPLETED': return NCStatus.Completed;
    case 'CLOSED': return NCStatus.Closed;
    case 'RELEASED': return NCStatus.Released;
    case 'DISPOSED': return NCStatus.Disposed;
    case 'APPROVED': return NCStatus.Approved;
    case 'REJECTED': return NCStatus.Rejected;
    case 'PENDINGVERIFICATION': return NCStatus.PendingVerification;
    case 'VERIFIED': return NCStatus.Verified;
    case 'OVERDUE': return NCStatus.Overdue;
    default: return NCStatus.Open; // Default fallback
  }
};

// Document status conversions
export const documentStatusToString = (status: DocumentStatus): string => {
  return status.toString();
};

export const stringToDocumentStatus = (status: string): DocumentStatus => {
  // Normalize the status string to match the DocumentStatus enum format
  const normalizedStatus = status.replace(/ /g, '').toUpperCase();
  
  switch(normalizedStatus) {
    case 'DRAFT': return DocumentStatus.Draft;
    case 'PENDINGREVIEW': return DocumentStatus.PendingReview;
    case 'INREVIEW': return DocumentStatus.InReview;
    case 'APPROVED': return DocumentStatus.Approved;
    case 'PUBLISHED': return DocumentStatus.Published;
    case 'ARCHIVED': return DocumentStatus.Archived;
    case 'OBSOLETE': return DocumentStatus.Obsolete;
    case 'ACTIVE': return DocumentStatus.Active;
    default: return DocumentStatus.Draft;
  }
};

// Checkout status conversions
export const checkoutStatusToString = (status: CheckoutStatus): string => {
  return status.toString();
};

export const stringToCheckoutStatus = (status: string): CheckoutStatus => {
  const normalizedStatus = status.replace(/ /g, '').toUpperCase();
  
  switch(normalizedStatus) {
    case 'AVAILABLE': return CheckoutStatus.Available;
    case 'CHECKEDOUT': return CheckoutStatus.CheckedOut;
    case 'LOCKED': return CheckoutStatus.Locked;
    default: return CheckoutStatus.Available;
  }
};

// Training status conversions
export const trainingStatusToString = (status: TrainingStatus): string => {
  return status.toString();
};

export const stringToTrainingStatus = (status: string): TrainingStatus => {
  const normalizedStatus = status.replace(/ /g, '').toUpperCase();
  
  switch(normalizedStatus) {
    case 'NOTSTARTED': return TrainingStatus.NotStarted;
    case 'INPROGRESS': return TrainingStatus.InProgress;
    case 'COMPLETED': return TrainingStatus.Completed;
    case 'OVERDUE': return TrainingStatus.Overdue;
    case 'CANCELLED': return TrainingStatus.Cancelled;
    default: return TrainingStatus.NotStarted;
  }
};
