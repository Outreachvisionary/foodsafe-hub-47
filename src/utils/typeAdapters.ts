
import { 
  DocumentStatus, 
  CheckoutStatus, 
  DocumentPermission 
} from '@/types/document';
import { CAPAStatus, CAPAEffectivenessRating, CAPA } from '@/types/capa';
import { 
  TrainingStatus, 
  TrainingCategory, 
  TrainingType,
  TrainingPriority
} from '@/types/training';

// Document Status
export function convertToDocumentStatus(status: string): DocumentStatus {
  switch (status) {
    case 'Draft': return 'Draft';
    case 'Pending_Review': return 'Pending_Review';
    case 'Approved': return 'Approved';
    case 'Published': return 'Published';
    case 'Archived': return 'Archived';
    case 'Rejected': return 'Rejected';
    default: return 'Draft';
  }
}

export function isDocumentStatus(status: string): status is DocumentStatus {
  return ['Draft', 'Pending_Review', 'Approved', 'Published', 'Archived', 'Rejected'].includes(status);
}

// Improved isDocumentStatus to take the second parameter as optional
export function isDocumentStatus(status: string, targetStatus?: string): boolean {
  if (targetStatus) {
    return status === targetStatus;
  }
  return ['Draft', 'Pending_Review', 'Approved', 'Published', 'Archived', 'Rejected'].includes(status);
}

// Checkout Status
export function convertToCheckoutStatus(status: string): CheckoutStatus {
  switch (status) {
    case 'Available': return 'Available';
    case 'Checked_Out': return 'Checked Out';
    default: return 'Available';
  }
}

export function isCheckoutStatus(status: string): status is CheckoutStatus {
  return ['Available', 'Checked Out'].includes(status);
}

// Document Permission
export function convertToDocumentPermission(permission: string): DocumentPermission {
  switch (permission) {
    case 'View': return 'View';
    case 'Comment': return 'Comment';
    case 'Edit': return 'Edit';
    case 'Approve': return 'Approve';
    case 'Full_Control': return 'Full_Control';
    default: return 'View';
  }
}

// CAPA Status
export function convertToCAPAStatus(status: string): CAPAStatus {
  switch (status) {
    case 'Open': return 'Open';
    case 'In_Progress': return 'In_Progress';
    case 'Closed': return 'Closed';
    case 'Overdue': return 'Overdue';
    case 'Pending_Verification': return 'Pending_Verification';
    case 'Verified': return 'Verified';
    default: return 'Open';
  }
}

// CAPA Status comparator - this fixes the isStatusEqual function to accept 1 or 2 arguments
export function isStatusEqual(status1: string, status2?: string): boolean {
  if (status2) {
    return status1.replace(/_/g, ' ') === status2.replace(/_/g, ' ');
  }
  return false;
}

// CAPA Effectiveness Rating
export function convertToEffectivenessRating(rating: string): CAPAEffectivenessRating {
  switch (rating) {
    case 'Effective': return 'Effective';
    case 'Partially_Effective': return 'Partially_Effective';
    case 'Not_Effective': return 'Not_Effective';
    case 'Not_Verified': return 'Not_Verified';
    default: return 'Not_Verified';
  }
}

// Convert database CAPA to model
export function convertDatabaseCAPAToModel(dbCapa: any): CAPA {
  return {
    id: dbCapa.id,
    title: dbCapa.title,
    description: dbCapa.description,
    status: convertToCAPAStatus(dbCapa.status),
    priority: dbCapa.priority,
    createdAt: dbCapa.created_at,
    createdBy: dbCapa.created_by,
    dueDate: dbCapa.due_date,
    assignedTo: dbCapa.assigned_to,
    source: dbCapa.source,
    sourceId: dbCapa.source_id,
    sourceReference: dbCapa.source_reference || '',
    completionDate: dbCapa.completion_date,
    rootCause: dbCapa.root_cause,
    correctiveAction: dbCapa.corrective_action,
    preventiveAction: dbCapa.preventive_action,
    effectivenessCriteria: dbCapa.effectiveness_criteria,
    effectivenessRating: dbCapa.effectiveness_rating,
    effectivenessVerified: dbCapa.effectiveness_verified,
    verificationDate: dbCapa.verification_date,
    verificationMethod: dbCapa.verification_method,
    verifiedBy: dbCapa.verified_by,
    department: dbCapa.department,
    fsma204Compliant: dbCapa.fsma204_compliant,
    relatedDocuments: dbCapa.related_documents || [],
    relatedTraining: dbCapa.related_training || []
  };
}

// Training Status
export function convertToTrainingStatus(status: string): TrainingStatus {
  switch (status) {
    case 'Not Started': return 'Not Started';
    case 'In Progress': return 'In Progress';
    case 'Completed': return 'Completed';
    case 'Overdue': return 'Overdue';
    case 'Failed': return 'Failed';
    case 'Cancelled': return 'Cancelled';
    default: return 'Not Started';
  }
}

// Convert Training Status to database format
export function convertTrainingStatusForDb(status: TrainingStatus): string {
  return status;
}

// Training Category
export function convertToTrainingCategory(category: string): TrainingCategory {
  switch (category) {
    case 'haccp': return 'haccp';
    case 'gmp': return 'gmp';
    case 'food-safety': return 'food-safety';
    case 'regulatory': return 'regulatory';
    case 'quality-control': return 'quality-control';
    case 'equipment': return 'equipment';
    case 'allergen-management': return 'allergen-management';
    case 'sanitation': return 'sanitation';
    case 'workplace-safety': return 'workplace-safety';
    case 'other': return 'other';
    default: return 'other';
  }
}

// Training Type
export function convertToTrainingType(type: string): TrainingType {
  switch (type) {
    case 'classroom': return 'classroom';
    case 'online': return 'online';
    case 'on-job': return 'on-job';
    case 'self-study': return 'self-study';
    default: return 'classroom';
  }
}

// Training Priority
export function convertToTrainingPriority(priority: string): TrainingPriority {
  switch (priority) {
    case 'Low': return 'Low';
    case 'Medium': return 'Medium';
    case 'High': return 'High';
    case 'Critical': return 'Critical';
    default: return 'Medium';
  }
}
