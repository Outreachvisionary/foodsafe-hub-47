
import { DocumentStatus, CheckoutStatus } from '@/types/enums';
import { TrainingStatus } from '@/types/enums';

// Document status conversion functions
export const stringToDocumentStatus = (status: string): DocumentStatus => {
  if (Object.values(DocumentStatus).includes(status as DocumentStatus)) {
    return status as DocumentStatus;
  }
  return DocumentStatus.Draft; // Default fallback
};

export const documentStatusToString = (status: DocumentStatus): string => {
  return status.toString();
};

// Checkout status conversion functions
export const stringToCheckoutStatus = (status: string): CheckoutStatus => {
  if (Object.values(CheckoutStatus).includes(status as CheckoutStatus)) {
    return status as CheckoutStatus;
  }
  return CheckoutStatus.Available; // Default fallback
};

export const checkoutStatusToString = (status: CheckoutStatus): string => {
  return status.toString();
};

// Training status conversion functions
export const stringToTrainingStatus = (status: string): TrainingStatus => {
  if (Object.values(TrainingStatus).includes(status as TrainingStatus)) {
    return status as TrainingStatus;
  }
  return TrainingStatus.NotStarted; // Default fallback
};

export const trainingStatusToString = (status: TrainingStatus): string => {
  return status.toString();
};
