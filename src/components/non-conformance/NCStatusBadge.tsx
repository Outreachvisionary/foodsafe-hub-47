
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NCStatus } from '@/types/non-conformance';

interface NCStatusBadgeProps {
  status: NCStatus;
}

const NCStatusBadge: React.FC<NCStatusBadgeProps> = ({ status }) => {
  const getVariant = (): "default" | "destructive" | "outline" | "secondary" | "success" => {
    switch (status) {
      case 'Released':
        return 'success';
      case 'On Hold':
        return 'secondary';
      case 'Under Review':
        return 'secondary';
      case 'Disposed':
        return 'outline';
      case 'Resolved':
        return 'success';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'destructive';
      case 'Closed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Badge variant={getVariant()}>
      {status}
    </Badge>
  );
};

export default NCStatusBadge;
