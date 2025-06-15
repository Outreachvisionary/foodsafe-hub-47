
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CAPAStatus } from '@/types/enums';

interface CAPAStatusBadgeProps {
  status: CAPAStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CAPAStatusBadge: React.FC<CAPAStatusBadgeProps> = ({ 
  status, 
  className = '',
  size = 'md'
}) => {
  const getStatusConfig = (status: CAPAStatus) => {
    switch (status) {
      case CAPAStatus.Open:
        return {
          variant: 'secondary' as const,
          className: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300 shadow-sm',
          label: 'Open'
        };
      case CAPAStatus.In_Progress:
        return {
          variant: 'secondary' as const,
          className: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300 shadow-sm',
          label: 'In Progress'
        };
      case CAPAStatus.Under_Review:
        return {
          variant: 'secondary' as const,
          className: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300 shadow-sm',
          label: 'Under Review'
        };
      case CAPAStatus.Pending_Verification:
        return {
          variant: 'secondary' as const,
          className: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300 shadow-sm',
          label: 'Pending Verification'
        };
      case CAPAStatus.Closed:
        return {
          variant: 'secondary' as const,
          className: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300 shadow-sm',
          label: 'Closed'
        };
      case CAPAStatus.Cancelled:
        return {
          variant: 'secondary' as const,
          className: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 shadow-sm',
          label: 'Cancelled'
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300 shadow-sm',
          label: 'Unknown'
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-sm px-4 py-2 font-medium';
      default:
        return 'text-sm px-3 py-1.5';
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${getSizeClasses(size)} font-medium transition-all hover:shadow-md ${className}`}
    >
      {config.label}
    </Badge>
  );
};
