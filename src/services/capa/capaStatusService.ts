
import { CAPAStatus } from '@/types/enums';

// Function to compare CAPA statuses regardless of format (spaces vs underscores, case)
export const isStatusEqual = (status1: string | CAPAStatus, status2: string | CAPAStatus): boolean => {
  if (!status1 || !status2) return false;
  
  // Convert enum instances to strings
  const s1 = typeof status1 === 'string' ? status1 : status1.toString();
  const s2 = typeof status2 === 'string' ? status2 : status2.toString();
  
  // Normalize by replacing underscores with spaces and converting to lowercase
  const normalizedStatus1 = s1.replace(/_/g, ' ').toLowerCase();
  const normalizedStatus2 = s2.replace(/_/g, ' ').toLowerCase();
  
  return normalizedStatus1 === normalizedStatus2;
};

export default { isStatusEqual };
