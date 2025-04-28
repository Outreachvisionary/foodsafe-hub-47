
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { CAPAEffectivenessRating } from '@/types/enums';
import { convertToEffectivenessRating } from '@/utils/typeAdapters';

interface CAPAEffectivenessMonitorProps {
  id: string;
  implementationDate: string;
}

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({
  id,
  implementationDate,
}) => {
  // This is a placeholder component - in a real app, this would fetch actual data
  // For now, we'll just show mock data
  const mockProgress = 75;
  
  const getStatusIcon = () => {
    if (mockProgress >= 80) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (mockProgress >= 50) {
      return <HelpCircle className="h-5 w-5 text-amber-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };
  
  // Calculate days since implementation
  const daysSinceImplementation = Math.floor(
    (new Date().getTime() - new Date(implementationDate).getTime()) / (1000 * 3600 * 24)
  );
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Effectiveness Monitoring</span>
          {getStatusIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Implementation: {daysSinceImplementation} days ago</span>
            <span className="font-medium">{mockProgress}%</span>
          </div>
          <Progress value={mockProgress} className="h-2" />
        </div>
        
        <div className="text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-muted-foreground">Verification Status</p>
              <p className="font-medium">Pending</p>
            </div>
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className="font-medium">
                {new Date(new Date(implementationDate).getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Effectiveness Criteria</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>No recurrence for 90 days</li>
            <li>Training completion rate &gt; 95%</li>
            <li>Process audit score &gt; 90%</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
