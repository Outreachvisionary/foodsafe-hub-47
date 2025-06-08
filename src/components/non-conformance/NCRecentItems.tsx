
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Tag, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NonConformance } from '@/types/non-conformance';
import { NCStatus } from '@/types/enums';
import NCStatusBadge from './NCStatusBadge';

interface NCRecentItemsProps {
  items: Array<NonConformance | { id: string; title: string; status: string; createdAt: string; assignedTo: string; }>;
}

const NCRecentItems: React.FC<NCRecentItemsProps> = ({ items = [] }) => {
  const navigate = useNavigate();
  
  if (items.length === 0) {
    return (
      <div className="p-6 text-center border rounded-md">
        <p className="text-muted-foreground">No recent non-conformance items found.</p>
      </div>
    );
  }

  const viewDetails = (id: string) => {
    navigate(`/non-conformance/${id}`);
  };

  const isNonConformance = (item: any): item is NonConformance => {
    return 'reported_date' in item;
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="p-4 border rounded-md hover:bg-muted/10 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {isNonConformance(item) ? item.description : ''}
              </p>
            </div>
            <NCStatusBadge status={item.status} />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {isNonConformance(item) 
                ? formatDistanceToNow(new Date(item.reported_date), { addSuffix: true })
                : formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </span>
            
            {isNonConformance(item) && item.item_category && (
              <span className="flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                {item.item_category.toString()}
              </span>
            )}
            
            {item.status === NCStatus.Resolved || item.status === NCStatus.Closed ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Resolved
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Active
              </Badge>
            )}
          </div>
          
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => viewDetails(item.id)}
            >
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NCRecentItems;
