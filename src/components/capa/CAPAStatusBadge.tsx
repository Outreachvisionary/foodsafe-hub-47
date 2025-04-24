
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CAPAStatus } from '@/types/capa';

interface CAPAStatusBadgeProps {
  status: CAPAStatus;
}

export const CAPAStatusBadge: React.FC<CAPAStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: CAPAStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
      case 'In_Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case 'Pending_Verification':
        return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
      case 'Verified':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const formatStatus = (status: CAPAStatus): string => {
    return status.replace('_', ' ');
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusColor(status)} font-medium`}
    >
      {formatStatus(status)}
    </Badge>
  );
};

export default CAPAStatusBadge;
