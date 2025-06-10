
import { DocumentStatus } from '@/types/enums';

export const compareDocumentStatus = (status: DocumentStatus | string, targetStatus: DocumentStatus): boolean => {
  const statusString = typeof status === 'string' ? status : status;
  const targetString = typeof targetStatus === 'string' ? targetStatus : targetStatus;
  
  return statusString === targetString;
};

export const formatDocumentStatus = (status: DocumentStatus | string): string => {
  const statusString = typeof status === 'string' ? status : status;
  return statusString.replace(/_/g, ' ');
};

export const getDocumentStatusColor = (status: DocumentStatus | string): string => {
  const statusString = typeof status === 'string' ? status : status;
  
  switch (statusString) {
    case 'Published':
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Draft':
      return 'bg-gray-100 text-gray-800';
    case 'Pending_Approval':
    case 'Pending_Review':
      return 'bg-yellow-100 text-yellow-800';
    case 'Expired':
      return 'bg-red-100 text-red-800';
    case 'Archived':
      return 'bg-blue-100 text-blue-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
