
import { TrainingStatus } from '@/types/enums';
import { parseISO, isValid } from 'date-fns';

// Training status conversion functions
export const trainingStatusToString = (status: TrainingStatus | string): string => {
  if (typeof status === 'string') return status;
  return String(status);
};

export const stringToTrainingStatus = (status: string): TrainingStatus => {
  // Normalize the status string to match the TrainingStatus enum format
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  return normalizedStatus as unknown as TrainingStatus;
};

// Safe date parsing functions
export const safeParseDateISO = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  try {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? parsedDate : null;
  } catch (e) {
    console.error(`Invalid date: ${dateString}`, e);
    return null;
  }
};

export const formatDateSafe = (date: Date | string | null | undefined, formatter: (date: Date) => string): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? safeParseDateISO(date) : date;
  if (!dateObj) return 'Invalid date';
  
  try {
    return formatter(dateObj);
  } catch (e) {
    console.error('Error formatting date', e);
    return 'Error';
  }
};
