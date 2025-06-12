
import { DocumentStatus } from '@/types/enums';

export const getDocumentStatusColor = (status: DocumentStatus | string): string => {
  switch (status) {
    case 'Draft':
    case DocumentStatus.Draft:
      return 'bg-gray-100 text-gray-800';
    case 'Pending_Approval':
    case DocumentStatus.Pending_Approval:
      return 'bg-yellow-100 text-yellow-800';
    case 'Pending_Review':
    case DocumentStatus.Pending_Review:
      return 'bg-blue-100 text-blue-800';
    case 'Approved':
    case DocumentStatus.Approved:
      return 'bg-green-100 text-green-800';
    case 'Published':
    case DocumentStatus.Published:
      return 'bg-emerald-100 text-emerald-800';
    case 'Rejected':
    case DocumentStatus.Rejected:
      return 'bg-red-100 text-red-800';
    case 'Archived':
    case DocumentStatus.Archived:
      return 'bg-gray-100 text-gray-600';
    case 'Expired':
    case DocumentStatus.Expired:
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatDocumentStatus = (status: DocumentStatus | string): string => {
  switch (status) {
    case 'Pending_Approval':
    case DocumentStatus.Pending_Approval:
      return 'Pending Approval';
    case 'Pending_Review':
    case DocumentStatus.Pending_Review:
      return 'Pending Review';
    case 'In_Review':
    case DocumentStatus.In_Review:
      return 'In Review';
    default:
      return status.toString();
  }
};

export const getWorkflowSteps = (requiresApproval: boolean) => {
  if (requiresApproval) {
    return [
      { name: 'Draft', status: 'Draft' },
      { name: 'Pending Approval', status: 'Pending_Approval' },
      { name: 'Approved', status: 'Approved' },
      { name: 'Published', status: 'Published' }
    ];
  } else {
    return [
      { name: 'Draft', status: 'Draft' },
      { name: 'Published', status: 'Published' }
    ];
  }
};

export const canEditDocument = (status: DocumentStatus | string): boolean => {
  return status === 'Draft' || status === DocumentStatus.Draft;
};

export const canApproveDocument = (status: DocumentStatus | string): boolean => {
  return status === 'Pending_Approval' || status === DocumentStatus.Pending_Approval;
};

export const canPublishDocument = (status: DocumentStatus | string): boolean => {
  return status === 'Approved' || status === DocumentStatus.Approved;
};
