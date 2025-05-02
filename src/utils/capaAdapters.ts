
import { CAPAStatus, CAPAPriority } from '@/types/enums';

export const adaptCAPAToModel = (capaData: any) => {
  return {
    ...capaData,
    status: capaData.status as CAPAStatus,
    priority: capaData.priority as CAPAPriority
  };
};

export const capaStatusToString = (status: CAPAStatus): string => {
  if (typeof status === 'string') return status;
  return status.toString().replace(/_/g, ' ');
};

export const stringToCAPAStatus = (status: string): CAPAStatus => {
  // Normalize the status string to match the CAPAStatus enum format
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  return normalizedStatus as unknown as CAPAStatus;
};
