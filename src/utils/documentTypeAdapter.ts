
import { DocumentStatus, Document, CheckoutStatus } from '@/types/document';

export function mapDbToAppDocStatus(dbStatus: string): DocumentStatus {
  // Map database status values to DocumentStatus enum values
  const statusMap: Record<string, DocumentStatus> = {
    'Draft': 'Draft',
    'In Review': 'In_Review',
    'Pending Review': 'Pending_Review',
    'Pending Approval': 'Pending_Approval',
    'Approved': 'Approved',
    'Published': 'Published',
    'Archived': 'Archived',
    'Rejected': 'Rejected',
    'Obsolete': 'Obsolete',
    'Active': 'Active',
    'Expired': 'Expired'
  };

  return statusMap[dbStatus] || 'Draft';
}

export function mapAppToDbDocStatus(appStatus: DocumentStatus): string {
  // Map DocumentStatus enum values to database status values
  const statusMap: Record<DocumentStatus, string> = {
    'Draft': 'Draft',
    'In_Review': 'In Review',
    'Pending_Review': 'Pending Review',
    'Pending_Approval': 'Pending Approval',
    'Approved': 'Approved',
    'Published': 'Published',
    'Archived': 'Archived',
    'Rejected': 'Rejected',
    'Obsolete': 'Obsolete',
    'Active': 'Active',
    'Expired': 'Expired'
  };

  return statusMap[appStatus] || 'Draft';
}

export function mapDbToAppCheckoutStatus(dbStatus: string): CheckoutStatus {
  return dbStatus === 'Checked Out' ? 'Checked_Out' : 'Available';
}

export function mapAppToDbCheckoutStatus(appStatus: CheckoutStatus): string {
  return appStatus === 'Checked_Out' ? 'Checked Out' : 'Available';
}

export function adaptDocumentToDatabase(document: Partial<Document>): Record<string, any> {
  const dbDocument: Record<string, any> = { ...document };
  
  // Convert status values if they exist
  if (document.status) {
    dbDocument.status = mapAppToDbDocStatus(document.status);
  }
  
  // Convert checkout status if it exists
  if (document.checkout_status) {
    dbDocument.checkout_status = mapAppToDbCheckoutStatus(document.checkout_status);
  }
  
  return dbDocument;
}

export function adaptDatabaseToDocument(dbDocument: Record<string, any>): Document {
  return {
    ...dbDocument,
    status: mapDbToAppDocStatus(dbDocument.status),
    checkout_status: mapDbToAppCheckoutStatus(dbDocument.checkout_status)
  } as Document;
}

export function mapToDocumentActionType(action: string): string {
  return action.toLowerCase();
}
