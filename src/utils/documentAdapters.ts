
// Simple string-based adapter functions to match database schema

// Document Category conversions
export const documentCategoryToDbString = (category: string): string => {
  return category || 'Other';
};

export const stringToDocumentCategory = (category: string | null | undefined): string => {
  return category || 'Other';
};

// Document Status conversions
export const documentStatusToDbString = (status: string): string => {
  return status || 'Draft';
};

export const stringToDocumentStatus = (status: string | null | undefined): string => {
  return status || 'Draft';
};

// Checkout Status conversions
export const checkoutStatusToDbString = (status: string): string => {
  return status || 'Available';
};

export const stringToCheckoutStatus = (status: string | null | undefined): string => {
  return status || 'Available';
};
