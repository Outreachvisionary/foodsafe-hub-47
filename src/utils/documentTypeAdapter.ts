
import { Document, CheckoutStatus } from '@/types/document';

export function adaptDocumentToDatabase(document: Partial<Document>): Record<string, any> {
  return {
    ...document,
    checkout_status: mapAppToDbCheckoutStatus(document.checkout_status)
  };
}

export function mapToDocumentActionType(action: string): string {
  return action;
}

export function mapDbToAppCheckoutStatus(dbStatus?: string): CheckoutStatus | undefined {
  if (!dbStatus) return undefined;
  
  if (dbStatus === 'Checked Out' || dbStatus === 'Checked_Out') {
    return 'Checked Out';
  }
  return 'Available';
}

export function mapAppToDbCheckoutStatus(appStatus?: CheckoutStatus): string | undefined {
  if (!appStatus) return undefined;
  
  if (appStatus === 'Checked Out') {
    return 'Checked_Out';
  }
  return appStatus;
}

// Helper function to convert between document status formats
export function normalizeDocumentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'Published': 'Active',
    'Active': 'Active',
    'Pending Review': 'Pending Review',
    'Pending Approval': 'Pending Approval',
    'Approved': 'Approved',
    'Archived': 'Archived',
    'Expired': 'Expired',
    'Rejected': 'Rejected',
    'In Review': 'In Review',
    'Draft': 'Draft'
  };
  
  return statusMap[status] || status;
}
