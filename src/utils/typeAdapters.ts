
import { DocumentStatus, CheckoutStatus } from '@/types/document';
import { CAPAStatus, CAPAEffectivenessRating } from '@/types/capa';

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
  if (!Object.values(CAPAStatus).includes(status as CAPAStatus)) {
    return 'Open'; // Default status
  }
  return status as CAPAStatus;
}

/**
 * Converts a string value to a valid DocumentStatus, defaulting to 'Draft' if invalid
 */
export const convertToDocumentStatus = (status: string): DocumentStatus => {
  if (!Object.values(DocumentStatus).includes(status as DocumentStatus)) {
    return 'Draft'; // Default status
  }
  return status as DocumentStatus;
}

/**
 * Converts a string value to a valid CheckoutStatus, defaulting to 'Available' if invalid
 */
export const convertToCheckoutStatus = (status: string | undefined): CheckoutStatus => {
  return (status as CheckoutStatus) === 'Checked_Out' ? 'Checked_Out' : 'Available';
}

/**
 * Converts a string value to a valid CAPAEffectivenessRating, defaulting to 'Not_Effective' if invalid
 */
export const convertToEffectivenessRating = (rating: string | undefined): CAPAEffectivenessRating => {
  if (!rating || !Object.values(CAPAEffectivenessRating).includes(rating as CAPAEffectivenessRating)) {
    return 'Not_Effective'; // Default rating
  }
  return rating as CAPAEffectivenessRating;
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

/**
 * Adapter to convert database document to frontend Document type
 */
export const adaptDatabaseToDocument = (dbDocument: any): Document => {
  return {
    ...dbDocument,
    status: convertToDocumentStatus(dbDocument.status),
    checkout_status: convertToCheckoutStatus(dbDocument.checkout_status || 'Available')
  };
}

/**
 * Adapter to convert frontend Document to database format
 */
export const adaptDocumentToDatabase = (document: Partial<Document>): any => {
  return {
    ...document,
    category: document.category || 'Other',
    status: document.status || 'Draft',
    checkout_status: document.checkout_status || 'Available'
  };
}
