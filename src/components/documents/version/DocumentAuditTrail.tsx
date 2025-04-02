
import React from 'react';
import { DocumentActivity } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ActivityIcon, CheckCircle, XCircle, Eye, PlusCircle, Pencil, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentAuditTrailProps {
  activities: DocumentActivity[];
}

export const DocumentAuditTrail: React.FC<DocumentAuditTrailProps> = ({
  activities
}) => {
  // Get icon based on activity type
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <PlusCircle className="h-4 w-4 text-green-500" />;
      case 'update':
        return <Pencil className="h-4 w-4 text-blue-500" />;
      case 'approve':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'reject':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'view':
        return <Eye className="h-4 w-4 text-gray-500" />;
      case 'delete':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'checkout':
        return <ActivityIcon className="h-4 w-4 text-yellow-500" />;
      case 'checkin':
        return <ActivityIcon className="h-4 w-4 text-green-500" />;
      default:
        return <ActivityIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get badge variant based on activity type
  const getActionBadgeVariant = (action: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (action) {
      case 'create':
      case 'approve':
        return 'default';
      case 'update':
      case 'view':
      case 'checkin':
        return 'secondary';
      case 'reject':
      case 'delete':
        return 'destructive';
      case 'checkout':
      default:
        return 'outline';
    }
  };

  // Format action name for display
  const formatActionName = (action: string): string => {
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  return (
    <div className="relative pl-6 border-l">
      {activities.length > 0 ? (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-8">
            {activities.map((activity) => (
              <div key={activity.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-10 bg-background p-1 rounded-full border">
                  {getActionIcon(activity.action)}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant={getActionBadgeVariant(activity.action)}>
                      {formatActionName(activity.action)}
                    </Badge>
                    <span className="text-sm font-medium">
                      {activity.timestamp 
                        ? format(new Date(activity.timestamp), 'PPp')
                        : 'No timestamp'
                      }
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span className="font-medium">
                        {activity.user_name}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        ({activity.user_role})
                      </span>
                    </div>

                    {activity.comments && (
                      <p className="text-sm mt-1 text-muted-foreground">
                        "{activity.comments}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No activities recorded for this document</p>
        </div>
      )}
    </div>
  );
};
