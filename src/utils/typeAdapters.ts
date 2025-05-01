
import { DocumentStatus, CheckoutStatus, CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating, ComplaintStatus, ComplaintCategory, ComplaintPriority } from '@/types/enums';

// Document status utilities
export const isStatusEqual = (status: any, targetStatus: DocumentStatus): boolean => {
  if (!status) return false;
  
  if (typeof status === 'string') {
    const normalizedStatus = status.replace(/_/g, ' ').toLowerCase();
    const normalizedTarget = targetStatus.toString().replace(/_/g, ' ').toLowerCase();
    return normalizedStatus === normalizedTarget;
  }
  
  return status === targetStatus;
};

// Alias for backward compatibility
export const isStringStatusEqual = isStatusEqual;

export const documentStatusToString = (status: DocumentStatus): string => {
  return status.toString().replace(/_/g, ' ');
};

export const stringToDocumentStatus = (statusString: string): DocumentStatus => {
  const statusKey = statusString.replace(/ /g, '_').toUpperCase();
  return DocumentStatus[statusKey as keyof typeof DocumentStatus] || DocumentStatus.Draft;
};

// CAPA status utilities
export const convertToCAPAStatus = (statusString: string): CAPAStatus => {
  const statusKey = statusString.replace(/ /g, '_').toUpperCase();
  // Try to get the enum value or default to Open
  return Object.values(CAPAStatus).find(
    s => s === statusKey || s === statusString
  ) || CAPAStatus.Open;
};

export const convertToCAPAPriority = (priorityString: string): CAPAPriority => {
  const priorityKey = priorityString.toUpperCase();
  return Object.values(CAPAPriority).find(
    p => p === priorityKey || p === priorityString
  ) || CAPAPriority.Medium;
};

export const convertToCAPASource = (sourceString: string): CAPASource => {
  const sourceKey = sourceString.replace(/ /g, '_').toUpperCase();
  return Object.values(CAPASource).find(
    s => s === sourceKey || s === sourceString
  ) || CAPASource.Other;
};

export const formatEnumValue = (value: string): string => {
  return value.replace(/_/g, ' ');
};

// Checkout status utilities
export const checkoutStatusToString = (status: CheckoutStatus): string => {
  return status.toString().replace(/_/g, ' ');
};

export const stringToCheckoutStatus = (statusString: string): CheckoutStatus => {
  const statusKey = statusString.replace(/ /g, '_').toUpperCase();
  return CheckoutStatus[statusKey as keyof typeof CheckoutStatus] || CheckoutStatus.Available;
};

// Complaint status utilities
export const formatComplaintStatus = (status: ComplaintStatus): string => {
  return status.toString().replace(/_/g, ' ');
};

export const stringToComplaintStatus = (statusString: string): ComplaintStatus => {
  const statusKey = statusString.replace(/ /g, '_').toUpperCase();
  return ComplaintStatus[statusKey as keyof typeof ComplaintStatus] || ComplaintStatus.New;
};

export const stringToComplaintCategory = (categoryString: string): ComplaintCategory => {
  const categoryKey = categoryString.replace(/ /g, '_').toUpperCase();
  return ComplaintCategory[categoryKey as keyof typeof ComplaintCategory] || ComplaintCategory.Other;
};

// Utility for converting enum values to display format
export const enumToDisplayText = (enumValue: string): string => {
  return enumValue.replace(/_/g, ' ');
};

// Utility for standardizing object keys to match Supabase snake_case format
export const toSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    result[snakeKey] = obj[key];
  });
  
  return result;
};

// Utility for standardizing object keys to match TypeScript camelCase format
export const toCamelCase = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = obj[key];
  });
  
  return result;
};
