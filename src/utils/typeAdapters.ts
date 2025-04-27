
import { DocumentStatus, CheckoutStatus } from '@/types/document';
import { CAPAStatus } from '@/types/capa';

export const isDocumentStatus = (status: string, compareStatus: DocumentStatus): boolean => {
  return status === compareStatus;
}

export const isCheckoutStatus = (status: string | undefined, compareStatus: CheckoutStatus): boolean => {
  return status === compareStatus;
}

export const convertToCAPAStatus = (status: string): CAPAStatus => {
  if (!Object.values(CAPAStatus).includes(status as CAPAStatus)) {
    return 'Open'; // Default status
  }
  return status as CAPAStatus;
}

export const convertToDocumentStatus = (status: string): DocumentStatus => {
  if (!Object.values(DocumentStatus).includes(status as DocumentStatus)) {
    return 'Draft'; // Default status
  }
  return status as DocumentStatus;
}

export const convertToCheckoutStatus = (status: string | undefined): CheckoutStatus => {
  return (status as CheckoutStatus) === 'Checked_Out' ? 'Checked_Out' : 'Available';
}

export const adaptDatabaseToDocument = (dbDocument: any): Document => {
  return {
    ...dbDocument,
    status: convertToDocumentStatus(dbDocument.status),
    checkout_status: convertToCheckoutStatus(dbDocument.checkout_status || 'Available')
  };
}

export const adaptDocumentToDatabase = (document: Partial<Document>): any => {
  return {
    ...document,
    category: document.category || 'Other',
    status: document.status || 'Draft',
    checkout_status: document.checkout_status || 'Available'
  };
}
