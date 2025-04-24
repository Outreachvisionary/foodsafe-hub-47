
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, AlertTriangle, Calendar, ArrowRight } from 'lucide-react';

interface CAPATimelineProps {
  capaId: string;
}

export const CAPATimeline: React.FC<CAPATimelineProps> = ({ capaId }) => {
  // Sample timeline data - in a real app, this would be fetched based on the capaId
  const timelineEvents = [
    { id: 1, date: '2023-01-15', title: 'CAPA Created', description: 'CAPA was created based on audit finding', type: 'creation' },
    { id: 2, date: '2023-01-20', title: 'Root Cause Analysis Completed', description: 'Root cause identified as equipment calibration issue', type: 'update' },
    { id: 3, date: '2023-02-01', title: 'Actions Implemented', description: 'New equipment calibration schedule implemented', type: 'action' },
    { id: 4, date: '2023-02-15', title: 'Status Updated', description: 'Status changed from In Progress to Pending Verification', type: 'status' },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'creation':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'update':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'action':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'status':
        return <ArrowRight className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">CAPA Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <ul className="space-y-6 relative">
            {timelineEvents.map((event) => (
              <li key={event.id} className="ml-8">
                {/* Event icon */}
                <div className="absolute left-0 p-1 bg-white rounded-full border border-gray-200">
                  {getEventIcon(event.type)}
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <h4 className="text-base font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPATimeline;
