
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NCStatus } from '@/types/non-conformance';

interface NCStatusBadgeProps {
  status: NCStatus;
}

const NCStatusBadge: React.FC<NCStatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: NCStatus) => {
    switch (status) {
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
      case 'Released':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'Disposed':
        return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case 'Resolved':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusStyles(status)} font-medium`}
    >
      {status}
    </Badge>
  );
};

export default NCStatusBadge;
