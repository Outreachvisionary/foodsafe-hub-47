
import { CAPAStatus, CAPASource, CAPAPriority, EffectivenessRating } from '@/types/enums';

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
