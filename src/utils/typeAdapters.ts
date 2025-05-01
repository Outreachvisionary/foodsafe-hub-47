
import { DocumentStatus, CheckoutStatus } from '@/types/enums';
import { TrainingStatus } from '@/types/enums';
import { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/enums';
import { CAPA } from '@/types/capa';

// Document status conversion functions
export const stringToDocumentStatus = (status: string): DocumentStatus => {
  if (Object.values(DocumentStatus).includes(status as DocumentStatus)) {
    return status as DocumentStatus;
  }
  return DocumentStatus.Draft; // Default fallback
};

export const documentStatusToString = (status: DocumentStatus): string => {
  return status.toString();
};

// Checkout status conversion functions
export const stringToCheckoutStatus = (status: string): CheckoutStatus => {
  if (Object.values(CheckoutStatus).includes(status as CheckoutStatus)) {
    return status as CheckoutStatus;
  }
  return CheckoutStatus.Available; // Default fallback
};

export const checkoutStatusToString = (status: CheckoutStatus): string => {
  return status.toString();
};

// Training status conversion functions
export const stringToTrainingStatus = (status: string): TrainingStatus => {
  if (Object.values(TrainingStatus).includes(status as TrainingStatus)) {
    return status as TrainingStatus;
  }
  return TrainingStatus.NotStarted; // Default fallback
};

export const trainingStatusToString = (status: TrainingStatus): string => {
  return status.toString();
};

// CAPA status conversion functions
export const stringToCAPAStatus = (status: string): CAPAStatus => {
  if (Object.values(CAPAStatus).includes(status as CAPAStatus)) {
    return status as CAPAStatus;
  }
  return CAPAStatus.Open; // Default fallback
};

export const capaStatusToString = (status: CAPAStatus): string => {
  return status.toString();
};

// CAPA priority conversion functions
export const stringToCAPAPriority = (priority: string): CAPAPriority => {
  if (Object.values(CAPAPriority).includes(priority as CAPAPriority)) {
    return priority as CAPAPriority;
  }
  return CAPAPriority.Medium; // Default fallback
};

export const capaPriorityToString = (priority: CAPAPriority): string => {
  return priority.toString();
};

// CAPA source conversion functions
export const stringToCAPASource = (source: string): CAPASource => {
  if (Object.values(CAPASource).includes(source as CAPASource)) {
    return source as CAPASource;
  }
  return CAPASource.Other; // Default fallback
};

export const capaSourceToString = (source: CAPASource): string => {
  return source.toString();
};

// Helper for comparing status values regardless of case and formatting
export const isStatusEqual = (status1: any, status2: any): boolean => {
  if (!status1 || !status2) return false;
  return String(status1).toLowerCase().replace(/_/g, '') === String(status2).toLowerCase().replace(/_/g, '');
};

// Helper for string status comparison
export const isStringStatusEqual = (status1: string, status2: string): boolean => {
  if (!status1 || !status2) return false;
  return status1.toLowerCase().replace(/_/g, '') === status2.toLowerCase().replace(/_/g, '');
};

// Format enum value for display (replace underscores with spaces)
export const formatEnumValue = (value: string): string => {
  if (!value) return '';
  return value.replace(/_/g, ' ');
};

// Convert string to CAPAStatus - used by capaActivityService and capaFetchService
export const convertToCAPAStatus = (status: string): CAPAStatus => {
  const normalizedStatus = status?.toLowerCase().replace(/ /g, '_');
  
  switch(normalizedStatus) {
    case 'open': return CAPAStatus.Open;
    case 'in_progress': return CAPAStatus.InProgress;
    case 'under_review': return CAPAStatus.UnderReview;
    case 'completed': return CAPAStatus.Completed;
    case 'closed': return CAPAStatus.Closed;
    case 'rejected': return CAPAStatus.Rejected;
    case 'on_hold': return CAPAStatus.OnHold;
    case 'overdue': return CAPAStatus.Overdue;
    case 'pending_verification': return CAPAStatus.PendingVerification;
    case 'verified': return CAPAStatus.Verified;
    default: return CAPAStatus.Open;
  }
};

// Added to fix missing function reference in capaUpdateService.ts
export const adaptCAPAToModel = (capa: any): CAPA => {
  return {
    ...capa,
    status: convertToCAPAStatus(capa.status),
    priority: stringToCAPAPriority(capa.priority),
    source: stringToCAPASource(capa.source),
    updated_at: capa.updated_at || capa.created_at || new Date().toISOString()
  };
};
