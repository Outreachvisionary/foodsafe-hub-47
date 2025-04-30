
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, User, Tag, Layers, AlertTriangle } from 'lucide-react';
import { CAPA } from '@/types/capa';
import { format } from 'date-fns';

interface CAPAInfoPanelProps {
  capa: CAPA;
}

const CAPAInfoPanel: React.FC<CAPAInfoPanelProps> = ({ capa }) => {
  const isPastDue = capa.due_date && new Date(capa.due_date) < new Date();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">CAPA Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isPastDue && !capa.completion_date && (
          <div className="bg-red-50 border border-red-100 text-red-800 rounded-md p-3 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            <div>
              <p className="font-medium">Past Due</p>
              <p className="text-sm">This CAPA is past its due date.</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <div>
            <span className="text-muted-foreground mr-1">Created:</span>
            {format(new Date(capa.created_at), 'MMMM d, yyyy')}
          </div>
        </div>
        
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <div>
            <span className="text-muted-foreground mr-1">Due:</span>
            {capa.due_date ? format(new Date(capa.due_date), 'MMMM d, yyyy') : 'Not set'}
          </div>
        </div>
        
        {capa.completion_date && (
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <span className="text-muted-foreground mr-1">Completed:</span>
              {format(new Date(capa.completion_date), 'MMMM d, yyyy')}
            </div>
          </div>
        )}
        
        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <div>
            <span className="text-muted-foreground mr-1">Created by:</span>
            {capa.created_by}
          </div>
        </div>
        
        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <div>
            <span className="text-muted-foreground mr-1">Assigned to:</span>
            {capa.assigned_to || 'Unassigned'}
          </div>
        </div>
        
        <div className="flex items-center text-sm">
          <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
          <div>
            <span className="text-muted-foreground mr-1">Department:</span>
            {capa.department || 'Not specified'}
          </div>
        </div>
        
        <div className="flex items-center text-sm">
          <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
          <div>
            <span className="text-muted-foreground mr-1">FSMA 204:</span>
            {capa.fsma204_compliant ? 'Compliant' : 'Not applicable'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAInfoPanel;
