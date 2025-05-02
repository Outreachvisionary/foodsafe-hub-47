
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NCStatus } from '@/types/non-conformance';
import { isStatusEqual } from '@/utils/typeAdapters';

interface NCStatusBadgeProps {
  status: NCStatus | string;
}

const NCStatusBadge: React.FC<NCStatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (statusValue: NCStatus | string) => {
    // Use case-insensitive comparison
    if (isStatusEqual(statusValue, 'On Hold')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
    }
    if (isStatusEqual(statusValue, 'Under Review')) {
      return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
    }
    if (isStatusEqual(statusValue, 'Released')) {
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
    }
    if (isStatusEqual(statusValue, 'Disposed')) {
      return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
    }
    if (isStatusEqual(statusValue, 'Approved')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200';
    }
    if (isStatusEqual(statusValue, 'Rejected')) {
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
    }
    if (isStatusEqual(statusValue, 'Resolved')) {
      return 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200';
    }
    if (isStatusEqual(statusValue, 'Closed')) {
      return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusStyles(status)} font-medium`}
    >
      {typeof status === 'string' ? status : status.toString()}
    </Badge>
  );
};

export default NCStatusBadge;
