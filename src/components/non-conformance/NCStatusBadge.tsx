
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NCStatus } from '@/types/enums';
import { formatEnumValue } from '@/utils/typeAdapters';

interface NCStatusBadgeProps {
  status: NCStatus;
  className?: string;
}

export const NCStatusBadge: React.FC<NCStatusBadgeProps> = ({ status, className = '' }) => {
  const getBadgeStyles = () => {
    switch(status) {
      case NCStatus.On_Hold:
        return 'bg-red-100 text-red-800 border-red-200';
      case NCStatus.Under_Review:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case NCStatus.Released:
        return 'bg-green-100 text-green-800 border-green-200';
      case NCStatus.Disposed:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case NCStatus.Resolved:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge 
      variant="outline"
      className={`font-normal ${getBadgeStyles()} ${className}`}
    >
      {formatEnumValue(status)}
    </Badge>
  );
};

export default NCStatusBadge;
