
import { CAPAStatus, CAPASource, CAPAPriority, EffectivenessRating, NCStatus, DocumentStatus, CheckoutStatus, ComplaintStatus, TrainingStatus, DocumentCategory } from '@/types/enums';

// Helper function to format enum values for display
export const formatEnumValue = (value: string): string => {
  return value.replace(/_/g, ' ');
};

// Helper function to convert database enum values to frontend enum values
export const stringToCAPAStatus = (status: string): CAPAStatus => {
  return status as CAPAStatus;
};

export const stringToCAPASource = (source: string): CAPASource => {
  return source as CAPASource;
};

export const stringToCAPAPriority = (priority: string): CAPAPriority => {
  return priority as CAPAPriority;
};

export const stringToEffectivenessRating = (rating: string): EffectivenessRating => {
  return rating as EffectivenessRating;
};

// Helper function to convert frontend enum values to database strings
export const capaStatusToString = (status: CAPAStatus): string => {
  return status;
};

export const capaSourceToString = (source: CAPASource): string => {
  return source;
};

export const capaPriorityToString = (priority: CAPAPriority): string => {
  return priority;
};

export const effectivenessRatingToString = (rating: EffectivenessRating): string => {
  return rating;
};

// Helper function to check if string status equals enum status
export const isStringStatusEqual = (stringStatus: string, enumStatus: CAPAStatus): boolean => {
  return stringStatus === enumStatus;
};

export const isStatusEqual = (status1: string, status2: NCStatus | DocumentStatus | CheckoutStatus | ComplaintStatus | TrainingStatus): boolean => {
  return status1 === status2;
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
