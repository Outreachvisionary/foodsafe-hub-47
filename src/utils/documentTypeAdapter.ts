
import { Document, DocumentStatus, CheckoutStatus } from '@/types/document';

export const documentStatusToString = (status: DocumentStatus | string): string => {
  if (typeof status === 'string') return status;
  return status.toString().replace(/_/g, ' ');
};

export const stringToDocumentStatus = (status: string): DocumentStatus => {
  // Normalize the status string to match the DocumentStatus enum format
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  return normalizedStatus as unknown as DocumentStatus;
};

export const checkoutStatusToString = (status: CheckoutStatus | string): string => {
  if (typeof status === 'string') return status;
  return status.toString().replace(/_/g, ' ');
};

export const stringToCheckoutStatus = (status: string): CheckoutStatus => {
  // Normalize the status string to match the CheckoutStatus enum format
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  return normalizedStatus as unknown as CheckoutStatus;
};

export const adaptDocumentToDatabase = (document: Document) => {
  return {
    ...document,
    status: document.status.toString(),
    checkout_status: document.checkout_status ? document.checkout_status.toString() : 'Available',
    // Convert any other enum types as needed
  };
};

export const adaptDatabaseToDocument = (data: any): Document => {
  return {
    ...data,
    status: stringToDocumentStatus(data.status),
    checkout_status: data.checkout_status ? stringToCheckoutStatus(data.checkout_status) : CheckoutStatus.Available,
    // Convert any other string types to enums as needed
  };
};
