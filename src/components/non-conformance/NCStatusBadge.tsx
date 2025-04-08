
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NCStatus } from '@/types/non-conformance';

interface NCStatusBadgeProps {
  status: NCStatus;
}

const NCStatusBadge: React.FC<NCStatusBadgeProps> = ({ status }) => {
  let variant: 'default' | 'destructive' | 'outline' | 'secondary' | null = 'default';
  let className = '';
  
  if (status === 'On Hold') {
    variant = 'outline';
    className = 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200';
  } else if (status === 'Under Review') {
    variant = 'outline';
    className = 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
  } else if (status === 'Released') {
    variant = 'outline';
    className = 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
  } else if (status === 'Disposed') {
    variant = 'outline';
    className = 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
  } else if (status === 'Approved') {
    variant = 'outline';
    className = 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200';
  } else if (status === 'Rejected') {
    variant = 'outline';
    className = 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200';
  } else if (status === 'Resolved' || status === 'Closed') {
    variant = 'outline';
    className = 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
  }
  
  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
};

export default NCStatusBadge;
