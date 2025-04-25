
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
  
  return appStatus;
}
