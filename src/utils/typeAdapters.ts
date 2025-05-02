
import { DocumentStatus, CAPAStatus, CAPASource, CAPAPriority, NCStatus } from '@/types/enums';

export const stringToDocumentStatus = (status: string): DocumentStatus => {
  switch (status) {
    case 'Draft': return DocumentStatus.Draft;
    case 'Pending Review': return DocumentStatus.PendingReview;
    case 'In Review': return DocumentStatus.InReview;
    case 'Approved': return DocumentStatus.Approved;
    case 'Published': return DocumentStatus.Published;
    case 'Archived': return DocumentStatus.Archived;
    case 'Obsolete': return DocumentStatus.Obsolete;
    case 'Active': return DocumentStatus.Active;
    case 'Pending Approval': return DocumentStatus.PendingApproval;
    case 'Rejected': return DocumentStatus.Rejected;
    case 'Expired': return DocumentStatus.Expired;
    default: return DocumentStatus.Draft;
  }
};

export const stringToNCStatus = (status: string): any => {
  // Handle conversion from string to NCStatus enum
  // This is a placeholder - implement based on your enums
  return status;
};

export const stringToCAPAStatus = (status: string): CAPAStatus => {
  switch (status) {
    case 'Open': return CAPAStatus.Open;
    case 'In Progress': return CAPAStatus.InProgress;
    case 'Pending Verification': return CAPAStatus.PendingVerification;
    case 'Verified': return CAPAStatus.Verified;
    case 'Closed': return CAPAStatus.Closed;
    case 'Overdue': return CAPAStatus.Overdue;
    case 'Completed': return CAPAStatus.Completed;
    case 'Rejected': return CAPAStatus.Rejected;
    case 'On Hold': return CAPAStatus.OnHold;
    case 'Under Review': return CAPAStatus.UnderReview;
    default: return CAPAStatus.Open;
  }
};

export const stringToCAPAPriority = (priority: string): CAPAPriority => {
  switch (priority) {
    case 'Low': return CAPAPriority.Low;
    case 'Medium': return CAPAPriority.Medium;
    case 'High': return CAPAPriority.High;
    case 'Critical': return CAPAPriority.Critical;
    default: return CAPAPriority.Medium;
  }
};

export const stringToCAPASource = (source: string): CAPASource => {
  switch (source) {
    case 'Audit': return CAPASource.Audit;
    case 'Customer Complaint': return CAPASource.CustomerComplaint;
    case 'Internal Report': return CAPASource.InternalReport;
    case 'Non Conformance': return CAPASource.NonConformance;
    case 'Regulatory Inspection': return CAPASource.RegulatoryInspection;
    case 'Supplier Issue': return CAPASource.SupplierIssue;
    case 'Other': return CAPASource.Other;
    default: return CAPASource.Other;
  }
};

// Add missing utility functions
export const isDocumentStatusEqual = (status: any, compareWith: DocumentStatus): boolean => {
  if (typeof status === 'string') {
    return stringToDocumentStatus(status) === compareWith;
  }
  return status === compareWith;
};

export const isStatusEqual = (status: any, compareWith: string): boolean => {
  if (typeof status === 'string') {
    return status === compareWith;
  }
  const statusString = String(status);
  return statusString === compareWith;
};

export const isStringStatusEqual = (status: any, compareWith: string): boolean => {
  return String(status).toLowerCase() === String(compareWith).toLowerCase();
};

export const formatEnumValue = (value: string): string => {
  // Format enum values for display (e.g., "In_Progress" to "In Progress")
  return value.replace(/_/g, ' ');
};

export const convertToCAPAStatus = (status: string): CAPAStatus => {
  return stringToCAPAStatus(status);
};

// Add any other missing utility functions
