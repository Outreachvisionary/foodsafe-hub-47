
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NonConformance } from '@/types/non-conformance';

interface NCStatusInfoProps {
  nonConformance: NonConformance;
}

const NCStatusInfo: React.FC<NCStatusInfoProps> = ({ nonConformance }) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = () => {
    switch (nonConformance.status) {
      case 'On Hold':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Released':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Disposed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Resolved':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
          <div className={`mt-1 px-3 py-1 rounded-full border inline-block ${getStatusClass()}`}>
            {nonConformance.status}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Reported Date</h3>
          <p>{formatDate(nonConformance.reported_date)}</p>
        </div>
        
        {nonConformance.review_date && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Review Date</h3>
            <p>{formatDate(nonConformance.review_date)}</p>
          </div>
        )}
        
        {nonConformance.resolution_date && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Resolution Date</h3>
            <p>{formatDate(nonConformance.resolution_date)}</p>
          </div>
        )}
        
        <div className="border-t pt-4 mt-4">
          <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
          <p>{nonConformance.assigned_to || 'Not assigned'}</p>
        </div>
        
        {nonConformance.reviewer && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Reviewer</h3>
            <p>{nonConformance.reviewer}</p>
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Created By</h3>
          <p>{nonConformance.created_by}</p>
        </div>
        
        {nonConformance.location && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p>{nonConformance.location}</p>
          </div>
        )}
        
        {nonConformance.department && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Department</h3>
            <p>{nonConformance.department}</p>
          </div>
        )}
        
        {nonConformance.priority && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Priority</h3>
            <p>{nonConformance.priority}</p>
          </div>
        )}
        
        {nonConformance.risk_level && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Risk Level</h3>
            <p>{nonConformance.risk_level}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NCStatusInfo;
