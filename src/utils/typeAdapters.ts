
import { DocumentStatus, CheckoutStatus } from '@/types/document';
import { CAPAStatus, CAPAEffectivenessRating, CAPASource, CAPAPriority } from '@/types/capa';

/**
 * Type guard to check if a string value matches a DocumentStatus enum
 */
export const isDocumentStatus = (status: string, compareStatus: DocumentStatus): boolean => {
  return status === compareStatus;
}

/**
 * Type guard to check if a string value matches a CheckoutStatus enum
 */
export const isCheckoutStatus = (status: string | undefined, compareStatus: CheckoutStatus): boolean => {
  return status === compareStatus;
}

/**
 * Converts a string value to a valid CAPAStatus, defaulting to 'Open' if invalid
 */
export const convertToCAPAStatus = (status: string): CAPAStatus => {
  const validStatuses = [
    'Open', 'In_Progress', 'Under_Review', 'Completed', 
    'Closed', 'Rejected', 'On_Hold', 'Overdue', 
    'Pending_Verification', 'Verified'
  ];
  
  return validStatuses.includes(status) ? status as CAPAStatus : 'Open';
}

/**
 * Converts a string value to a valid CAPASource, defaulting to 'Other' if invalid
 */
export const convertToCAPASource = (source: string): CAPASource => {
  const validSources = [
    'Audit', 'Customer_Complaint', 'Internal_Issue', 'Regulatory',
    'Supplier_Issue', 'Non_Conformance', 'Management_Review', 'Other'
  ];
  
  return validSources.includes(source) ? source as CAPASource : 'Other';
}

/**
 * Converts a string value to a valid DocumentStatus, defaulting to 'Draft' if invalid
 */
export const convertToDocumentStatus = (status: string): DocumentStatus => {
  const validStatuses = [
    'Draft', 'In_Review', 'Pending_Review', 'Pending_Approval',
    'Approved', 'Published', 'Archived', 'Rejected',
    'Obsolete', 'Active', 'Expired'
  ];
  
  return validStatuses.includes(status) ? status as DocumentStatus : 'Draft';
}

/**
 * Converts a string value to a valid CheckoutStatus, defaulting to 'Available' if invalid
 */
export const convertToCheckoutStatus = (status: string | undefined): CheckoutStatus => {
  return status === 'Checked_Out' ? 'Checked_Out' : 'Available';
}

/**
 * Converts a string value to a valid CAPAEffectivenessRating, defaulting to 'Not_Effective' if invalid
 */
export const convertToEffectivenessRating = (rating: string | undefined): CAPAEffectivenessRating => {
  const validRatings = [
    'Not_Effective', 'Partially_Effective', 'Effective', 'Highly_Effective'
  ];
  
  return rating && validRatings.includes(rating) ? rating as CAPAEffectivenessRating : 'Not_Effective';
}

/**
 * Converts a string value to a valid CAPAPriority, defaulting to 'Medium' if invalid
 */
export const convertToCAPAPriority = (priority: string): CAPAPriority => {
  const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
  
  return validPriorities.includes(priority) ? priority as CAPAPriority : 'Medium';
}

/**
 * Safely access JSON properties without causing TypeScript errors
 */
export const safeJsonAccess = <T>(obj: any, path: string, defaultValue: T): T => {
  try {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === undefined || result === null) return defaultValue;
      result = result[key];
    }
    
    return (result === undefined || result === null) ? defaultValue : result as T;
  } catch (error) {
    return defaultValue;
  }
}
