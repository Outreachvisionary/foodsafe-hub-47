
import { CheckoutStatus, DocumentStatus, CAPAStatus, CAPAEffectivenessRating } from '@/types/enums';
import { Document } from '@/types/document';
import { CAPA } from '@/types/capa';

export const isCheckoutStatus = (value: string, status: CheckoutStatus): boolean => {
  return value?.replace(/ /g, '_').toLowerCase() === status.toLowerCase();
};

export const isDocumentStatus = (value: string, status: DocumentStatus): boolean => {
  return value?.replace(/ /g, '_').toLowerCase() === status.toLowerCase();
};

export const isCAPAStatus = (value: string, status: CAPAStatus): boolean => {
  return value?.replace(/ /g, '_').toLowerCase() === status.toLowerCase();
};

export const isEffectivenessRating = (value: string, rating: CAPAEffectivenessRating): boolean => {
  return value?.replace(/ /g, '_').toLowerCase() === rating.toLowerCase();
};

// Add function for adapting document model
export const adaptDocumentToModel = (doc: any): Document => {
  return {
    ...doc,
    status: doc.status as DocumentStatus,
    checkout_status: doc.checkout_status as CheckoutStatus
  };
};

// Convert to CAPA status from string
export const convertToCAPAStatus = (statusString: string): CAPAStatus => {
  const normalizedStatus = statusString.replace(/ /g, '_');
  
  switch(normalizedStatus.toLowerCase()) {
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

// Function to convert string to effectiveness rating
export const convertToEffectivenessRating = (rating: string): CAPAEffectivenessRating => {
  const normalizedRating = rating.replace(/ /g, '_');
  
  switch(normalizedRating.toLowerCase()) {
    case 'not_effective': return CAPAEffectivenessRating.NotEffective;
    case 'partially_effective': return CAPAEffectivenessRating.PartiallyEffective;
    case 'effective': return CAPAEffectivenessRating.Effective;
    case 'highly_effective': return CAPAEffectivenessRating.HighlyEffective;
    default: return CAPAEffectivenessRating.NotEffective;
  }
};

export const mapDocumentStatusFromString = (status: string): DocumentStatus => {
  const normalizedStatus = status.replace(/ /g, '_');
  
  switch(normalizedStatus.toLowerCase()) {
    case 'draft': return DocumentStatus.Draft;
    case 'in_review': return DocumentStatus.InReview;
    case 'pending_review': return DocumentStatus.PendingReview;
    case 'pending_approval': return DocumentStatus.PendingApproval;
    case 'approved': return DocumentStatus.Approved;
    case 'published': return DocumentStatus.Published;
    case 'archived': return DocumentStatus.Archived;
    case 'rejected': return DocumentStatus.Rejected;
    case 'obsolete': return DocumentStatus.Obsolete;
    case 'active': return DocumentStatus.Active;
    case 'expired': return DocumentStatus.Expired;
    default: return DocumentStatus.Draft;
  }
};

// Add the missing convertDatabaseCAPAToModel function
export const convertDatabaseCAPAToModel = (dbCapa: any): CAPA => {
  return {
    id: dbCapa.id,
    title: dbCapa.title,
    description: dbCapa.description,
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
    effectiveness_rating: dbCapa.effectiveness_rating as CAPAEffectivenessRating,
    verified_by: dbCapa.verified_by,
    verification_date: dbCapa.verification_date,
    fsma204_compliant: dbCapa.fsma204_compliant,
    department_id: dbCapa.department_id,
    facility_id: dbCapa.facility_id,
    department: dbCapa.department
  };
};
