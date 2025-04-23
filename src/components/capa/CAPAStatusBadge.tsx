
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CAPAStatus, CAPAPriority } from '@/types/capa';
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
      case 'Open':
        return <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
      case 'in-progress':
      case 'In Progress':
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case 'pending-verification':
      case 'Pending Verification':
        return <AlertCircle className="h-3.5 w-3.5 mr-1" />;
      case 'closed':
      case 'Closed':
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      case 'verified':
      case 'Verified':
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      case 'cancelled':
      case 'Cancelled':
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: CAPAStatus): string => {
    const normalized = status.toLowerCase().replace(/[-\s]/g, '');
    switch (normalized) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inprogress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'closed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'verified':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pendingverification':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: CAPAPriority): string => {
    const normalized = priority.toLowerCase();
    switch (normalized) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
