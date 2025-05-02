
import { DocumentStatus } from '@/types/enums';

// Document status conversion functions
export const documentStatusToString = (status: DocumentStatus | string): string => {
  if (typeof status === 'string') return status;
  return status.toString();
};

export const stringToDocumentStatus = (status: string): DocumentStatus => {
  // Normalize the status string to match the DocumentStatus enum format
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  return normalizedStatus as unknown as DocumentStatus;
};

export const checkoutStatusToString = (status: string): string => {
  return status;
};

export const stringToCheckoutStatus = (status: string): string => {
  return status;
};
