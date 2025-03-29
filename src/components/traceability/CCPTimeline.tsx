
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActivitySquare, Thermometer, AlertTriangle, Check } from 'lucide-react';

// Interface defining the props for the CCP check
interface CCPCheck {
  id: string;
  ccpId: string;
  name: string;
  target: number | string;
  actual: number | string;
  unit: string;
  timestamp: string;
  passed: boolean;
  auditor: string;
  auditId?: string;
  hazardType: 'biological' | 'chemical' | 'physical';
  notes?: string;
  criticality?: 'CRITICAL' | 'MAJOR' | 'MINOR';
}

// Props for the CCPTimeline component
export interface CCPTimelineProps {
  checks: CCPCheck[];
  onCCPClick: (ccpId: string) => void;
}

const CCPTimeline: React.FC<CCPTimelineProps> = ({ checks, onCCPClick }) => {
  // Group checks by date for timeline display
  const groupedChecks = checks.reduce<Record<string, CCPCheck[]>>((acc, check) => {
    const date = new Date(check.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(check);
    return acc;
  }, {});

  // Timeline dates sorted in descending order
  const timelineDates = Object.keys(groupedChecks).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Function to render the appropriate hazard type icon
  const renderHazardIcon = (hazardType: string) => {
    switch (hazardType) {
      case 'biological':
        return <ActivitySquare className="h-4 w-4 text-red-500" />;
      case 'chemical':
        return <Thermometer className="h-4 w-4 text-purple-500" />;
      case 'physical':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <ActivitySquare className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CCP Monitoring Timeline</CardTitle>
        <CardDescription>Critical Control Point monitoring history and status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {timelineDates.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-gray-500">No CCP checks recorded yet.</p>
          </div>
        ) : (
          timelineDates.map(date => (
            <div key={date} className="relative">
              <div className="mb-2 text-sm font-medium">{date}</div>
              <div className="space-y-3">
                {groupedChecks[date].map(check => (
                  <div 
                    key={check.id} 
                    className={`p-4 rounded-lg border ${check.passed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {renderHazardIcon(check.hazardType)}
                        <span className="font-medium">{check.name}</span>
                        <Badge variant={check.passed ? "outline" : "destructive"} className={check.passed 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : ""}>
                          {check.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(check.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 text-sm">
                      <div>
                        <span className="text-gray-500">Target:</span> {check.target}{check.unit ? ` ${check.unit}` : ''}
                      </div>
                      <div>
                        <span className="text-gray-500">Actual:</span> {check.actual}{check.unit ? ` ${check.unit}` : ''}
                      </div>
                      <div>
                        <span className="text-gray-500">Auditor:</span> {check.auditor}
                      </div>
                    </div>
                    {check.notes && (
                      <div className="text-sm text-gray-600 mt-2 italic">
                        Note: {check.notes}
                      </div>
                    )}
                    <div className="mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onCCPClick(check.ccpId)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CCPTimeline;
