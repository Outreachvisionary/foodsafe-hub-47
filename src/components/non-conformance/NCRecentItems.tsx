
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NonConformance, NCStatus } from '@/types/non-conformance';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, CheckCircle, Trash2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface NCRecentItemsProps {
  items: NonConformance[];
  limit?: number;
}

const NCRecentItems: React.FC<NCRecentItemsProps> = ({ items, limit = 5 }) => {
  const navigate = useNavigate();
  const displayItems = items.slice(0, limit);
  
  const getStatusBadge = (status: NCStatus) => {
    switch (status) {
      case 'On Hold':
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            On Hold
          </Badge>
        );
      case 'Under Review':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Under Review
          </Badge>
        );
      case 'Released':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Released
          </Badge>
        );
      case 'Disposed':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 flex items-center gap-1">
            <Trash2 className="h-3 w-3" />
            Disposed
          </Badge>
        );
    }
  };
  
  if (displayItems.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No non-conformance items found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {displayItems.map((item) => (
        <div 
          key={item.id} 
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="space-y-2 mb-3 sm:mb-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="font-medium text-foreground">{item.title}</h3>
              {getStatusBadge(item.status)}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
              <span>{item.item_name}</span>
              <span>{item.item_category}</span>
              <span>Reported: {format(new Date(item.reported_date), 'MMM d, yyyy')}</span>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="self-end sm:self-center"
            onClick={() => navigate(`/non-conformance/${item.id}`)}
          >
            View <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default NCRecentItems;
