
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CAPAStatus, CAPAPriority, getStatusColor, getPriorityColor } from '@/types/capa';
import { AlertTriangle, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CAPAStatusBadgeProps {
  status: CAPAStatus;
  priority?: CAPAPriority;
  showIcon?: boolean;
  isDue?: boolean;
  className?: string;
}

export const CAPAStatusBadge: React.FC<CAPAStatusBadgeProps> = ({ 
  status, 
  priority,
  showIcon = true,
  isDue = false,
  className
}) => {
  const getIcon = () => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
      case 'in-progress':
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case 'pending-verification':
        return <AlertCircle className="h-3.5 w-3.5 mr-1" />;
      case 'closed':
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
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
        className={cn(
          getStatusColor(status), 
          "capitalize font-medium",
          isDue ? 'animate-pulse shadow-glow-primary' : '',
          className
        )}
      >
        {showIcon && getIcon()}
        {status.replace('-', ' ')}
      </Badge>
      {priority && (
        <Badge 
          variant="outline" 
          className={cn(getPriorityColor(priority), "capitalize font-medium")}
        >
          {priority}
        </Badge>
      )}
    </div>
  );
};
