import { Document } from '@/types/document';

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  completed: boolean;
  description: string;
  approvers: string[];
  status?: string;
}

export const getDocumentStatus = (status: string): string => {
  switch (status) {
    case 'Pending_Approval':
      return 'Pending Approval';
    case 'Approved':
      return 'Approved';
    case 'Rejected':
      return 'Rejected';
    case 'Draft':
      return 'Draft';
    case 'Published':
      return 'Published';
    case 'Archived':
      return 'Archived';
    case 'Expired':
      return 'Expired';
    case 'Pending_Review':
      return 'Pending Review';
    case 'Active':
      return 'Active';
    default:
      return status;
  }
};
