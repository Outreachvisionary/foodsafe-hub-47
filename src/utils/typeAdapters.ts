
import { CAPAStatus, CAPASource, CAPAPriority, EffectivenessRating, NCStatus, DocumentStatus, CheckoutStatus, ComplaintStatus, TrainingStatus, DocumentCategory, ComplaintCategory } from '@/types/enums';

// Helper function to format enum values for display
export const formatEnumValue = (value: string): string => {
  return value.replace(/_/g, ' ');
};

// CAPA Status helpers
export const stringToCAPAStatus = (status: string): CAPAStatus => {
  return status as CAPAStatus;
};

export const convertToCAPAStatus = (status: string): CAPAStatus => {
  return status as CAPAStatus;
};

export const capaStatusToString = (status: CAPAStatus): string => {
  return status;
};

// CAPA Source helpers
export const stringToCAPASource = (source: string): CAPASource => {
  return source as CAPASource;
};

export const capaSourceToString = (source: CAPASource): string => {
  return source;
};

// CAPA Priority helpers
export const stringToCAPAPriority = (priority: string): CAPAPriority => {
  return priority as CAPAPriority;
};

export const capaPriorityToString = (priority: CAPAPriority): string => {
  return priority;
};

// Effectiveness Rating helpers
export const stringToEffectivenessRating = (rating: string): EffectivenessRating => {
  return rating as EffectivenessRating;
};

export const effectivenessRatingToString = (rating: EffectivenessRating): string => {
  return rating;
};

// NC Status helpers
export const stringToNCStatus = (status: string): NCStatus => {
  return status as NCStatus;
};

export const ncStatusToString = (status: NCStatus): string => {
  return status;
};

// Document Status helpers
export const stringToDocumentStatus = (status: string): DocumentStatus => {
  return status as DocumentStatus;
};

export const documentStatusToString = (status: DocumentStatus): string => {
  return status;
};

// Document Category helpers
export const stringToDocumentCategory = (category: string): DocumentCategory => {
  return category as DocumentCategory;
};

export const documentCategoryToString = (category: DocumentCategory): string => {
  return category;
};

// Checkout Status helpers
export const stringToCheckoutStatus = (status: string): CheckoutStatus => {
  return status as CheckoutStatus;
};

export const checkoutStatusToString = (status: CheckoutStatus): string => {
  return status;
};

// Training Status helpers
export const stringToTrainingStatus = (status: string): TrainingStatus => {
  return status as TrainingStatus;
};

export const trainingStatusToString = (status: TrainingStatus): string => {
  return status;
};

// Complaint Status helpers
export const stringToComplaintStatus = (status: string): ComplaintStatus => {
  return status as ComplaintStatus;
};

export const complaintStatusToString = (status: ComplaintStatus): string => {
  return status;
};

// Complaint Category helpers
export const stringToComplaintCategory = (category: string): ComplaintCategory => {
  return category as ComplaintCategory;
};

export const complaintCategoryToString = (category: ComplaintCategory): string => {
  return category;
};

// Helper function to check if string status equals enum status
export const isStringStatusEqual = (stringStatus: string, enumStatus: CAPAStatus): boolean => {
  return stringStatus === enumStatus;
};

export const isStatusEqual = (status1: string, status2: NCStatus | DocumentStatus | CheckoutStatus | ComplaintStatus | TrainingStatus): boolean => {
  return status1 === status2;
};
