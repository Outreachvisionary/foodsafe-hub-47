
import { DocumentStatus, CheckoutStatus } from '@/types/enums';
import { CAPAStatus, CAPAEffectivenessRating, CAPA } from '@/types/capa';

export const isDocumentStatus = (
  status: string,
  expectedStatus: DocumentStatus
): boolean => {
  // Normalize status strings by replacing underscores with spaces
  const normalizedStatus = status?.replace(/_/g, ' ');
  const normalizedExpectedStatus = expectedStatus?.replace(/_/g, ' ');
  
  return normalizedStatus?.toLowerCase() === normalizedExpectedStatus?.toLowerCase();
};

export const isCheckoutStatus = (
  status: string,
  expectedStatus: CheckoutStatus
): boolean => {
  // Normalize status strings by replacing underscores with spaces
  const normalizedStatus = status?.replace(/_/g, ' ');
  const normalizedExpectedStatus = expectedStatus?.replace(/_/g, ' ');
  
  return normalizedStatus?.toLowerCase() === normalizedExpectedStatus?.toLowerCase();
};

export const convertToCAPAStatus = (status: string): CAPAStatus => {
  // Convert string to CAPAStatus enum
  switch(status?.toLowerCase().replace(/ /g, '_')) {
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

export const convertToEffectivenessRating = (rating?: string): CAPAEffectivenessRating | undefined => {
  if (!rating) return undefined;
  
  // Convert string to CAPAEffectivenessRating enum
  switch(rating.toLowerCase().replace(/ /g, '_')) {
    case 'not_effective': return CAPAEffectivenessRating.NotEffective;
    case 'partially_effective': return CAPAEffectivenessRating.PartiallyEffective;
    case 'effective': return CAPAEffectivenessRating.Effective;
    case 'highly_effective': return CAPAEffectivenessRating.HighlyEffective;
    default: return undefined;
  }
};

export const convertDatabaseCAPAToModel = (dbCAPA: any): CAPA => {
  return {
    id: dbCAPA.id,
    title: dbCAPA.title,
    description: dbCAPA.description,
    status: convertToCAPAStatus(dbCAPA.status),
    priority: dbCAPA.priority,
    createdAt: dbCAPA.created_at,
    createdBy: dbCAPA.created_by,
    dueDate: dbCAPA.due_date,
    assignedTo: dbCAPA.assigned_to,
    source: dbCAPA.source,
    sourceId: dbCAPA.source_id || '',
    sourceReference: dbCAPA.source_reference || '',
    completionDate: dbCAPA.completion_date,
    rootCause: dbCAPA.root_cause,
    correctiveAction: dbCAPA.corrective_action,
    preventiveAction: dbCAPA.preventive_action,
    effectivenessCriteria: dbCAPA.effectiveness_criteria,
    effectivenessRating: convertToEffectivenessRating(dbCAPA.effectiveness_rating),
    effectivenessVerified: dbCAPA.effectiveness_verified || false,
    verificationDate: dbCAPA.verification_date,
    verificationMethod: dbCAPA.verification_method,
    verifiedBy: dbCAPA.verified_by,
    department: dbCAPA.department,
    fsma204Compliant: dbCAPA.fsma204_compliant || false,
    relatedDocuments: dbCAPA.relatedDocuments || [],
    relatedTraining: dbCAPA.relatedTraining || []
  };
};

// Convert model format to database format for CAPA
export const convertModelCAPAToDatabase = (capa: CAPA): Record<string, any> => {
  return {
    id: capa.id,
    title: capa.title,
    description: capa.description,
    status: capa.status.toString(),
    priority: capa.priority,
    created_at: capa.createdAt,
    created_by: capa.createdBy,
    due_date: capa.dueDate,
    assigned_to: capa.assignedTo,
    source: capa.source,
    source_id: capa.sourceId,
    source_reference: capa.sourceReference,
    completion_date: capa.completionDate,
    root_cause: capa.rootCause,
    corrective_action: capa.correctiveAction,
    preventive_action: capa.preventiveAction,
    effectiveness_criteria: capa.effectivenessCriteria,
    effectiveness_rating: capa.effectivenessRating?.toString(),
    effectiveness_verified: capa.effectivenessVerified,
    verification_date: capa.verificationDate,
    verification_method: capa.verificationMethod,
    verified_by: capa.verifiedBy,
    department: capa.department,
    fsma204_compliant: capa.fsma204Compliant
  };
};
