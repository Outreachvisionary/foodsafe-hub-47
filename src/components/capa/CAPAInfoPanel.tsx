
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CAPA } from '@/types/capa';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface CAPAInfoPanelProps {
  capa: CAPA;
}

const CAPAInfoPanel: React.FC<CAPAInfoPanelProps> = ({ capa }) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">CAPA Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID:</span>
            <span className="font-medium">{capa.id?.substring(0, 8)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Priority:</span>
            <Badge variant="outline">{capa.priority}</Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Source:</span>
            <span className="font-medium">{capa.source}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span>{formatDate(capa.created_at)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Due Date:</span>
            <span>{formatDate(capa.due_date)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Assigned To:</span>
            <span>{capa.assigned_to || 'Unassigned'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Completion:</span>
            <span>{formatDate(capa.completion_date)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Department:</span>
            <span>{capa.department || 'Not specified'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">FSMA 204:</span>
            <span>{capa.fsma204_compliant ? 'Compliant' : 'Not compliant'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAInfoPanel;
