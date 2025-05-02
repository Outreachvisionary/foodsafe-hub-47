
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NCStatus } from '@/types/enums';
import { ncStatusToString } from '@/utils/typeAdapters';

interface NCStatusBadgeProps {
  status: NCStatus | string;
  className?: string;
}

const NCStatusBadge: React.FC<NCStatusBadgeProps> = ({ status, className = '' }) => {
  // Function to determine badge color based on status
  const getBadgeStyles = () => {
    const statusStr = typeof status === 'string' ? status : String(status);
    
    switch(statusStr) {
      case 'Open':
      case String(NCStatus.Open):
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In_Progress':
      case 'In Progress':
      case String(NCStatus.InProgress):
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Completed':
      case String(NCStatus.Completed):
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed':
      case String(NCStatus.Closed):
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Overdue':
      case String(NCStatus.Overdue):
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending_Verification':
      case 'Pending Verification':
      case String(NCStatus.PendingVerification):
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Verified':
      case String(NCStatus.Verified):
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
      case String(NCStatus.Rejected):
        return 'bg-red-100 text-red-800 border-red-200';
      case 'On_Hold':
      case 'On Hold':
      case String(NCStatus.OnHold):
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Under_Review':
      case 'Under Review':
      case String(NCStatus.UnderReview):
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format display text by replacing underscores with spaces
  const formatStatusText = (statusValue: NCStatus | string): string => {
    if (typeof statusValue === 'string') {
      return statusValue.replace(/_/g, ' ');
    }
    return String(statusValue);
  };

  return (
    <Badge 
      variant="outline"
      className={`font-normal ${getBadgeStyles()} ${className}`}
    >
      {formatStatusText(status)}
    </Badge>
  );
};

export default NCStatusBadge;
