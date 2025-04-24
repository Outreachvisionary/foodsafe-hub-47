
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NCWorkflowTimelineProps {
  nonConformanceId: string;
}

export const NCWorkflowTimeline: React.FC<NCWorkflowTimelineProps> = ({ nonConformanceId }) => {
  // This is a placeholder component that would normally fetch and display activity history
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Activity history for this non-conformance will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
};

export default NCWorkflowTimeline;
