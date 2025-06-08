
export const formatEnumValue = (value: string): string => {
  return value.replace(/_/g, ' ');
};

// Status comparison utilities
export const isStringStatusEqual = (status1: string, status2: string): boolean => {
  return status1.toLowerCase() === status2.toLowerCase();
};

export const isStatusEqual = (status1: any, status2: any): boolean => {
  return String(status1).toLowerCase() === String(status2).toLowerCase();
};

// CAPA Status conversions
export const stringToCAPAStatus = (status: string): any => {
  // This function should be implemented to convert string to CAPA status enum
  return status;
};

// Document related conversions
export const documentStatusToString = (status: any): string => {
  return String(status);
};

export const documentCategoryToString = (category: any): string => {
  return String(category);
};

export const checkoutStatusToString = (status: any): string => {
  return String(status);
};

export const stringToDocumentCategory = (category: string): any => {
  return category;
};

export const stringToDocumentStatus = (status: string): any => {
  return status;
};

export const stringToCheckoutStatus = (status: string): any => {
  return status;
};

// Training related conversions
export const trainingStatusToString = (status: any): string => {
  return String(status);
};

export const stringToTrainingStatus = (status: string): any => {
  return status;
};

// Non-conformance related conversions
export const stringToNCStatus = (status: string): any => {
  return status;
};

// Effectiveness rating conversions
export const effectivenessRatingToString = (rating: any): string => {
  return String(rating);
};
