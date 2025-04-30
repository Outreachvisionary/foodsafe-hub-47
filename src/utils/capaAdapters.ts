
import { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/enums';

/**
 * Converts a string value to a CAPAStatus enum value
 */
export const stringToCAPAStatus = (status: string): CAPAStatus => {
  // Normalize and match with enum
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  const enumValue = CAPAStatus[normalizedStatus as keyof typeof CAPAStatus];
  return enumValue || CAPAStatus.Open;
};

/**
 * Converts a string value to a CAPAPriority enum value
 */
export const stringToCAPAPriority = (priority: string): CAPAPriority => {
  // Normalize and match with enum
  const normalizedPriority = priority.replace(/ /g, '_').toUpperCase();
  const enumValue = CAPAPriority[normalizedPriority as keyof typeof CAPAPriority];
  return enumValue || CAPAPriority.Medium;
};

/**
 * Converts a string value to a CAPASource enum value
 */
export const stringToCAPASource = (source: string): CAPASource => {
  // Normalize and match with enum
  const normalizedSource = source.replace(/ /g, '_').toUpperCase();
  const enumValue = CAPASource[normalizedSource as keyof typeof CAPASource];
  return enumValue || CAPASource.Other;
};

/**
 * Converts CAPAStatus enum to a user-friendly display string
 */
export const capaStatusToDisplayString = (status: CAPAStatus): string => {
  return status.toString().replace(/_/g, ' ');
};

/**
 * Creates stub implementation for CAPA services
 */
export const getCAPAStats = async () => {
  // Stub implementation
  return {
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    byPriority: {},
    bySource: {},
    byDepartment: {},
    recentActivities: []
  };
};
