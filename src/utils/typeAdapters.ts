
import { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating, DocumentStatus } from '@/types/enums';
import { NCStatus } from '@/types/non-conformance';

// Document status comparison
export const isDocumentStatusEqual = (
  status: string | DocumentStatus,
  compareStatus: DocumentStatus | string
): boolean => {
  if (typeof status === 'string' && typeof compareStatus === 'string') {
    return status.toLowerCase() === compareStatus.toLowerCase();
  }
  if (typeof status === 'string') {
    return status.toLowerCase() === compareStatus.toString().toLowerCase();
  }
  return status.toString().toLowerCase() === compareStatus.toString().toLowerCase();
};

// Generic status equality check for any status type
export const isStatusEqual = (
  status: string | any,
  compareStatus: string
): boolean => {
  if (typeof status === 'string') {
    return status.toLowerCase() === compareStatus.toLowerCase();
  }
  return status.toString().toLowerCase() === compareStatus.toLowerCase();
};

// CAPA status conversion
export const convertToCAPAStatus = (status: string): CAPAStatus => {
  switch (status.toUpperCase()) {
    case 'OPEN': return CAPAStatus.Open;
    case 'IN_PROGRESS': return CAPAStatus.InProgress;
    case 'PENDING_VERIFICATION': return CAPAStatus.PendingVerification;
    case 'COMPLETED': return CAPAStatus.Completed;
    case 'CLOSED': return CAPAStatus.Closed;
    case 'VERIFIED': return CAPAStatus.Verified;
    case 'OVERDUE': return CAPAStatus.Overdue;
    default: return CAPAStatus.Open;
  }
};

// Format enum values for display
export const formatEnumValue = (value: string): string => {
  if (!value) return '';
  
  // Replace underscores with spaces
  const withSpaces = value.replace(/_/g, ' ');
  
  // Capitalize the first letter of each word
  return withSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// String status comparison helper
export const isStringStatusEqual = (status: string | CAPAStatus, compareStatus: string): boolean => {
  if (typeof status === 'string') {
    return status.toLowerCase() === compareStatus.toLowerCase();
  }
  return status.toString().toLowerCase() === compareStatus.toLowerCase();
};

// Convert string to CAPA priority
export const stringToCAPAPriority = (priority: string): CAPAPriority => {
  switch (priority.toUpperCase()) {
    case 'LOW': return CAPAPriority.Low;
    case 'MEDIUM': return CAPAPriority.Medium;
    case 'HIGH': return CAPAPriority.High;
    case 'CRITICAL': return CAPAPriority.Critical;
    default: return CAPAPriority.Medium;
  }
};

// Convert string to CAPA source
export const stringToCAPASource = (source: string): CAPASource => {
  switch (source.toUpperCase()) {
    case 'AUDIT': return CAPASource.Audit;
    case 'CUSTOMER_COMPLAINT': return CAPASource.CustomerComplaint;
    case 'NON_CONFORMANCE': return CAPASource.NonConformance;
    case 'SUPPLIER_ISSUE': return CAPASource.SupplierIssue;
    case 'INTERNAL_REPORT': return CAPASource.InternalReport;
    case 'REGULATORY_INSPECTION': return CAPASource.RegulatoryInspection;
    default: return CAPASource.Other;
  }
};

// Complaint status conversion
export const convertToComplaintStatus = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'NEW': return 'New';
    case 'UNDER_INVESTIGATION': return 'Under Investigation';
    case 'PENDING_CAPA': return 'Pending CAPA';
    case 'RESOLVED': return 'Resolved';
    case 'CLOSED': return 'Closed';
    default: return 'New';
  }
};

// Convert NCStatus enum to string for display
export const ncStatusToString = (status: NCStatus | string): string => {
  if (typeof status === 'string') return status;
  return status.toString();
};

// Convert string to NCStatus for comparison
export const stringToNCStatus = (status: string): NCStatus => {
  switch (status) {
    case 'On Hold': return NCStatus.OnHold;
    case 'Under Review': return NCStatus.UnderReview;
    case 'Released': return NCStatus.Released;
    case 'Disposed': return NCStatus.Disposed;
    case 'Approved': return NCStatus.Approved;
    case 'Rejected': return NCStatus.Rejected;
    case 'Resolved': return NCStatus.Resolved;
    case 'Closed': return NCStatus.Closed;
    case 'Draft': return NCStatus.Draft;
    case 'Open': return NCStatus.Open;
    case 'In Progress': return NCStatus.InProgress;
    default: return NCStatus.Open;
  }
};

// Add the missing adapter functions for documents
export const documentStatusToString = (status: DocumentStatus | string): string => {
  if (typeof status === 'string') return status;
  return status.toString();
};

export const stringToDocumentStatus = (status: string): DocumentStatus => {
  // This would need to be implemented based on your DocumentStatus enum
  // Replace with actual implementation
  return status as unknown as DocumentStatus;
};

export const checkoutStatusToString = (status: string): string => {
  return status;
};

export const stringToCheckoutStatus = (status: string): string => {
  return status;
};

// Add the missing adapter functions for training
export const trainingStatusToString = (status: string): string => {
  return status;
};

export const stringToTrainingStatus = (status: string): string => {
  return status;
};
