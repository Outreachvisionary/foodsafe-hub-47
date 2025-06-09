
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, User, AlertTriangle } from 'lucide-react';
import { CAPA, CAPAListProps } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';
import { formatEnumValue } from '@/utils/typeAdapters';
import { CAPAStatusBadge } from './CAPAStatusBadge';

const CAPAList: React.FC<CAPAListProps> = ({ 
  items = [], 
  loading = false, 
  error = null, 
  onCAPAClick 
}) => {
  // Use items as the primary prop, with capas as fallback for backwards compatibility
  const capaItems = items;

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: CAPAStatus) => {
    switch (status) {
      case CAPAStatus.Open:
        return 'text-blue-600';
      case CAPAStatus.In_Progress:
        return 'text-amber-600';
      case CAPAStatus.Pending_Verification:
        return 'text-purple-600';
      case CAPAStatus.Closed:
        return 'text-gray-600';
      case CAPAStatus.Cancelled:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const isOverdue = (dueDate: string, status: CAPAStatus) => {
    const due = new Date(dueDate);
    const now = new Date();
    return due < now && status !== CAPAStatus.Closed;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading CAPAs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (capaItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No CAPAs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {capaItems.map((capa) => (
        <Card key={capa.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{capa.title}</CardTitle>
                  {isOverdue(capa.due_date, capa.status) && (
                    <Badge variant="destructive" className="text-xs">
                      Overdue
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {capa.description}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getPriorityColor(capa.priority)}`}
                >
                  {capa.priority}
                </Badge>
                <CAPAStatusBadge status={capa.status} />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{capa.assigned_to}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {new Date(capa.due_date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium">Source:</span> {formatEnumValue(capa.source)}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCAPAClick?.(capa)}
                className="ml-2"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CAPAList;
