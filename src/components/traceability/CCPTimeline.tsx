
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, User, AlertTriangle, Thermometer } from 'lucide-react';
import { CCPCheck } from '@/types/traceability';
import HazardTypeIcons from '../training/HazardTypeIcons';

interface CCPTimelineProps {
  checks: CCPCheck[];
  onCCPClick: (ccp: CCPCheck) => void;
  onRecallInitiate?: () => void;
}

const CCPNode: React.FC<{
  check: CCPCheck;
  onClick: () => void;
}> = ({ check, onClick }) => {
  // Determine the appropriate icon based on hazard type and criticality
  const getHazardIcon = () => {
    if (check.criticality === 'CRITICAL') {
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
    
    switch (check.hazardType) {
      case 'biological':
        return <Thermometer className="h-4 w-4 text-amber-600" />;
      case 'physical':
      case 'chemical':
      default:
        return null;
    }
  };
  
  return (
    <div 
      className={`relative p-4 border rounded-lg ${
        check.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
      } cursor-pointer hover:shadow-md transition-all`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium flex items-center gap-2">
          {check.passed ? 
            <CheckCircle className="h-4 w-4 text-green-600" /> : 
            <AlertCircle className="h-4 w-4 text-red-600" />
          }
          {check.name}
          {check.criticality === 'CRITICAL' && (
            <Badge className="bg-red-100 text-red-800 border-red-200 ml-1">
              Critical
            </Badge>
          )}
        </h4>
        <Badge className={check.passed ? 
          'bg-green-100 text-green-800 border-green-200' : 
          'bg-red-100 text-red-800 border-red-200'
        }>
          {check.passed ? 'Passed' : 'Failed'}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Target:</span> {check.target} {check.unit}
        </div>
        <div>
          <span className="text-gray-500">Actual:</span> {check.actual} {check.unit}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {new Date(check.timestamp).toLocaleString()}
        </div>
        <div className="flex items-center gap-1">
          <User className="h-3.5 w-3.5" />
          {check.auditor}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <HazardTypeIcons hazardTypes={[check.hazardType]} />
        {getHazardIcon()}
      </div>
      {check.notes && (
        <p className="text-xs italic mt-1">{check.notes}</p>
      )}
    </div>
  );
};

const CCPTimeline: React.FC<CCPTimelineProps> = ({ 
  checks, 
  onCCPClick,
  onRecallInitiate 
}) => {
  // Sort checks by timestamp
  const sortedChecks = [...checks].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const hasFailedChecks = checks.some(check => !check.passed);
  const hasCriticalFailures = checks.some(check => !check.passed && check.criticality === 'CRITICAL');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">HACCP Critical Control Points Timeline</h3>
        {hasFailedChecks && onRecallInitiate && (
          <Button 
            variant="destructive"
            size="sm"
            onClick={onRecallInitiate}
            className={hasCriticalFailures ? 'animate-pulse' : ''}
          >
            {hasCriticalFailures ? 'Initiate FSMA 204 Recall' : 'Initiate Recall'}
          </Button>
        )}
      </div>
      
      {checks.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 border rounded-lg">
          <p className="text-gray-500">No CCP data available for this batch</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedChecks.map((check) => (
            <CCPNode
              key={check.id}
              check={check}
              onClick={() => onCCPClick(check)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CCPTimeline;
