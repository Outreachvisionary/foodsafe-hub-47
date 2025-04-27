
/**
 * Type adapters to convert between database and application formats
 * These utilities help prevent type mismatches across the application
 */

import { DocumentStatus, CheckoutStatus, DocumentCategory } from '@/types/document';
import { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/capa';
import { ComplaintStatus } from '@/types/complaint';

// Document status conversions
export function convertToDocumentStatus(status: string): DocumentStatus {
  // Map string status to our enum type
  switch(status.replace(/ /g, '_')) {
    case 'Draft': return 'Draft';
    case 'In_Review': return 'In_Review';
    case 'Pending_Review': return 'Pending_Review';
    case 'Pending_Approval': return 'Pending_Approval';
    case 'Approved': return 'Approved';
    case 'Published': return 'Published';
    case 'Archived': return 'Archived';
    case 'Rejected': return 'Rejected';
    case 'Obsolete': return 'Obsolete';
    case 'Active': return 'Active';
    case 'Expired': return 'Expired';
    default: return 'Draft';
  }
}

export function isDocumentStatus(status: string, compareStatus: DocumentStatus): boolean {
  return convertToDocumentStatus(status) === compareStatus;
}

// Checkout status conversions
export function convertToCheckoutStatus(status: string): CheckoutStatus {
  if (status === 'Checked Out' || status === 'Checked_Out') return 'Checked_Out';
  return 'Available';
}

export function isCheckoutStatus(status: string, compareStatus: CheckoutStatus): boolean {
  return convertToCheckoutStatus(status) === compareStatus;
}

// CAPA status conversions
export function convertToCAPAStatus(status: string): CAPAStatus {
  // Map string status to our enum type
  switch(status.replace(/ /g, '_')) {
    case 'Open': return 'Open';
    case 'In_Progress': return 'In_Progress';
    case 'Under_Review': return 'Under_Review';
    case 'Completed': return 'Completed';
    case 'Closed': return 'Closed';
    case 'Rejected': return 'Rejected';
    case 'On_Hold': return 'On_Hold';
    case 'Overdue': return 'Overdue';
    case 'Pending_Verification': return 'Pending_Verification';
    case 'Verified': return 'Verified';
    default: return 'Open';
  }
}

export function isCAPAStatus(status: string, compareStatus: CAPAStatus): boolean {
  return convertToCAPAStatus(status) === compareStatus;
}

// CAPA effectiveness rating conversions
export function convertToEffectivenessRating(rating: string | undefined): CAPAEffectivenessRating | undefined {
  if (!rating) return undefined;
  
  switch(rating.replace(/ /g, '_')) {
    case 'Not_Effective': return 'Not_Effective';
    case 'Partially_Effective': return 'Partially_Effective';
    case 'Effective': return 'Effective';
    case 'Highly_Effective': return 'Highly_Effective';
    default: return undefined;
  }
}

// Complaint status conversions
export function convertToComplaintStatus(status: string): ComplaintStatus {
  switch(status.replace(/ /g, '_')) {
    case 'New': return 'New';
    case 'Under_Investigation': return 'Under_Investigation';
    case 'Resolved': return 'Resolved';
    case 'Closed': return 'Closed';
    case 'Reopened': return 'Reopened';
    default: return 'New';
  }
}

// JSON type safety utility
export function safeJsonAccess<T>(jsonObj: any, defaultValue: T): T {
  if (typeof jsonObj === 'object' && jsonObj !== null && !Array.isArray(jsonObj)) {
    return jsonObj as T;
  }
  return defaultValue;
}

// Database to Application model adapters
export function adaptDatabaseToDocument(dbDocument: any): Document {
  return {
    ...dbDocument,
    status: convertToDocumentStatus(dbDocument.status),
    checkout_status: convertToCheckoutStatus(dbDocument.checkout_status || 'Available')
  };
}

export function adaptDocumentToDatabase(document: Partial<Document>): any {
  // Ensure required fields for database
  return {
    ...document,
    category: document.category || 'Other',
    status: document.status || 'Draft',
    checkout_status: document.checkout_status || 'Available'
  };
}

