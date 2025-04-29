
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CAPAStatus } from '@/types/enums';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  HourglassIcon
} from 'lucide-react';

interface CAPAStatusBadgeProps {
  status: CAPAStatus;
  showIcon?: boolean;
}

export const CAPAStatusBadge: React.FC<CAPAStatusBadgeProps> = ({ 
  status,
  showIcon = false
}) => {
  const getStatusColor = (status: CAPAStatus) => {
    switch (status) {
      case CAPAStatus.Open:
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
      case CAPAStatus.InProgress:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case CAPAStatus.Closed:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
      case CAPAStatus.Overdue:
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case CAPAStatus.PendingVerification:
        return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
      case CAPAStatus.Verified:
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const formatStatus = (status: CAPAStatus): string => {
    return status.replace('_', ' ');
  };

  const getStatusIcon = (status: CAPAStatus) => {
    switch (status) {
      case CAPAStatus.Open:
        return <Clock className="mr-1 h-3 w-3" />;
      case CAPAStatus.InProgress:
        return <HourglassIcon className="mr-1 h-3 w-3" />;
      case CAPAStatus.Closed:
        return <CheckCircle className="mr-1 h-3 w-3" />;
      case CAPAStatus.Overdue:
        return <AlertCircle className="mr-1 h-3 w-3" />;
      case CAPAStatus.PendingVerification:
        return <AlertTriangle className="mr-1 h-3 w-3" />;
      case CAPAStatus.Verified:
        return <CheckCircle className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusColor(status)} font-medium flex items-center`}
    >
      {showIcon && getStatusIcon(status)}
      {formatStatus(status)}
    </Badge>
  );
};

export default CAPAStatusBadge;
