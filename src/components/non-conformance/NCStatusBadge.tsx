
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NCStatus } from '@/types/enums';
import { ncStatusToString } from '@/utils/typeAdapters';

interface CAPAStatusBadgeProps {
  status: NCStatus | string;
  className?: string;
}

export const CAPAStatusBadge: React.FC<CAPAStatusBadgeProps> = ({ status, className = '' }) => {
  // Function to determine badge color based on status
  const getBadgeStyles = () => {
    const statusStr = typeof status === 'string' ? status : status.toString();
    
    switch(statusStr) {
      case 'Open':
      case NCStatus.Open:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In_Progress':
      case NCStatus.InProgress:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Completed':
      case NCStatus.Completed:
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed':
      case NCStatus.Closed:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Overdue':
      case NCStatus.Overdue:
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending_Verification':
      case NCStatus.PendingVerification:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Verified':
      case NCStatus.Verified:
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
      case NCStatus.Rejected:
        return 'bg-red-100 text-red-800 border-red-200';
      case 'On_Hold':
      case NCStatus.OnHold:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Under_Review':
      case NCStatus.UnderReview:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format display text by replacing underscores with spaces
  const formatStatusText = (statusValue: NCStatus | string): string => {
    return ncStatusToString(statusValue as NCStatus);
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

export default CAPAStatusBadge;
