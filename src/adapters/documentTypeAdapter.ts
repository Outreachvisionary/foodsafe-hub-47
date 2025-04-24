
/**
 * Document Type Adapter
 * 
 * This utility handles mapping between different document status formats
 * to ensure type compatibility across the application
 */

// Export enums for document statuses
export enum CheckoutStatus {
  Available = "Available",
  CheckedOut = "Checked Out"
}

export enum DocumentStatus {
  Draft = "Draft",
  PendingApproval = "Pending Approval",
  Approved = "Approved",
  Rejected = "Rejected",
  Archived = "Archived",
  Expired = "Expired",
  UnderReview = "Under Review"
}

/**
 * Maps string checkout status to enum value
 */
export const mapCheckoutStatus = (status: string | null | undefined): CheckoutStatus => {
  if (!status) return CheckoutStatus.Available;
  
  // Handle different status formats
  if (status === "Checked_Out" || status === "Checked Out") {
    return CheckoutStatus.CheckedOut;
  }
  
  return CheckoutStatus.Available;
};

/**
 * Maps enum checkout status to string value
 */
export const mapCheckoutStatusToString = (status: CheckoutStatus): string => {
  return status === CheckoutStatus.CheckedOut ? "Checked Out" : "Available";
};

/**
 * Maps string document status to enum value
 */
export const mapDocumentStatus = (status: string | null | undefined): DocumentStatus => {
  if (!status) return DocumentStatus.Draft;
  
  // Handle different status formats
  switch (status) {
    case "Pending_Approval":
    case "Pending Approval":
      return DocumentStatus.PendingApproval;
    case "Under_Review":
    case "Under Review":
      return DocumentStatus.UnderReview;
    case "Approved":
      return DocumentStatus.Approved;
    case "Rejected":
      return DocumentStatus.Rejected;
    case "Archived":
      return DocumentStatus.Archived;
    case "Expired":
      return DocumentStatus.Expired;
    default:
      return DocumentStatus.Draft;
  }
};

/**
 * Maps enum document status to string value
 */
export const mapDocumentStatusToString = (status: DocumentStatus): string => {
  switch (status) {
    case DocumentStatus.PendingApproval:
      return "Pending Approval";
    case DocumentStatus.UnderReview:
      return "Under Review";
    case DocumentStatus.Approved:
      return "Approved";
    case DocumentStatus.Rejected:
      return "Rejected";
    case DocumentStatus.Archived:
      return "Archived";
    case DocumentStatus.Expired:
      return "Expired";
    default:
      return "Draft";
  }
};

/**
 * Helper to ensure document objects have proper status types
 */
export const adaptDocument = (document: any) => {
  return {
    ...document,
    checkout_status: mapCheckoutStatus(document.checkout_status),
    document_status: mapDocumentStatus(document.document_status)
  };
};

/**
 * Helper to convert document back to API format
 */
export const adaptDocumentForApi = (document: any) => {
  return {
    ...document,
    checkout_status: document.checkout_status === CheckoutStatus.CheckedOut ? "Checked Out" : "Available",
    document_status: mapDocumentStatusToString(document.document_status)
  };
};

export default {
  mapCheckoutStatus,
  mapCheckoutStatusToString,
  mapDocumentStatus,
  mapDocumentStatusToString,
  adaptDocument,
  adaptDocumentForApi
};
