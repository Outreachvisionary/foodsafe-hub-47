
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CalendarDays, 
  User, 
  AlertCircle, 
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import RelationshipViewer from '@/components/shared/RelationshipViewer';
import RelatedDocumentsList from './RelatedDocumentsList';

interface CAPADetailViewProps {
  capaId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  createdBy: string;
  dueDate: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  relatedDocuments?: string[];
}

const CAPADetailView: React.FC<CAPADetailViewProps> = ({
  capaId,
  title,
  description,
  status,
  priority,
  assignedTo,
  createdBy,
  dueDate,
  rootCause,
  correctiveAction,
  preventiveAction,
  relatedDocuments = []
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in progress':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{title}</CardTitle>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(status)}>
                {getStatusIcon(status)}
                <span className="ml-1">{status}</span>
              </Badge>
              <Badge className={getPriorityColor(priority)}>
                {priority} Priority
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Assigned To</p>
                <p className="text-sm text-muted-foreground">{assignedTo}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created By</p>
                <p className="text-sm text-muted-foreground">{createdBy}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Root Cause */}
          {rootCause && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Root Cause Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{rootCause}</p>
              </CardContent>
            </Card>
          )}

          {/* Corrective Action */}
          {correctiveAction && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Corrective Action</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{correctiveAction}</p>
              </CardContent>
            </Card>
          )}

          {/* Preventive Action */}
          {preventiveAction && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preventive Action</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{preventiveAction}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Related Items */}
          <RelationshipViewer
            sourceId={capaId}
            sourceType="capa"
            sourceTitle={title}
          />

          {/* Related Documents */}
          <RelatedDocumentsList documentIds={relatedDocuments} />
        </div>
      </div>
    </div>
  );
};

export default CAPADetailView;
