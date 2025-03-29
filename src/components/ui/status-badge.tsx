
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

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
    success: "bg-success/10 text-success border-success/20 hover:bg-success/20",
    warning: "bg-warning/10 text-charcoal border-warning/20 hover:bg-warning/20",
    danger: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
    info: "bg-info/10 text-info border-info/20 hover:bg-info/20",
    neutral: "bg-secondary text-charcoal-light border-border hover:bg-secondary/80",
  };
  
  // Select the appropriate icon based on status type
  const StatusIcon = withIcon ? getStatusIcon(type) : null;
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium text-xs py-1",
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
    lowerStatus.includes('compliant')
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
    lowerStatus.includes('non-compliant')
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
      return (props: any) => <span {...props}>i</span>;
    default:
      return (props: any) => <span {...props}>•</span>;
  }
}

export default StatusBadge;
