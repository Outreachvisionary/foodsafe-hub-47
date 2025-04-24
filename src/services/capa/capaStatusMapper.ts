
/**
 * CAPA Status Mapper
 * 
 * Utility for mapping between different CAPA status formats 
 * to ensure type compatibility across the application
 */

// Define the standard CAPA status enum
export enum CAPAStatus {
  Open = 'Open',
  InProgress = 'In_Progress',
  Closed = 'Closed',
  Overdue = 'Overdue',
  PendingVerification = 'Pending_Verification',
  Verified = 'Verified'
}

// Define the standard CAPA effectiveness rating enum
export enum CAPAEffectivenessRating {
  HighlyEffective = 'Highly_Effective',
  Effective = 'Effective',
  PartiallyEffective = 'Partially_Effective',
  NotEffective = 'Not_Effective'
}

// Define the standard CAPA priority enum
export enum CAPAPriority {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

// Define the standard CAPA source enum
export enum CAPASource {
  Audit = 'Audit',
  Complaint = 'Complaint',
  InternalFinding = 'Internal_Finding',
  NonConformance = 'Non_Conformance',
  Other = 'Other'
}

// Type for database CAPA status
export type DbCAPAStatus = 
  | 'Open' 
  | 'In Progress' 
  | 'Closed' 
  | 'Overdue' 
  | 'Pending Verification'
  | 'Verified';

// Type for database CAPA effectiveness rating
export type DbEffectivenessRating = 
  | 'Highly Effective' 
  | 'Effective' 
  | 'Partially Effective' 
  | 'Not Effective';

/**
 * Maps application CAPA status to database format
 */
export const mapStatusToDb = (status: CAPAStatus): DbCAPAStatus => {
  switch (status) {
    case CAPAStatus.Open:
      return 'Open';
    case CAPAStatus.InProgress:
      return 'In Progress';
    case CAPAStatus.Closed:
      return 'Closed';
    case CAPAStatus.Overdue:
      return 'Overdue';
    case CAPAStatus.PendingVerification:
      return 'Pending Verification';
    case CAPAStatus.Verified:
      return 'Verified';
    default:
      return 'Open';
  }
};

/**
 * Maps database CAPA status to application format
 */
export const mapStatusFromDb = (status: string): CAPAStatus => {
  switch (status) {
    case 'Open':
      return CAPAStatus.Open;
    case 'In Progress':
      return CAPAStatus.InProgress;
    case 'Closed':
      return CAPAStatus.Closed;
    case 'Overdue':
      return CAPAStatus.Overdue;
    case 'Pending Verification':
      return CAPAStatus.PendingVerification;
    case 'Verified':
      return CAPAStatus.Verified;
    default:
      return CAPAStatus.Open;
  }
};

/**
 * Maps application effectiveness rating to database format
 */
export const mapEffectivenessRatingToDb = (rating: CAPAEffectivenessRating): DbEffectivenessRating => {
  switch (rating) {
    case CAPAEffectivenessRating.HighlyEffective:
      return 'Highly Effective';
    case CAPAEffectivenessRating.Effective:
      return 'Effective';
    case CAPAEffectivenessRating.PartiallyEffective:
      return 'Partially Effective';
    case CAPAEffectivenessRating.NotEffective:
      return 'Not Effective';
    default:
      return 'Effective';
  }
};

/**
 * Maps database effectiveness rating to application format
 */
export const mapEffectivenessRatingFromDb = (rating: string): CAPAEffectivenessRating => {
  switch (rating) {
    case 'Highly Effective':
      return CAPAEffectivenessRating.HighlyEffective;
    case 'Effective':
      return CAPAEffectivenessRating.Effective;
    case 'Partially Effective':
      return CAPAEffectivenessRating.PartiallyEffective;
    case 'Not Effective':
      return CAPAEffectivenessRating.NotEffective;
    default:
      return CAPAEffectivenessRating.Effective;
  }
};

/**
 * Maps priority string to enum
 */
export const mapPriority = (priority: string): CAPAPriority => {
  switch (priority.toLowerCase()) {
    case 'critical':
      return CAPAPriority.Critical;
    case 'high':
      return CAPAPriority.High;
    case 'medium':
      return CAPAPriority.Medium;
    case 'low':
      return CAPAPriority.Low;
    default:
      return CAPAPriority.Medium;
  }
};

/**
 * Maps source string to enum
 */
export const mapSource = (source: string): CAPASource => {
  switch (source.toLowerCase().replace(' ', '_')) {
    case 'audit':
      return CAPASource.Audit;
    case 'complaint':
      return CAPASource.Complaint;
    case 'internal_finding':
      return CAPASource.InternalFinding;
    case 'non_conformance':
      return CAPASource.NonConformance;
    default:
      return CAPASource.Other;
  }
};

export default {
  mapStatusToDb,
  mapStatusFromDb,
  mapEffectivenessRatingToDb,
  mapEffectivenessRatingFromDb,
  mapPriority,
  mapSource
};
