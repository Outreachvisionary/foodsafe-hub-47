
export const getDocumentStatusColor = (status: string): string => {
  switch (status) {
    case 'Draft':
      return 'bg-gray-100 text-gray-800';
    case 'Pending_Approval':
      return 'bg-yellow-100 text-yellow-800';
    case 'Pending_Review':
      return 'bg-blue-100 text-blue-800';
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Published':
      return 'bg-emerald-100 text-emerald-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    case 'Archived':
      return 'bg-gray-100 text-gray-600';
    case 'Expired':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatDocumentStatus = (status: string): string => {
  switch (status) {
    case 'Pending_Approval':
      return 'Pending Approval';
    case 'Pending_Review':
      return 'Pending Review';
    case 'In_Review':
      return 'In Review';
    default:
      return status;
  }
};

export const compareDocumentStatus = (status: string, targetStatus: string): boolean => {
  return status === targetStatus;
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

export const canEditDocument = (status: string): boolean => {
  return status === 'Draft';
};

export const canApproveDocument = (status: string): boolean => {
  return status === 'Pending_Approval';
};

export const canPublishDocument = (status: string): boolean => {
  return status === 'Approved';
};
