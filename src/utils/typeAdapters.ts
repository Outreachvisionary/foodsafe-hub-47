
import { DocumentStatus, CheckoutStatus, CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';

// Document status utilities
export const isStatusEqual = (status: any, targetStatus: DocumentStatus): boolean => {
  if (!status) return false;
  
  if (typeof status === 'string') {
    const normalizedStatus = status.replace(/_/g, ' ').toLowerCase();
    const normalizedTarget = targetStatus.toString().replace(/_/g, ' ').toLowerCase();
    return normalizedStatus === normalizedTarget;
  }
  
  return status === targetStatus;
};

export const documentStatusToString = (status: DocumentStatus): string => {
  return status.toString().replace(/_/g, ' ');
};

export const stringToDocumentStatus = (statusString: string): DocumentStatus => {
  const statusKey = statusString.replace(/ /g, '_').toUpperCase();
  return DocumentStatus[statusKey as keyof typeof DocumentStatus] || DocumentStatus.Draft;
};

// CAPA status utilities
export const convertToCAPAStatus = (statusString: string): CAPAStatus => {
  const statusKey = statusString.replace(/ /g, '_').toUpperCase();
  return CAPAStatus[statusKey as keyof typeof CAPAStatus] || CAPAStatus.Open;
};

export const convertToCAPAPriority = (priorityString: string): CAPAPriority => {
  const priorityKey = priorityString.toUpperCase();
  return CAPAPriority[priorityKey as keyof typeof CAPAPriority] || CAPAPriority.Medium;
};

export const convertToCAPASource = (sourceString: string): CAPASource => {
  const sourceKey = sourceString.replace(/ /g, '_').toUpperCase();
  return CAPASource[sourceKey as keyof typeof CAPASource] || CAPASource.Other;
};

export const formatEnumValue = (value: string): string => {
  return value.replace(/_/g, ' ');
};

// Checkout status utilities
export const checkoutStatusToString = (status: CheckoutStatus): string => {
  return status.toString().replace(/_/g, ' ');
};

export const stringToCheckoutStatus = (statusString: string): CheckoutStatus => {
  const statusKey = statusString.replace(/ /g, '_').toUpperCase();
  return CheckoutStatus[statusKey as keyof typeof CheckoutStatus] || CheckoutStatus.Available;
};
