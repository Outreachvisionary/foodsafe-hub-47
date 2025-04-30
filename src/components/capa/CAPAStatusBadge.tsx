
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CAPAStatus } from '@/types/enums';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface CAPAStatusBadgeProps {
  status: CAPAStatus;
  className?: string;
}

export const CAPAStatusBadge: React.FC<CAPAStatusBadgeProps> = ({ status, className }) => {
  const getStatusDetails = () => {
    switch (status) {
      case CAPAStatus.Open:
        return {
          icon: <Clock className="h-3 w-3 mr-1" />,
          label: 'Open',
          color: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case CAPAStatus.InProgress:
        return {
          icon: <Clock className="h-3 w-3 mr-1" />,
          label: 'In Progress',
          color: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case CAPAStatus.Completed:
        return {
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          label: 'Completed',
          color: 'bg-green-50 text-green-700 border-green-200'
        };
      case CAPAStatus.Closed:
        return {
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          label: 'Closed',
          color: 'bg-green-50 text-green-700 border-green-200'
        };
      case CAPAStatus.Overdue:
        return {
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          label: 'Overdue',
          color: 'bg-red-50 text-red-700 border-red-200'
        };
      case CAPAStatus.PendingVerification:
        return {
          icon: <Clock className="h-3 w-3 mr-1" />,
          label: 'Pending Verification',
          color: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case CAPAStatus.Verified:
        return {
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          label: 'Verified',
          color: 'bg-green-50 text-green-700 border-green-200'
        };
      case CAPAStatus.OnHold:
        return {
          icon: <Clock className="h-3 w-3 mr-1" />,
          label: 'On Hold',
          color: 'bg-gray-50 text-gray-700 border-gray-200'
        };
      case CAPAStatus.Rejected:
        return {
          icon: <XCircle className="h-3 w-3 mr-1" />,
          label: 'Rejected',
          color: 'bg-red-50 text-red-700 border-red-200'
        };
      default:
        return {
          icon: <Clock className="h-3 w-3 mr-1" />,
          label: status.toString().replace(/_/g, ' '),
          color: 'bg-gray-50 text-gray-700 border-gray-200'
        };
    }
  };

  const { icon, label, color } = getStatusDetails();
  
  return (
    <Badge variant="outline" className={`flex items-center ${color} ${className}`}>
      {icon}
      {label}
    </Badge>
  );
};

export default CAPAStatusBadge;
