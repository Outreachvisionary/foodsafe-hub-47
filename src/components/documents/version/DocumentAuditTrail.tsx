
import React from 'react';
import { DocumentActivity } from '@/types/document';
import { format } from 'date-fns';
import { Eye, Edit, Trash, CheckCircle, XCircle, Upload, Download, RotateCcw, Lock, Unlock } from 'lucide-react';

interface DocumentAuditTrailProps {
  activities: DocumentActivity[];
}

export const DocumentAuditTrail: React.FC<DocumentAuditTrailProps> = ({ activities }) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Upload className="h-4 w-4 text-green-500" />;
      case 'update':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'delete':
        return <Trash className="h-4 w-4 text-red-500" />;
      case 'approve':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'reject':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'view':
        return <Eye className="h-4 w-4 text-gray-500" />;
      case 'download':
        return <Download className="h-4 w-4 text-blue-500" />;
      case 'checkout':
        return <Lock className="h-4 w-4 text-amber-500" />;
      case 'checkin':
        return <Unlock className="h-4 w-4 text-green-500" />;
      case 'revert':
        return <RotateCcw className="h-4 w-4 text-purple-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getActionDescription = (activity: DocumentActivity): string => {
    const user = activity.user_name || activity.user_id;
    
    switch (activity.action) {
      case 'create':
        return `${user} created the document`;
      case 'update':
        return `${user} updated the document`;
      case 'delete':
        return `${user} deleted the document`;
      case 'approve':
        return `${user} approved the document`;
      case 'reject':
        return `${user} rejected the document`;
      case 'view':
        return `${user} viewed the document`;
      case 'download':
        return `${user} downloaded the document`;
      case 'checkout':
        return `${user} checked out the document`;
      case 'checkin':
        return `${user} checked in the document`;
      case 'revert':
        return `${user} reverted to a previous version`;
      default:
        return `${user} performed action: ${activity.action}`;
    }
  };
  
  return (
    <div className="space-y-4">
      {activities.length > 0 ? (
        activities.map(activity => (
          <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
            <div className="mt-0.5">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                {getActionIcon(activity.action)}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="font-medium">
                  {getActionDescription(activity)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(activity.timestamp), 'PPp')}
                </div>
              </div>
              
              {activity.comments && (
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  {activity.comments}
                </p>
              )}
              
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                {activity.user_role && (
                  <span className="px-2 py-0.5 rounded-full bg-muted">
                    {activity.user_role}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No audit trail activities to display</p>
        </div>
      )}
    </div>
  );
};
