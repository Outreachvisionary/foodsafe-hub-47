
import { DocumentStatus, CheckoutStatus } from '@/types/enums';

// Convert enum values to database strings
export const documentStatusToString = (status: DocumentStatus): string => {
  return status;
};

export const checkoutStatusToString = (status: CheckoutStatus): string => {
  return status;
};

// Convert database strings to enum values
export const stringToDocumentStatus = (status: string): DocumentStatus => {
  return status as DocumentStatus;
};

export const stringToCheckoutStatus = (status: string): CheckoutStatus => {
  return status as CheckoutStatus;
};
