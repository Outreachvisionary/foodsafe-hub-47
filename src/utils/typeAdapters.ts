
import { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/enums';
import { DocumentStatus, CheckoutStatus } from '@/types/enums';

/**
 * Helper function to create an empty record for CAPA priorities
 */
export const createEmptyCAPAPriorityRecord = (): Record<CAPAPriority, number> => {
  return {
    [CAPAPriority.Low]: 0,
    [CAPAPriority.Medium]: 0,
    [CAPAPriority.High]: 0,
    [CAPAPriority.Critical]: 0
  };
};

/**
 * Helper function to create an empty record for CAPA sources
 */
export const createEmptyCAPASourceRecord = (): Record<CAPASource, number> => {
  return {
    [CAPASource.Audit]: 0,
    [CAPASource.CustomerComplaint]: 0,
    [CAPASource.InternalReport]: 0,
    [CAPASource.NonConformance]: 0,
    [CAPASource.RegulatoryInspection]: 0,
    [CAPASource.SupplierIssue]: 0,
    [CAPASource.Other]: 0
  };
};

/**
 * Converts a string value to a CAPAStatus enum value
 */
export const stringToCAPAStatus = (status: string): CAPAStatus => {
  // Normalize and match with enum
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  const enumValue = CAPAStatus[normalizedStatus as keyof typeof CAPAStatus];
  return enumValue || CAPAStatus.Open;
};

/**
 * Converts a string value to a CAPAPriority enum value
 */
export const stringToCAPAPriority = (priority: string): CAPAPriority => {
  // Normalize and match with enum
  const normalizedPriority = priority.replace(/ /g, '_').toUpperCase();
  const enumValue = CAPAPriority[normalizedPriority as keyof typeof CAPAPriority];
  return enumValue || CAPAPriority.Medium;
};

/**
 * Converts a string value to a CAPASource enum value
 */
export const stringToCAPASource = (source: string): CAPASource => {
  // Normalize and match with enum
  const normalizedSource = source.replace(/ /g, '_').toUpperCase();
  const enumValue = CAPASource[normalizedSource as keyof typeof CAPASource];
  return enumValue || CAPASource.Other;
};

/**
 * Converts CAPAStatus enum to a user-friendly display string
 */
export const capaStatusToDisplayString = (status: CAPAStatus): string => {
  return status.toString().replace(/_/g, ' ');
};

/**
 * Checks if a document status equals a specific status
 */
export const isStatusEqual = (status: any, targetStatus: DocumentStatus): boolean => {
  if (!status) return false;
  
  if (typeof status === 'string') {
    const normalizedStatus = status.replace(/_/g, ' ').toLowerCase();
    const normalizedTarget = targetStatus.toString().replace(/_/g, ' ').toLowerCase();
    return normalizedStatus === normalizedTarget;
  }
  
  return status === targetStatus;
};

/**
 * Checks if a CAPA effectiveness rating equals a specific rating
 */
export const isEffectivenessRating = (rating: any, targetRating: CAPAEffectivenessRating): boolean => {
  if (!rating) return false;
  
  if (typeof rating === 'string') {
    const normalizedRating = rating.replace(/_/g, ' ').toLowerCase();
    const normalizedTarget = targetRating.toString().replace(/_/g, ' ').toLowerCase();
    return normalizedRating === normalizedTarget;
  }
  
  return rating === targetRating;
};

/**
 * Converts string status to DocumentStatus enum
 */
export const stringToDocumentStatus = (status: string): DocumentStatus => {
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  return DocumentStatus[normalizedStatus as keyof typeof DocumentStatus] || DocumentStatus.Draft;
};

/**
 * Converts DocumentStatus enum to string
 */
export const documentStatusToString = (status: DocumentStatus): string => {
  return status.toString().replace(/_/g, ' ');
};

/**
 * Converts a CAPAStatus string to a CAPAStatus enum value
 */
export const convertToCAPAStatus = (statusString: string): CAPAStatus => {
  const normalized = statusString.replace(/ /g, '_').toUpperCase();
  return CAPAStatus[normalized as keyof typeof CAPAStatus] || CAPAStatus.Open;
};

/**
 * Safe type checking for string vs enum status comparison
 */
export const isStringStatusEqual = (stringStatus: string, enumStatus: string): boolean => {
  return stringStatus.replace(/ /g, '_').toUpperCase() === enumStatus.replace(/ /g, '_').toUpperCase();
};
