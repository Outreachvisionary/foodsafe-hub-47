
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

// Type guards for status comparisons
export const isCheckoutStatus = (value: string, status: CheckoutStatus): boolean => {
  if (!value) return false;
  return value.replace(/ /g, '_').toLowerCase() === status.toLowerCase();
};

export const isDocumentStatus = (value: string, status: DocumentStatus): boolean => {
  if (!value) return false;
  return value.replace(/ /g, '_').toLowerCase() === status.toLowerCase();
};

// Create a service to check CAPA status
export const isStatusEqual = (status: CAPAStatus | string, targetStatus: string): boolean => {
  if (!status) return false;
  const normalizedStatus = typeof status === 'string' ? 
    status.replace(/ /g, '_').toLowerCase() : 
    status.toLowerCase();
  
  const normalizedTargetStatus = targetStatus.replace(/ /g, '_').toLowerCase();
  
  return normalizedStatus === normalizedTargetStatus;
};
