
import { DocumentStatus, CheckoutStatus } from '@/types/document';
import { CAPAStatus, CAPAEffectivenessRating, CAPASource, CAPAPriority } from '@/types/capa';

/**
 * Type guard to check if a string value matches a DocumentStatus enum
 */
export const isDocumentStatus = (status: string, compareStatus: string): boolean => {
  // Convert underscores to spaces for comparison if needed
  const normalizedCompareStatus = compareStatus.replace(/_/g, ' ');
  const normalizedStatus = status.replace(/_/g, ' ');
  
  return normalizedStatus.toLowerCase() === normalizedCompareStatus.toLowerCase();
}

/**
 * Type guard to check if a string value matches a CheckoutStatus enum
 */
export const isCheckoutStatus = (status: string | undefined, compareStatus: string): boolean => {
  if (!status) return false;
  
  // Convert underscores to spaces for comparison
  const normalizedCompareStatus = compareStatus.replace(/_/g, ' ');
  const normalizedStatus = status.replace(/_/g, ' ');
  
  return normalizedStatus.toLowerCase() === normalizedCompareStatus.toLowerCase();
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
  // Replace spaces with underscores for consistent formatting
  source = source.replace(/ /g, '_');
  
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
  // Normalize status string by replacing spaces with underscores
  const normalizedStatus = status.replace(/ /g, '_');
  
  const validStatuses = [
    'Draft', 'In_Review', 'Pending_Review', 'Pending_Approval',
    'Approved', 'Published', 'Archived', 'Rejected',
    'Obsolete', 'Active', 'Expired'
  ];
  
  if (validStatuses.includes(normalizedStatus)) {
    return normalizedStatus as DocumentStatus;
  }
  
  return 'Draft';
}

/**
 * Converts a string value to a valid CheckoutStatus, defaulting to 'Available' if invalid
 */
export const convertToCheckoutStatus = (status: string | undefined): CheckoutStatus => {
  if (!status) return 'Available';
  
  // Convert underscores to spaces
  const normalizedStatus = status.replace(/_/g, ' ');
  
  return normalizedStatus === 'Checked Out' ? 'Checked Out' : 'Available';
}

/**
 * Converts a string value to a valid CAPAEffectivenessRating, defaulting to 'Not_Effective' if invalid
 */
export const convertToEffectivenessRating = (rating: string | undefined): CAPAEffectivenessRating | undefined => {
  if (!rating) return undefined;
  
  // Replace spaces with underscores for consistent formatting
  rating = rating.replace(/ /g, '_');
  
  const validRatings = [
    'Not_Effective', 'Partially_Effective', 'Effective', 'Highly_Effective'
  ];
  
  return validRatings.includes(rating) ? rating as CAPAEffectivenessRating : 'Not_Effective';
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
