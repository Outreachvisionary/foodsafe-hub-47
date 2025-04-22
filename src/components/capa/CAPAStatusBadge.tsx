
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CAPAStatus, CAPAPriority, getStatusColor, getPriorityColor } from '@/types/capa';
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';

interface CAPAStatusBadgeProps {
  status: CAPAStatus;
  priority?: CAPAPriority;
  showIcon?: boolean;
  isDue?: boolean;
}

export const CAPAStatusBadge: React.FC<CAPAStatusBadgeProps> = ({ 
  status, 
  priority,
  showIcon = true,
  isDue = false 
}) => {
  const getIcon = () => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
      case 'in-progress':
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case 'closed':
      case 'verified':
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      case 'cancelled':
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className={`${getStatusColor(status)} capitalize font-medium ${isDue ? 'animate-pulse' : ''}`}
      >
        {showIcon && getIcon()}
        {status.replace('-', ' ')}
      </Badge>
      {priority && (
        <Badge 
          variant="outline" 
          className={`${getPriorityColor(priority)} capitalize font-medium`}
        >
          {priority}
        </Badge>
      )}
    </div>
  );
};

