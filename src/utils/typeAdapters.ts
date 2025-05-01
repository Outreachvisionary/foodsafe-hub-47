import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import { CAPA } from '@/types/capa';

// Convert string to CAPAStatus enum
export const convertToCAPAStatus = (status: string): CAPAStatus => {
  const normalized = status.replace(/\s+/g, '_');
  
  switch (normalized.toUpperCase()) {
    case 'OPEN':
      return CAPAStatus.Open;
    case 'IN_PROGRESS':
      return CAPAStatus.InProgress;
    case 'COMPLETED':
      return CAPAStatus.Completed;
    case 'CLOSED':
      return CAPAStatus.Closed;
    case 'REJECTED':
      return CAPAStatus.Rejected;
    case 'ON_HOLD':
      return CAPAStatus.OnHold;
    case 'OVERDUE':
      return CAPAStatus.Overdue;
    case 'PENDING_VERIFICATION':
      return CAPAStatus.PendingVerification;
    case 'VERIFIED':
      return CAPAStatus.Verified;
    case 'UNDER_REVIEW':
      return CAPAStatus.UnderReview;
    default:
      return CAPAStatus.Open;
  }
};

// Convert string to CAPAPriority enum
export const stringToCAPAPriority = (priority: string): CAPAPriority => {
  const normalized = priority.trim().toLowerCase();
  
  switch (normalized) {
    case 'low':
      return CAPAPriority.Low;
    case 'medium':
      return CAPAPriority.Medium;
    case 'high':
      return CAPAPriority.High;
    case 'critical':
      return CAPAPriority.Critical;
    default:
      return CAPAPriority.Medium;
  }
};

// Convert string to CAPASource enum
export const stringToCAPASource = (source: string): CAPASource => {
  const normalized = source.replace(/\s+/g, '_').toUpperCase();
  
  switch (normalized) {
    case 'AUDIT':
      return CAPASource.Audit;
    case 'CUSTOMER_COMPLAINT':
      return CAPASource.CustomerComplaint;
    case 'INTERNAL_REPORT':
      return CAPASource.InternalReport;
    case 'NON_CONFORMANCE':
      return CAPASource.NonConformance;
    case 'REGULATORY_INSPECTION':
      return CAPASource.RegulatoryInspection;
    case 'SUPPLIER_ISSUE':
      return CAPASource.SupplierIssue;
    case 'OTHER':
      return CAPASource.Other;
    default:
      return CAPASource.Other;
  }
};

// Function to adapt CAPA data coming from various sources to the CAPA model
export const adaptCAPAToModel = (data: any): CAPA => {
  return {
    id: data.id,
    title: data.title || '',
    description: data.description || '',
    status: typeof data.status === 'string' ? convertToCAPAStatus(data.status) : data.status,
    priority: typeof data.priority === 'string' ? stringToCAPAPriority(data.priority) : data.priority,
    source: typeof data.source === 'string' ? stringToCAPASource(data.source) : data.source,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    created_by: data.created_by || '',
    due_date: data.due_date || '',
    assigned_to: data.assigned_to || '',
    source_reference: data.source_reference || data.source_id || '',
    root_cause: data.root_cause || null,
    corrective_action: data.corrective_action || null,
    preventive_action: data.preventive_action || null,
    effectiveness_criteria: data.effectiveness_criteria || null,
    relatedDocuments: data.relatedDocuments || [],
    relatedTraining: data.relatedTraining || []
  };
};

// Add more adapter functions for other types as needed

// Import missing function from complaintUtils.ts to avoid import errors
export { convertToComplaintStatus } from '@/utils/complaintUtils';

// Adapter for document database
export const adaptDocumentToDatabase = (document: any): any => {
  return {
    ...document,
    // Add any transformations needed for database storage
  };
};
