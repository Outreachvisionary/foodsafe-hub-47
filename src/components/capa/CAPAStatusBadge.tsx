
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CAPAStatus } from '@/types/enums';

interface CAPAStatusBadgeProps {
  status: CAPAStatus;
  className?: string;
}

export const CAPAStatusBadge: React.FC<CAPAStatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (status: CAPAStatus) => {
    switch (status) {
      case CAPAStatus.Open:
        return {
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Open'
        };
      case CAPAStatus.In_Progress:
        return {
          variant: 'secondary' as const,
          className: 'bg-amber-100 text-amber-800 border-amber-200',
          label: 'In Progress'
        };
      case CAPAStatus.Under_Review:
        return {
          variant: 'secondary' as const,
          className: 'bg-purple-100 text-purple-800 border-purple-200',
          label: 'Under Review'
        };
      case CAPAStatus.Pending_Verification:
        return {
          variant: 'secondary' as const,
          className: 'bg-orange-100 text-orange-800 border-orange-200',
          label: 'Pending Verification'
        };
      case CAPAStatus.Closed:
        return {
          variant: 'secondary' as const,
          className: 'bg-green-100 text-green-800 border-green-200',
          label: 'Closed'
        };
      case CAPAStatus.Cancelled:
        return {
          variant: 'secondary' as const,
          className: 'bg-red-100 text-red-800 border-red-200',
          label: 'Cancelled'
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
};
