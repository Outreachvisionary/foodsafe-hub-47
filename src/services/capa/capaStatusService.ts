
import { CAPAStatus } from "@/types/capa";

export const mapStatusToInternal = (status: string): CAPAStatus => {
  const statusMap: Record<string, CAPAStatus> = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'closed': 'Closed',
    'verified': 'Verified',
    'pending-verification': 'Pending Verification',
    'overdue': 'Overdue',
    'cancelled': 'Cancelled',
  };

  return statusMap[status.toLowerCase()] || status as CAPAStatus;
};

export const mapInternalToStatus = (status: CAPAStatus): string => {
  const statusMap: Record<string, string> = {
    'Open': 'open',
    'In Progress': 'in-progress',
    'Closed': 'closed',
    'Verified': 'verified',
    'Pending Verification': 'pending-verification',
    'Overdue': 'overdue',
    'Cancelled': 'cancelled',
  };

  return statusMap[status] || status.toLowerCase();
};
