
import { DocumentStatus, CheckoutStatus } from '@/types/document';
import { CAPAStatus, CAPAEffectivenessRating, CAPA } from '@/types/capa';
import { TrainingStatus } from '@/types/training';

/**
 * Convert string to Document Status
 */
export function convertToDocumentStatus(status: string): DocumentStatus {
  return status as DocumentStatus;
}

/**
 * Convert string to Checkout Status
 */
export function convertToCheckoutStatus(status: string): CheckoutStatus {
  if (status === 'Checked_Out') return 'Checked Out';
  return status as CheckoutStatus;
}

/**
 * Convert string to CAPA Status
 */
export function convertToCAPAStatus(status: string): CAPAStatus {
  return status as CAPAStatus;
}

/**
 * Convert string to Effectiveness Rating
 */
export function convertToEffectivenessRating(rating: string | undefined): CAPAEffectivenessRating | undefined {
  if (!rating) return undefined;
  return rating as CAPAEffectivenessRating;
}

/**
 * Convert string to Training Status
 */
export function convertToTrainingStatus(status: string): TrainingStatus {
  if (status === 'not-started') return 'Not Started';
  if (status === 'in-progress') return 'In Progress';
  if (status === 'completed') return 'Completed';
  return status as TrainingStatus;
}

/**
 * Check if a value is a valid Document Status
 */
export function isDocumentStatus(status: string, expectedStatus: DocumentStatus): boolean {
  if (status === 'Pending_Approval' && expectedStatus === 'Pending Approval') return true;
  if (status === 'In_Review' && expectedStatus === 'In Review') return true;
  if (status === 'Pending_Review' && expectedStatus === 'Pending Review') return true;
  return status === expectedStatus;
}

/**
 * Check if a value is a valid Checkout Status
 */
export function isCheckoutStatus(status: string, expectedStatus: CheckoutStatus): boolean {
  if (status === 'Checked_Out' && expectedStatus === 'Checked Out') return true;
  return status === expectedStatus;
}

/**
 * Convert database CAPA to frontend CAPA model
 */
export function convertDatabaseCAPAToModel(data: any): CAPA {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status: convertToCAPAStatus(data.status),
    priority: data.priority,
    createdAt: data.created_at || data.createdAt,
    createdBy: data.created_by || data.createdBy,
    dueDate: data.due_date || data.dueDate,
    assignedTo: data.assigned_to || data.assignedTo,
    source: data.source,
    completionDate: data.completion_date || data.completionDate,
    rootCause: data.root_cause || data.rootCause,
    correctiveAction: data.corrective_action || data.correctiveAction,
    preventiveAction: data.preventive_action || data.preventiveAction,
    effectivenessCriteria: data.effectiveness_criteria || data.effectivenessCriteria,
    effectivenessRating: convertToEffectivenessRating(data.effectiveness_rating || data.effectivenessRating),
    effectivenessVerified: data.effectiveness_verified || data.effectivenessVerified || false,
    verificationDate: data.verification_date || data.verificationDate,
    verificationMethod: data.verification_method || data.verificationMethod,
    verifiedBy: data.verified_by || data.verifiedBy,
    department: data.department,
    sourceId: data.source_id || data.sourceId,
    sourceReference: data.source_reference || data.sourceReference || '',
    fsma204Compliant: data.fsma204_compliant || data.fsma204Compliant || false,
    relatedDocuments: data.relatedDocuments || [],
    relatedTraining: data.relatedTraining || []
  };
}
