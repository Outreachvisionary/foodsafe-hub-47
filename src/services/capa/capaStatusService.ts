
import { CAPAStatus } from '@/types/enums';

export const isStatusEqual = (status1: string, status2: string | CAPAStatus): boolean => {
  const normalizeStatus = (status: string): string => {
    return status.replace(/ /g, '_').toLowerCase();
  };

  return normalizeStatus(status1) === normalizeStatus(status2.toString());
};
