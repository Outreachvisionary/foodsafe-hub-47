
import { TrainingStatus } from '@/types/enums';

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
