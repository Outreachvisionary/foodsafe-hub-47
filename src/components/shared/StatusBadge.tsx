
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'default' }) => {
  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(/[_\s]/g, '');
    
    const statusColors = {
      // Success states
      active: 'bg-green-100 text-green-800 border-green-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      closed: 'bg-green-100 text-green-800 border-green-200',
      resolved: 'bg-green-100 text-green-800 border-green-200',
      
      // Warning states
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      inprogress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      pendingverification: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      
      // Error states
      rejected: 'bg-red-100 text-red-800 border-red-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      overdue: 'bg-red-100 text-red-800 border-red-200',
      expired: 'bg-red-100 text-red-800 border-red-200',
      
      // Info states
      draft: 'bg-blue-100 text-blue-800 border-blue-200',
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      open: 'bg-blue-100 text-blue-800 border-blue-200',
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      
      // Priority states
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
      critical: 'bg-red-100 text-red-800 border-red-200',
    };
    
    return statusColors[normalizedStatus] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Badge 
      variant={variant}
      className={cn(
        "px-2 py-1 text-xs font-medium border",
        getStatusColor(status)
      )}
    >
      {status.replace(/_/g, ' ')}
    </Badge>
  );
};

export default StatusBadge;
