
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, AlertCircle } from 'lucide-react';

interface CAPAEffectivenessMonitorProps {
  id: string;
  implementationDate: string;
  daysToMonitor?: number;
}

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({
  id,
  implementationDate,
  daysToMonitor = 30
}) => {
  // Calculate days since implementation
  const daysSinceImplementation = Math.floor(
    (new Date().getTime() - new Date(implementationDate).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  
  // Calculate days remaining in monitoring period
  const daysRemaining = Math.max(0, daysToMonitor - daysSinceImplementation);
  
  // Calculate progress percentage
  const progress = Math.min(100, (daysSinceImplementation / daysToMonitor) * 100);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Calculate end date of monitoring period
  const getMonitoringEndDate = () => {
    const endDate = new Date(implementationDate);
    endDate.setDate(endDate.getDate() + daysToMonitor);
    return formatDate(endDate.toISOString());
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-blue-600" />
          Effectiveness Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Implementation Date:</span>
            <span className="font-medium">{formatDate(implementationDate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Monitoring Period:</span>
            <span className="font-medium">{daysToMonitor} days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>End Date:</span>
            <span className="font-medium">{getMonitoringEndDate()}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress:</span>
            <span className="font-medium">{Math.floor(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Day 0</span>
            <span>Day {daysToMonitor}</span>
          </div>
        </div>
        
        {daysRemaining > 0 ? (
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Monitoring in progress</p>
                <p>
                  {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining in the monitoring period.
                  Effectiveness will be assessed at the end of this period.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Button className="w-full">
            Complete Effectiveness Assessment
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
