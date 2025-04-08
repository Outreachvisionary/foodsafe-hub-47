import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { NonConformance } from '@/types/non-conformance';

interface NCStatusInfoProps {
  nonConformance: NonConformance;
}

const NCStatusInfo: React.FC<NCStatusInfoProps> = ({ nonConformance: nc }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <Label className="text-sm font-medium">Status</Label>
          <p className="text-sm">{nc.status}</p>
        </div>

        {nc.review_date && (
          <div className="mt-2">
            <Label className="text-sm font-medium">Review Date</Label>
            <p className="text-sm">{new Date(nc.review_date).toLocaleDateString()}</p>
          </div>
        )}

        {nc.reviewer && (
          <div className="mt-2">
            <Label className="text-sm font-medium">Reviewer</Label>
            <p className="text-sm">{nc.reviewer}</p>
          </div>
        )}

        {nc.resolution_date && (
          <div className="mt-2">
            <Label className="text-sm font-medium">Resolution Date</Label>
            <p className="text-sm">{new Date(nc.resolution_date).toLocaleDateString()}</p>
          </div>
        )}

        {nc.resolution_details && (
          <div className="mt-2">
            <Label className="text-sm font-medium">Resolution Details</Label>
            <p className="text-sm">{nc.resolution_details}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NCStatusInfo;
