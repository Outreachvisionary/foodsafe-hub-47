
import { CAPA } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';

/**
 * Converts a database CAPA object to the CAPA model
 */
export const convertDatabaseCAPAToModel = (dbCapa: any): CAPA => {
  return {
    id: dbCapa.id,
    title: dbCapa.title,
    description: dbCapa.description || '',
    status: dbCapa.status as CAPAStatus,
    priority: dbCapa.priority,
    source: dbCapa.source,
    source_id: dbCapa.source_id,
    assigned_to: dbCapa.assigned_to,
    created_by: dbCapa.created_by,
    created_at: dbCapa.created_at,
    updated_at: dbCapa.updated_at,
    due_date: dbCapa.due_date,
    completion_date: dbCapa.completion_date,
    root_cause: dbCapa.root_cause,
    corrective_action: dbCapa.corrective_action,
    preventive_action: dbCapa.preventive_action,
    verification_method: dbCapa.verification_method,
    effectiveness_criteria: dbCapa.effectiveness_criteria,
    effectiveness_rating: dbCapa.effectiveness_rating,
    verified_by: dbCapa.verified_by,
    verification_date: dbCapa.verification_date,
    fsma204_compliant: dbCapa.fsma204_compliant || false,
    department_id: dbCapa.department_id,
    facility_id: dbCapa.facility_id,
    department: dbCapa.department,
    source_reference: dbCapa.source_reference
  };
};

/**
 * Checks if a status value is equal to a given status string
 */
export const isStatusEqual = (status: any, targetStatus: string): boolean => {
  if (!status) return false;
  
  // Handle enum-style status with underscores
  if (typeof status === 'string') {
    const normalizedStatus = status.replace(/_/g, ' ').toLowerCase();
    const normalizedTarget = targetStatus.replace(/_/g, ' ').toLowerCase();
    return normalizedStatus === normalizedTarget;
  }
  
  return false;
};

/**
 * Converts a string to camelCase
 */
export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (match, group) => group.toUpperCase());
};

/**
 * Converts a string to snake_case
 */
export const toSnakeCase = (str: string): string => {
  return str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
};

/**
 * Converts a string status to CAPAStatus enum
 */
export const convertToCAPAStatus = (status: string): CAPAStatus => {
  switch (status.toLowerCase()) {
    case 'open':
      return CAPAStatus.Open;
    case 'in progress':
    case 'in_progress':
      return CAPAStatus.InProgress;
    case 'completed':
      return CAPAStatus.Completed;
    case 'closed':
      return CAPAStatus.Closed;
    case 'rejected':
      return CAPAStatus.Rejected;
    case 'on hold':
    case 'on_hold':
      return CAPAStatus.OnHold;
    case 'overdue':
      return CAPAStatus.Overdue;
    case 'pending verification':
    case 'pending_verification':
      return CAPAStatus.PendingVerification;
    case 'verified':
      return CAPAStatus.Verified;
    case 'under review':
    case 'under_review':
      return CAPAStatus.UnderReview;
    default:
      return CAPAStatus.Open;
  }
};
