
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
 * Checks if a document status equals a specific status
 */
export const isDocumentStatusEqual = (status: any, targetStatus: DocumentStatus): boolean => {
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
