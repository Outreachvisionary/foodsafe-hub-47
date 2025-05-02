
import { DocumentStatus } from '@/types/enums';

export const adaptDocumentToDatabase = (document: any) => {
  return {
    ...document,
    // Map string statuses to DocumentStatus enum values
    status: document.status === "Pending_Review" ? DocumentStatus.PendingReview : 
            document.status === "Pending_Approval" ? DocumentStatus.PendingApproval : document.status
  };
};

export const compareDocumentStatus = (status: string | DocumentStatus, compareWith: string): boolean => {
  if (typeof status === 'string') {
    // Normalize string statuses for comparison
    const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
    const normalizedCompare = compareWith.replace(/ /g, '_').toUpperCase();
    return normalizedStatus === normalizedCompare;
  }
  
  const statusString = String(status);
  const normalizedCompare = compareWith.replace(/ /g, '_').toUpperCase();
  
  return statusString === normalizedCompare;
};
