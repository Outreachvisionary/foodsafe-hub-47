
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, AlertTriangle, User } from 'lucide-react';

interface NCWorkflowTimelineProps {
  ncId: string;
}

export const NCWorkflowTimeline: React.FC<NCWorkflowTimelineProps> = ({ ncId }) => {
  // Sample timeline data - in a real app, this would be fetched
  const timeline = [
    { 
      id: '1', 
      date: '2023-06-15', 
      action: 'Created', 
      user: 'John Doe', 
      details: 'Non-conformance reported' 
    },
    { 
      id: '2', 
      date: '2023-06-16', 
      action: 'Status Change', 
      user: 'Jane Smith', 
      details: 'Status changed from "On Hold" to "Under Review"' 
    },
    { 
      id: '3', 
      date: '2023-06-20', 
      action: 'CAPA Created', 
      user: 'Mike Johnson', 
      details: 'CAPA-2023-001 created to address root cause' 
    },
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Created':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'Status Change':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'CAPA Created':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 space-y-6">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>

          {timeline.map((item) => (
            <div key={item.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-6 mt-1.5 flex items-center justify-center w-4 h-4 rounded-full border border-white bg-white">
                {getActionIcon(item.action)}
              </div>

              <div className="mb-1">
                <div className="flex items-center">
                  <Badge variant="outline" className="text-xs font-normal mr-2">
                    {item.action}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p className="text-sm">{item.details}</p>

              <div className="flex items-center mt-1 text-xs text-gray-500">
                <User className="h-3 w-3 mr-1" />
                {item.user}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NCWorkflowTimeline;
