
import { CAPAStatus } from '@/types/enums';

export function isStatusEqual(status: CAPAStatus, statusStr: string): boolean {
  // Handle the case where status might be a string or a CAPAStatus enum value
  const normalizedStatus = typeof status === 'string' ? status : status.toString();
  
  // Compare the normalized status with the provided string 
  // (case-insensitive and spaces/underscores are ignored)
  return normalizedStatus.toLowerCase().replace(/[_ ]/g, '') === 
         statusStr.toLowerCase().replace(/[_ ]/g, '');
}
