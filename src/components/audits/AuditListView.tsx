
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import { DatabaseAudit } from '@/hooks/useInternalAudits';

interface AuditListViewProps {
  audits: DatabaseAudit[];
}

const AuditListView: React.FC<AuditListViewProps> = ({ audits }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'In Progress':
        return <Clock className="h-4 w-4" />;
      case 'Scheduled':
        return <Calendar className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (audits.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No audits found matching your criteria</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {audits.map((audit) => (
        <Card key={audit.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{audit.title}</h3>
                  <Badge className={getStatusColor(audit.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(audit.status)}
                      {audit.status}
                    </div>
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <strong>Type:</strong> {audit.audit_type}
                  </div>
                  <div>
                    <strong>Assigned to:</strong> {audit.assigned_to}
                  </div>
                  <div>
                    <strong>Findings:</strong> {audit.findings_count}
                  </div>
                  <div>
                    <strong>Start Date:</strong> {formatDate(audit.start_date)}
                  </div>
                  <div>
                    <strong>Due Date:</strong> {formatDate(audit.due_date)}
                  </div>
                  {audit.completion_date && (
                    <div>
                      <strong>Completed:</strong> {formatDate(audit.completion_date)}
                    </div>
                  )}
                </div>

                {audit.description && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {audit.description}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AuditListView;
