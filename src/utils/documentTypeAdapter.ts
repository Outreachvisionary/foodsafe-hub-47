
import { DocumentStatus, CheckoutStatus } from '@/types/enums';

/**
 * Checks if a document status is equal to a target status
 */
export const isDocumentStatusEqual = (status: any, targetStatus: DocumentStatus): boolean => {
  if (!status) return false;
  
  // Handle enum-style status with underscores
  if (typeof status === 'string') {
    const normalizedStatus = status.replace(/_/g, ' ').toLowerCase();
    const normalizedTarget = targetStatus.toString().replace(/_/g, ' ').toLowerCase();
    return normalizedStatus === normalizedTarget;
  }
  
  return status === targetStatus;
};

/**
 * Converts a string to DocumentStatus enum
 */
export const normalizeDocStatus = (status: string): DocumentStatus => {
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  return DocumentStatus[normalizedStatus as keyof typeof DocumentStatus] || DocumentStatus.Draft;
};

/**
 * Checks if a checkout status is equal to a target status
 */
export const isCheckoutStatusEqual = (status: any, targetStatus: CheckoutStatus): boolean => {
  if (!status) return false;
  
  // Handle enum-style status with underscores
  if (typeof status === 'string') {
    const normalizedStatus = status.replace(/_/g, ' ').toLowerCase();
    const normalizedTarget = targetStatus.toString().replace(/_/g, ' ').toLowerCase();
    return normalizedStatus === normalizedTarget;
  }
  
  return status === targetStatus;
};

// Additional utility functions to help with document type handling
export const documentStatusToString = (status: DocumentStatus): string => {
  return status.toString().replace(/_/g, ' ');
};

export const stringToDocumentStatus = (statusString: string): DocumentStatus => {
  const statusKey = statusString.replace(/ /g, '_').toUpperCase();
  return DocumentStatus[statusKey as keyof typeof DocumentStatus] || DocumentStatus.Draft;
};

export const checkoutStatusToString = (status: CheckoutStatus): string => {
  return status.toString().replace(/_/g, ' ');
};

export const stringToCheckoutStatus = (statusString: string): CheckoutStatus => {
  const statusKey = statusString.replace(/ /g, '_').toUpperCase();
  return CheckoutStatus[statusKey as keyof typeof CheckoutStatus] || CheckoutStatus.Available;
};

export const isStatusEqual = isDocumentStatusEqual;
