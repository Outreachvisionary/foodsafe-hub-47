
import { DocumentStatus, CheckoutStatus } from '@/types/document';
import { CAPAStatus, CAPAEffectivenessRating, CAPA } from '@/types/capa';

export const isDocumentStatus = (
  status: string,
  expectedStatus: DocumentStatus
): boolean => {
  // Normalize status strings by replacing underscores with spaces
  const normalizedStatus = status.replace(/_/g, ' ');
  const normalizedExpectedStatus = expectedStatus.replace(/_/g, ' ');
  
  return normalizedStatus.toLowerCase() === normalizedExpectedStatus.toLowerCase();
};

export const isCheckoutStatus = (
  status: string,
  expectedStatus: CheckoutStatus
): boolean => {
  // Normalize status strings by replacing underscores with spaces
  const normalizedStatus = status.replace(/_/g, ' ');
  const normalizedExpectedStatus = expectedStatus.replace(/_/g, ' ');
  
  return normalizedStatus.toLowerCase() === normalizedExpectedStatus.toLowerCase();
};

export const convertToCAPAStatus = (status: string): CAPAStatus => {
  // Convert string to CAPAStatus enum
  return status.replace(/ /g, '_') as CAPAStatus;
};

export const convertToEffectivenessRating = (rating?: string): CAPAEffectivenessRating | undefined => {
  if (!rating) return undefined;
  
  // Convert string to CAPAEffectivenessRating enum
  return rating.replace(/ /g, '_') as CAPAEffectivenessRating;
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
