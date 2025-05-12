
import React from 'react';
import { Complaint } from '@/types/complaint';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { getComplaintStatusColor } from '@/utils/complaintUtils';
import { AlertCircle, ArrowRight, CheckCircle, Clock } from 'lucide-react';

interface ComplaintsListProps {
  complaints: Complaint[];
  isLoading?: boolean;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const ComplaintsList: React.FC<ComplaintsListProps> = ({ 
  complaints, 
  isLoading = false,
  onSelectComplaint 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No complaints found</h3>
        <p className="text-muted-foreground">No complaints match your current filters.</p>
      </div>
    );
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return <Badge variant="destructive" className="mr-2">Critical</Badge>;
      case 'High':
        return <Badge variant="destructive" className="mr-2">High</Badge>;
      case 'Medium':
        return <Badge variant="default" className="mr-2">Medium</Badge>;
      case 'Low':
        return <Badge variant="outline" className="mr-2">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => {
        const statusColors = getComplaintStatusColor(complaint.status);
        return (
          <Card key={complaint.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold truncate">{complaint.title}</h3>
                    {getPriorityIcon(complaint.priority)}
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <Badge className={`${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                      {complaint.status.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(complaint.reported_date), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{complaint.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge variant="outline" className="mr-2">{complaint.category.replace(/_/g, ' ')}</Badge>
                      {complaint.capa_id && (
                        <Badge variant="secondary">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          CAPA Linked
                        </Badge>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onSelectComplaint(complaint)}
                      className="text-sm"
                    >
                      View details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-muted px-4 py-2 flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">Customer: </span>
                    {complaint.customer_name}
                  </div>
                  {complaint.assigned_to && (
                    <div className="text-sm">
                      <span className="font-medium">Assigned: </span>
                      {complaint.assigned_to}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ComplaintsList;
