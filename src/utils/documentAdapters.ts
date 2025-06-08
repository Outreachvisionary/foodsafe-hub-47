
import { DocumentStatus, CheckoutStatus } from '@/types/enums';

/**
 * Maps string document status to enum value
 */
export const stringToDocumentStatus = (status: string | null | undefined): DocumentStatus => {
  if (!status) return DocumentStatus.Draft;
  
  // Handle different status formats
  switch (status) {
    case "Pending_Approval":
    case "Pending Approval":
      return DocumentStatus.PendingApproval;
    case "Under_Review":
    case "Under Review":
    case "In Review":
      return DocumentStatus.UnderReview;
    case "Pending_Review":
    case "Pending Review":
      return DocumentStatus.PendingReview;
    case "Approved":
      return DocumentStatus.Approved;
    case "Rejected":
      return DocumentStatus.Rejected;
    case "Archived":
      return DocumentStatus.Archived;
    case "Expired":
      return DocumentStatus.Expired;
    case "Published":
      return DocumentStatus.Published;
    case "Active":
      return DocumentStatus.Active;
    case "Obsolete":
      return DocumentStatus.Obsolete;
    default:
      return DocumentStatus.Draft;
  }
};

/**
 * Maps enum document status to string value
 */
export const documentStatusToString = (status: DocumentStatus): string => {
  switch (status) {
    case DocumentStatus.PendingApproval:
      return "Pending Approval";
    case DocumentStatus.UnderReview:
      return "Under Review";
    case DocumentStatus.PendingReview:
      return "Pending Review";
    case DocumentStatus.Approved:
      return "Approved";
    case DocumentStatus.Rejected:
      return "Rejected";
    case DocumentStatus.Archived:
      return "Archived";
    case DocumentStatus.Expired:
      return "Expired";
    case DocumentStatus.Published:
      return "Published";
    case DocumentStatus.Active:
      return "Active";
    case DocumentStatus.Obsolete:
      return "Obsolete";
    default:
      return "Draft";
  }
};

/**
 * Maps string checkout status to enum value
 */
export const stringToCheckoutStatus = (status: string | null | undefined): CheckoutStatus => {
  if (!status) return CheckoutStatus.Available;
  
  // Handle different status formats
  if (status === "Checked_Out" || status === "Checked Out") {
    return CheckoutStatus.CheckedOut;
  }
  
  if (status === "Locked") {
    return CheckoutStatus.Locked;
  }
  
  return CheckoutStatus.Available;
};

/**
 * Maps enum checkout status to string value
 */
export const checkoutStatusToString = (status: CheckoutStatus): string => {
  switch (status) {
    case CheckoutStatus.CheckedOut:
      return "Checked Out";
    case CheckoutStatus.Locked:
      return "Locked";
    default:
      return "Available";
  }
};
