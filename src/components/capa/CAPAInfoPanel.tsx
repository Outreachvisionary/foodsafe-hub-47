
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CAPA } from '@/types/capa';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, User } from 'lucide-react';
import { format } from 'date-fns';
import { formatEnumValue } from '@/utils/typeAdapters';

interface CAPAInfoPanelProps {
  capa: CAPA;
}

const CAPAInfoPanel: React.FC<CAPAInfoPanelProps> = ({ capa }) => {
  // Function to check if the CAPA is overdue
  const isOverdue = () => {
    if (!capa.due_date) return false;
    
    const dueDate = new Date(capa.due_date);
    const today = new Date();
    
    return dueDate < today;
  };

  // Function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <p className="text-sm font-medium">Due Date</p>
              <p className={`text-sm ${isOverdue() ? 'text-red-600 font-semibold' : ''}`}>
                {formatDate(capa.due_date)}
                {isOverdue() && (
                  <span className="ml-2">
                    <Badge variant="destructive" className="text-xs">Overdue</Badge>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm">{formatDate(capa.created_at)}</p>
            </div>
          </div>
          
          {capa.completion_date && (
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-sm">{formatDate(capa.completion_date)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <p className="text-sm font-medium">Priority</p>
              <p className="text-sm">{formatEnumValue(capa.priority.toString())}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <p className="text-sm font-medium">Assigned To</p>
              <p className="text-sm">{capa.assigned_to || 'Not assigned'}</p>
            </div>
          </div>
        </div>
        
        {capa.department && (
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium">Department</p>
              <p className="text-sm">{capa.department}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center">
          <div>
            <p className="text-sm font-medium">Source</p>
            <p className="text-sm">{formatEnumValue(capa.source.toString())}</p>
          </div>
        </div>
        
        {capa.source_id && (
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium">Source Reference</p>
              <p className="text-sm">{capa.source_id}</p>
            </div>
          </div>
        )}
        
        {capa.fsma204_compliant !== undefined && (
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium">FSMA 204 Compliant</p>
              <p className="text-sm">{capa.fsma204_compliant ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPAInfoPanel;
