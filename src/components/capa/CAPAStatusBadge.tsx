
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CAPAStatus } from '@/types/enums';

interface CAPAStatusBadgeProps {
  status: CAPAStatus;
  className?: string;
}

export const CAPAStatusBadge: React.FC<CAPAStatusBadgeProps> = ({ status, className = '' }) => {
  // Function to determine badge color based on status
  const getBadgeStyles = () => {
    switch(status) {
      case CAPAStatus.Open:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case CAPAStatus.In_Progress:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case CAPAStatus.Pending_Verification:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case CAPAStatus.Closed:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case CAPAStatus.Cancelled:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format display text by replacing underscores with spaces
  const formatStatusText = (status: string): string => {
    return status.replace(/_/g, ' ');
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
