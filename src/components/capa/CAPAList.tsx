
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, User, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
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
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 shadow-sm';
      case 'high':
        return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300 shadow-sm';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300 shadow-sm';
      case 'low':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300 shadow-sm';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300 shadow-sm';
    }
  };

  const isOverdue = (dueDate: string, status: CAPAStatus) => {
    const due = new Date(dueDate);
    const now = new Date();
    return due < now && status !== CAPAStatus.Closed;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-muted-foreground font-medium">Loading CAPAs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (capaItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No CAPAs found</h3>
          <p className="text-gray-500">Create your first CAPA to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {capaItems.map((capa) => {
        const daysUntilDue = getDaysUntilDue(capa.due_date);
        const isOverdueItem = isOverdue(capa.due_date, capa.status);
        
        return (
          <Card 
            key={capa.id} 
            className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white hover:bg-gradient-to-r hover:from-white hover:to-blue-50 group cursor-pointer"
            onClick={() => onCAPAClick?.(capa)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {capa.title}
                    </CardTitle>
                    {isOverdueItem && (
                      <Badge variant="destructive" className="text-xs font-medium shadow-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        Overdue
                      </Badge>
                    )}
                    {!isOverdueItem && daysUntilDue <= 7 && daysUntilDue > 0 && (
                      <Badge variant="outline" className="text-xs font-medium bg-yellow-50 text-yellow-700 border-yellow-300">
                        <Clock className="h-3 w-3 mr-1" />
                        Due in {daysUntilDue} days
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {capa.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium ${getPriorityColor(capa.priority)}`}
                  >
                    {capa.priority}
                  </Badge>
                  <CAPAStatusBadge status={capa.status} size="sm" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{capa.assigned_to}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Due: {formatDate(capa.due_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Source:</span> 
                    <span className="text-gray-700">{formatEnumValue(capa.source)}</span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCAPAClick?.(capa);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CAPAList;
