
import { DocumentStatus, CheckoutStatus, ComplaintStatus, ComplaintCategory, ComplaintPriority, TrainingStatus, CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/enums';

/**
 * Format enum values for display by replacing underscores with spaces
 */
export const formatEnumValue = (value: string): string => {
  return value.replace(/_/g, ' ');
};

/**
 * Check if two status values are equivalent, handling different formats
 */
export const isStringStatusEqual = (status: string | undefined, targetStatus: string | undefined): boolean => {
  if (!status || !targetStatus) return false;
  
  // Normalize both status strings to lowercase without underscores
  const normalizeStatus = (s: string): string => {
    return s.replace(/_/g, ' ').toLowerCase();
  };
  
  const normalizedStatus = normalizeStatus(status);
  const normalizedTarget = normalizeStatus(targetStatus);
  
  return normalizedStatus === normalizedTarget;
};

/**
 * Convert DocumentStatus enum value to string
 */
export const documentStatusToString = (status: DocumentStatus): string => {
  return status.toString();
};

/**
 * Convert string to DocumentStatus enum
 */
export const stringToDocumentStatus = (status: string): DocumentStatus => {
  // Try direct match first
  if (Object.values(DocumentStatus).includes(status as DocumentStatus)) {
    return status as DocumentStatus;
  }
  
  // Handle cases where string might have spaces instead of underscores
  const formattedStatus = status.replace(/ /g, '_');
  if (Object.values(DocumentStatus).includes(formattedStatus as DocumentStatus)) {
    return formattedStatus as DocumentStatus;
  }
  
  // Default fallback
  console.warn(`Unknown document status: ${status}, defaulting to Draft`);
  return DocumentStatus.Draft;
};

/**
 * Convert CheckoutStatus enum value to string
 */
export const checkoutStatusToString = (status: CheckoutStatus): string => {
  return status.toString();
};

/**
 * Convert string to CheckoutStatus enum
 */
export const stringToCheckoutStatus = (status: string): CheckoutStatus => {
  // Try direct match first
  if (Object.values(CheckoutStatus).includes(status as CheckoutStatus)) {
    return status as CheckoutStatus;
  }
  
  // Handle cases where string might have spaces instead of underscores
  const formattedStatus = status.replace(/ /g, '_');
  if (Object.values(CheckoutStatus).includes(formattedStatus as CheckoutStatus)) {
    return formattedStatus as CheckoutStatus;
  }
  
  // Default fallback
  console.warn(`Unknown checkout status: ${status}, defaulting to Available`);
  return CheckoutStatus.Available;
};

/**
 * Convert TrainingStatus enum value to string
 */
export const trainingStatusToString = (status: TrainingStatus): string => {
  return status.toString();
};

/**
 * Convert string to TrainingStatus enum
 */
export const stringToTrainingStatus = (status: string): TrainingStatus => {
  // Try direct match first
  if (Object.values(TrainingStatus).includes(status as TrainingStatus)) {
    return status as TrainingStatus;
  }
  
  // Handle cases where string might have spaces instead of underscores
  const formattedStatus = status.replace(/ /g, '_');
  if (Object.values(TrainingStatus).includes(formattedStatus as TrainingStatus)) {
    return formattedStatus as TrainingStatus;
  }
  
  // Default fallback
  console.warn(`Unknown training status: ${status}, defaulting to NotStarted`);
  return TrainingStatus.NotStarted;
};

/**
 * Convert ComplaintStatus enum value to string
 */
export const complaintStatusToString = (status: ComplaintStatus): string => {
  return status.toString();
};

/**
 * Convert string to ComplaintStatus enum
 */
export const stringToComplaintStatus = (status: string): ComplaintStatus => {
  // Try direct match first
  if (Object.values(ComplaintStatus).includes(status as ComplaintStatus)) {
    return status as ComplaintStatus;
  }
  
  // Handle cases where string might have spaces instead of underscores
  const formattedStatus = status.replace(/ /g, '_');
  if (Object.values(ComplaintStatus).includes(formattedStatus as ComplaintStatus)) {
    return formattedStatus as ComplaintStatus;
  }
  
  // Default fallback
  console.warn(`Unknown complaint status: ${status}, defaulting to New`);
  return ComplaintStatus.New;
};

/**
 * Convert ComplaintCategory enum value to string
 */
export const complaintCategoryToString = (category: ComplaintCategory): string => {
  return category.toString();
};

/**
 * Convert string to ComplaintCategory enum
 */
export const stringToComplaintCategory = (category: string): ComplaintCategory => {
  // Try direct match first
  if (Object.values(ComplaintCategory).includes(category as ComplaintCategory)) {
    return category as ComplaintCategory;
  }
  
  // Handle cases where string might have spaces instead of underscores
  const formattedCategory = category.replace(/ /g, '_');
  if (Object.values(ComplaintCategory).includes(formattedCategory as ComplaintCategory)) {
    return formattedCategory as ComplaintCategory;
  }
  
  // Default fallback
  console.warn(`Unknown complaint category: ${category}, defaulting to ProductQuality`);
  return ComplaintCategory.ProductQuality;
};

/**
 * Convert ComplaintPriority enum value to string
 */
export const complaintPriorityToString = (priority: ComplaintPriority): string => {
  return priority.toString();
};

/**
 * Convert string to ComplaintPriority enum
 */
export const stringToComplaintPriority = (priority: string): ComplaintPriority => {
  // Try direct match first
  if (Object.values(ComplaintPriority).includes(priority as ComplaintPriority)) {
    return priority as ComplaintPriority;
  }
  
  // Handle cases where string might have spaces instead of underscores
  const formattedPriority = priority.replace(/ /g, '_');
  if (Object.values(ComplaintPriority).includes(formattedPriority as ComplaintPriority)) {
    return formattedPriority as ComplaintPriority;
  }
  
  // Default fallback
  console.warn(`Unknown complaint priority: ${priority}, defaulting to Medium`);
  return ComplaintPriority.Medium;
};

/**
 * Convert CAPAStatus enum value to string
 */
export const capaStatusToString = (status: CAPAStatus): string => {
  return status.toString();
};

/**
 * Convert string to CAPAStatus enum
 */
export const stringToCAPAStatus = (status: string): CAPAStatus => {
  // Try direct match first
  if (Object.values(CAPAStatus).includes(status as CAPAStatus)) {
    return status as CAPAStatus;
  }
  
  // Handle cases where string might have spaces instead of underscores
  const formattedStatus = status.replace(/ /g, '_');
  if (Object.values(CAPAStatus).includes(formattedStatus as CAPAStatus)) {
    return formattedStatus as CAPAStatus;
  }
  
  // Default fallback
  console.warn(`Unknown CAPA status: ${status}, defaulting to Open`);
  return CAPAStatus.Open;
};

/**
 * Checks if a document status is equal to a target status
 */
export const isStatusEqual = (status: any, targetStatus: any): boolean => {
  if (!status || !targetStatus) return false;
  
  // Handle enum-style status with underscores
  if (typeof status === 'string' && typeof targetStatus === 'string') {
    const normalizedStatus = status.replace(/_/g, ' ').toLowerCase();
    const normalizedTarget = targetStatus.toString().replace(/_/g, ' ').toLowerCase();
    return normalizedStatus === normalizedTarget;
  }
  
  return status === targetStatus;
};
