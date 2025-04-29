
import { DocumentStatus, CheckoutStatus, CAPAStatus, CAPAEffectivenessRating } from '@/types/enums';
import { Document } from '@/types/document';
import { CAPA } from '@/types/capa';

// Document adapters
export const convertToDocumentStatus = (status: string): DocumentStatus => {
  const normalizedStatus = status.replace(/ /g, '_');
  
  for (const enumValue of Object.values(DocumentStatus)) {
    if (enumValue.toLowerCase() === normalizedStatus.toLowerCase()) {
      return enumValue as DocumentStatus;
    }
  }
  
  return DocumentStatus.Draft; // Default fallback
};

export const convertToCheckoutStatus = (status: string): CheckoutStatus => {
  const normalizedStatus = status.replace(/ /g, '_');
  
  for (const enumValue of Object.values(CheckoutStatus)) {
    if (enumValue.toLowerCase() === normalizedStatus.toLowerCase()) {
      return enumValue as CheckoutStatus;
    }
  }
  
  return CheckoutStatus.Available; // Default fallback
};

// CAPA adapters
export const convertToCAPAStatus = (status: string): CAPAStatus => {
  if (!status) return CAPAStatus.Open; // Default value
  
  const normalizedStatus = status.replace(/ /g, '_');
  
  for (const enumValue of Object.values(CAPAStatus)) {
    if (enumValue.toLowerCase() === normalizedStatus.toLowerCase()) {
      return enumValue as CAPAStatus;
    }
  }
  
  return CAPAStatus.Open; // Default fallback
};

export const convertToEffectivenessRating = (rating?: string): CAPAEffectivenessRating | undefined => {
  if (!rating) return undefined;
  
  const normalizedRating = rating.replace(/ /g, '_');
  
  for (const enumValue of Object.values(CAPAEffectivenessRating)) {
    if (enumValue.toLowerCase() === normalizedRating.toLowerCase()) {
      return enumValue as CAPAEffectivenessRating;
    }
  }
  
  return undefined;
};

// Document object adapter
export const adaptDocumentToModel = (doc: any): Document => {
  return {
    ...doc,
    status: convertToDocumentStatus(doc.status || 'Draft'),
    checkout_status: convertToCheckoutStatus(doc.checkout_status || 'Available')
  };
};

// CAPA object adapter
export const adaptCAPAToModel = (capa: any): CAPA => {
  return {
    ...capa,
    status: convertToCAPAStatus(capa.status || 'Open'),
    effectiveness_rating: convertToEffectivenessRating(capa.effectiveness_rating)
  };
};

// Convert database CAPA object to CAPA type
export const convertDatabaseCAPAToModel = (dbCapa: any): CAPA => {
  return {
    id: dbCapa.id,
    title: dbCapa.title,
    description: dbCapa.description,
    status: convertToCAPAStatus(dbCapa.status),
    priority: dbCapa.priority,
    created_at: dbCapa.created_at,
    created_by: dbCapa.created_by,
    due_date: dbCapa.due_date,
    assigned_to: dbCapa.assigned_to,
    source: dbCapa.source,
    source_id: dbCapa.source_id,
    source_reference: dbCapa.source_reference,
    completion_date: dbCapa.completion_date,
    root_cause: dbCapa.root_cause,
    corrective_action: dbCapa.corrective_action,
    preventive_action: dbCapa.preventive_action,
    effectiveness_criteria: dbCapa.effectiveness_criteria,
    effectiveness_rating: convertToEffectivenessRating(dbCapa.effectiveness_rating),
    effectiveness_verified: dbCapa.effectiveness_verified,
    verification_date: dbCapa.verification_date,
    verification_method: dbCapa.verification_method,
    verified_by: dbCapa.verified_by,
    department: dbCapa.department,
    fsma204_compliant: dbCapa.fsma204_compliant,
    relatedDocuments: dbCapa.relatedDocuments || [],
    relatedTraining: dbCapa.relatedTraining || []
  };
};

// Type guards for status comparisons
export const isCheckoutStatus = (value: string, status: CheckoutStatus): boolean => {
  if (!value) return false;
  return value.replace(/ /g, '_').toLowerCase() === status.toLowerCase();
};

export const isDocumentStatus = (value: string, status: DocumentStatus): boolean => {
  if (!value) return false;
  return value.replace(/ /g, '_').toLowerCase() === status.toLowerCase();
};
