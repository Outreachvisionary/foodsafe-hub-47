
import { DocumentStatus, Document, CheckoutStatus } from '@/types/document';

export function mapDbToAppDocStatus(dbStatus: string): DocumentStatus {
  // Map database status values to DocumentStatus enum values
  switch (dbStatus) {
    case 'Draft': return 'Draft';
    case 'In Review': return 'In_Review';
    case 'Pending Review': return 'Pending_Review';
    case 'Pending Approval': return 'Pending_Approval';
    case 'Approved': return 'Approved';
    case 'Published': return 'Published';
    case 'Archived': return 'Archived';
    case 'Rejected': return 'Rejected';
    case 'Obsolete': return 'Obsolete';
    case 'Active': return 'Active';
    case 'Expired': return 'Expired';
    default: return 'Draft';
  }
}

export function mapAppToDbDocStatus(appStatus: DocumentStatus): string {
  // Map DocumentStatus enum values to database status values
  switch (appStatus) {
    case 'Draft': return 'Draft';
    case 'In_Review': return 'In Review';
    case 'Pending_Review': return 'Pending Review';
    case 'Pending_Approval': return 'Pending Approval';
    case 'Approved': return 'Approved';
    case 'Published': return 'Published';
    case 'Archived': return 'Archived';
    case 'Rejected': return 'Rejected';
    case 'Obsolete': return 'Obsolete';
    case 'Active': return 'Active';
    case 'Expired': return 'Expired';
    default: return 'Draft';
  }
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
