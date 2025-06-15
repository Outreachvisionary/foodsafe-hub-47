
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';

export const formatEnumValue = (value: string | CAPAStatus | CAPAPriority | CAPASource): string => {
  if (typeof value === 'string') {
    return value.replace(/_/g, ' ');
  }
  
  return value.replace(/_/g, ' ');
};

export const isStringStatusEqual = (status1: string | CAPAStatus, status2: string | CAPAStatus): boolean => {
  const normalize = (status: string | CAPAStatus): string => {
    if (typeof status === 'string') {
      return status.toLowerCase().replace(/\s+/g, '_');
    }
    return status.toLowerCase();
  };
  
  return normalize(status1) === normalize(status2);
};
