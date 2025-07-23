import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, Calendar, Zap } from 'lucide-react';
import { Complaint } from '@/types/complaint';
import { format } from 'date-fns';

interface ComplaintsListProps {
  complaints: Complaint[];
  onRefresh?: () => void;
}

const ComplaintsList: React.FC<ComplaintsListProps> = ({ complaints }) => {
  const navigate = useNavigate();

  if (complaints.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No complaints found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <Card key={complaint.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 
                  className="font-semibold text-lg cursor-pointer hover:text-primary mb-2"
                  onClick={() => navigate(`/complaints/${complaint.id}`)}
                >
                  {complaint.title}
                </h3>
                <p className="text-muted-foreground mb-4">{complaint.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(complaint.reported_date), 'MMM d, yyyy')}</span>
                  </div>
                  {complaint.customer_name && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{complaint.customer_name}</span>
                    </div>
                  )}
                  {complaint.capa_id && (
                    <Badge variant="secondary">
                      <Zap className="h-3 w-3 mr-1" />
                      CAPA Linked
                    </Badge>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/complaints/${complaint.id}`)}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ComplaintsList;