
import { DocumentStatus } from '@/types/enums';

// Document status conversion functions
export const documentStatusToString = (status: DocumentStatus | string): string => {
  if (typeof status === 'string') return status;
  return status.toString();
};

export const stringToDocumentStatus = (status: string): DocumentStatus => {
  // Implementation depends on your DocumentStatus enum
  return status as unknown as DocumentStatus;
};

export const checkoutStatusToString = (status: string): string => {
  return status;
};

export const stringToCheckoutStatus = (status: string): string => {
  return status;
};
