
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
    effectivenessRating: convertToEffectivenessRating(capa.effectiveness_rating)
  };
};
