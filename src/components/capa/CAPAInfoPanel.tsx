
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { CAPA } from '@/types/capa';
import { formatEnumValue } from '@/utils/typeAdapters';
import { CAPAStatusBadge } from './CAPAStatusBadge';

interface CAPAInfoPanelProps {
  capa: CAPA;
}

const CAPAInfoPanel: React.FC<CAPAInfoPanelProps> = ({ capa }) => {
  // Check if date is overdue
  const isOverdue = capa.due_date && new Date(capa.due_date) < new Date();
  
  // Format date to readable string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Get initials for the avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{capa.title}</CardTitle>
          <CAPAStatusBadge status={capa.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p>{capa.description}</p>
          </div>
          
          {/* Priority and Source */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
              <Badge 
                className={`
                  ${capa.priority === 'High' || capa.priority === 'Critical' ? 
                    'bg-red-100 text-red-800' : 
                    capa.priority === 'Medium' ? 
                      'bg-amber-100 text-amber-800' : 
                      'bg-blue-100 text-blue-800'}
                `}
              >
                {formatEnumValue(capa.priority.toString())}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Source</h3>
              <Badge variant="outline">
                {formatEnumValue(capa.source.toString())}
              </Badge>
              {capa.source_id && (
                <span className="text-xs text-muted-foreground ml-1">
                  (ID: {capa.source_id})
                </span>
              )}
            </div>
          </div>
          
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                {formatDate(capa.created_at)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
              <div className="flex items-center">
                <ClockIcon className={`h-4 w-4 mr-1 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} />
                <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                  {formatDate(capa.due_date)}
                </span>
                {isOverdue && <AlertCircleIcon className="h-4 w-4 text-red-500 ml-1" />}
              </div>
            </div>
          </div>
          
          {/* Completion and verification dates if available */}
          {(capa.completion_date || capa.verified_date) && (
            <div className="grid grid-cols-2 gap-4">
              {capa.completion_date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Completed</h3>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                    {formatDate(capa.completion_date)}
                  </div>
                </div>
              )}
              {capa.verified_date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Verified</h3>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                    {formatDate(capa.verified_date)}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Department and Assignment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Department</h3>
              <Badge variant="outline" className="bg-gray-50">
                {capa.department || 'Not assigned'}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned To</h3>
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback className="text-xs">
                    {getInitials(capa.assigned_to)}
                  </AvatarFallback>
                </Avatar>
                {capa.assigned_to}
              </div>
            </div>
          </div>
          
          {/* FSMA 204 Compliance */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">FSMA 204 Compliant</h3>
            <Badge 
              variant="outline" 
              className={capa.fsma204_compliant ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}
            >
              {capa.fsma204_compliant ? 'Yes' : 'No'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAInfoPanel;
