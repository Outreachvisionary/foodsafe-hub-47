
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle, Trash2, CheckCheck, X, AlertCircle } from 'lucide-react';
import { NCStatus } from '@/types/non-conformance';

interface NCStatusBadgeProps {
  status: NCStatus;
  className?: string;
}

const NCStatusBadge: React.FC<NCStatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'On Hold':
        return {
          className: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <AlertTriangle className="h-3 w-3" />
        };
      case 'Under Review':
        return {
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Clock className="h-3 w-3" />
        };
      case 'Released':
        return {
          className: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-3 w-3" />
        };
      case 'Disposed':
        return {
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Trash2 className="h-3 w-3" />
        };
      case 'Approved':
        return {
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCheck className="h-3 w-3" />
        };
      case 'Rejected':
        return {
          className: 'bg-red-100 text-red-800 border-red-200',
          icon: <X className="h-3 w-3" />
        };
      case 'Resolved':
        return {
          className: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <CheckCircle className="h-3 w-3" />
        };
      case 'Closed':
        return {
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="h-3 w-3" />
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="h-3 w-3" />
        };
    }
  };

  const { className: statusClassName, icon } = getStatusDetails();
  
  return (
    <Badge variant="outline" className={`${statusClassName} flex items-center gap-1 ${className}`}>
      {icon}
      {status}
    </Badge>
  );
};

export default NCStatusBadge;
