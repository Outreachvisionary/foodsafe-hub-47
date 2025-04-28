
import { DocumentStatus, CheckoutStatus } from '@/types/document';
import { CAPAStatus } from '@/types/capa';

export const isDocumentStatus = (
  status: string,
  expectedStatus: DocumentStatus
): boolean => {
  // Normalize status strings by replacing underscores with spaces
  const normalizedStatus = status.replace(/_/g, ' ');
  const normalizedExpectedStatus = expectedStatus.replace(/_/g, ' ');
  
  return normalizedStatus.toLowerCase() === normalizedExpectedStatus.toLowerCase();
};

export const isCheckoutStatus = (
  status: string,
  expectedStatus: CheckoutStatus
): boolean => {
  // Normalize status strings by replacing underscores with spaces
  const normalizedStatus = status.replace(/_/g, ' ');
  const normalizedExpectedStatus = expectedStatus.replace(/_/g, ' ');
  
  return normalizedStatus.toLowerCase() === normalizedExpectedStatus.toLowerCase();
};

export const convertToCAPAStatus = (status: string): CAPAStatus => {
  // Convert string to CAPAStatus enum
  return status.replace(/ /g, '_') as CAPAStatus;
};
