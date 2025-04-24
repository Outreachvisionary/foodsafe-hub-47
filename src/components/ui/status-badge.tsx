
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Clock, Info, FileCheck, AlertCircle } from 'lucide-react';

export type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'pending';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  withIcon?: boolean;
  className?: string;
}

/**
 * StatusBadge component for displaying status indicators with consistent styling
 * Automatically maps common status strings to appropriate colors
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type, 
  withIcon = true, 
  className 
}) => {
  // Automatically determine the status type if not explicitly provided
  if (!type) {
    type = getStatusType(status);
  }
  
  // Define color schemes based on status type
  const colorScheme = {
    success: "bg-success-muted text-success border-success/20 hover:bg-success-muted/80",
    warning: "bg-warning-muted text-warning-foreground border-warning/20 hover:bg-warning-muted/80",
    danger: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
    info: "bg-info-muted text-info border-info/20 hover:bg-info-muted/80",
    neutral: "bg-secondary text-foreground-secondary border-border hover:bg-secondary/80",
    pending: "bg-accent-muted text-accent border-accent/20 hover:bg-accent-muted/80",
  };
  
  // Select the appropriate icon based on status type
  const StatusIcon = withIcon ? getStatusIcon(type) : null;
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium text-xs py-1 shadow-sm",
        colorScheme[type],
        className
      )}
    >
      {withIcon && StatusIcon && (
        <StatusIcon className="h-3.5 w-3.5 mr-1" />
      )}
      {status}
    </Badge>
  );
};

/**
 * Maps common status strings to appropriate status types
 */
function getStatusType(status: string): StatusType {
  const lowerStatus = status.toLowerCase();
  
  if (
    lowerStatus.includes('success') ||
    lowerStatus.includes('completed') ||
    lowerStatus.includes('released') ||
    lowerStatus.includes('approved') ||
    lowerStatus.includes('active') ||
    lowerStatus.includes('compliant') ||
    lowerStatus.includes('verified')
  ) {
    return 'success';
  }
  
  if (
    lowerStatus.includes('warning') ||
    lowerStatus.includes('on hold') ||
    lowerStatus.includes('pending') ||
    lowerStatus.includes('in progress') ||
    lowerStatus.includes('review') ||
    lowerStatus.includes('awaiting')
  ) {
    return 'warning';
  }
  
  if (
    lowerStatus.includes('error') ||
    lowerStatus.includes('fail') ||
    lowerStatus.includes('danger') ||
    lowerStatus.includes('recalled') ||
    lowerStatus.includes('rejected') ||
    lowerStatus.includes('critical') ||
    lowerStatus.includes('non-compliant') ||
    lowerStatus.includes('overdue')
  ) {
    return 'danger';
  }
  
  if (
    lowerStatus.includes('info') ||
    lowerStatus.includes('notification') ||
    lowerStatus.includes('updated')
  ) {
    return 'info';
  }

  if (
    lowerStatus.includes('pending') ||
    lowerStatus.includes('waiting') ||
    lowerStatus.includes('scheduled')
  ) {
    return 'pending';
  }
  
  return 'neutral';
}

/**
 * Returns the appropriate icon component based on status type
 */
function getStatusIcon(type: StatusType): React.ElementType {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'warning':
      return Clock;
    case 'danger':
      return AlertTriangle;
    case 'info':
      return Info;
    case 'pending':
      return FileCheck;
    default:
      return AlertCircle;
  }
}

export default StatusBadge;
