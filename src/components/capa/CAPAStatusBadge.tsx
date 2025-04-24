
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CAPAStatus, CAPAPriority } from '@/types/capa';
import { AlertTriangle, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mapInternalToStatus } from '@/services/capa/capaStatusService';

interface CAPAStatusBadgeProps {
  status: string | CAPAStatus;
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
  // Normalize status to proper CAPAStatus type
  const normalizedStatus = mapInternalToStatus(status);
  
  const getIcon = () => {
    switch (normalizedStatus) {
      case 'Open':
        return <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
      case 'In_Progress':
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case 'Pending_Verification':
        return <AlertCircle className="h-3.5 w-3.5 mr-1" />;
      case 'Closed':
      case 'Verified':
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: CAPAStatus): string => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In_Progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Closed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Verified':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pending_Verification':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: CAPAPriority): string => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
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
          getStatusColor(normalizedStatus), 
          "capitalize font-medium",
          isDue ? 'animate-pulse shadow-glow-primary' : '',
          className
        )}
      >
        {showIcon && getIcon()}
        {normalizedStatus.replace('_', ' ')}
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
