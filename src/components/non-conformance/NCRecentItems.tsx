
import React from 'react';
import { NonConformance } from '@/types/non-conformance';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronRight, Clock, CheckCircle, Trash2 } from 'lucide-react';

interface NCRecentItemsProps {
  items: NonConformance[];
  onViewDetails: (id: string) => void;
}

const NCRecentItems: React.FC<NCRecentItemsProps> = ({ items, onViewDetails }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Hold':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'Under Review':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Released':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Disposed':
        return <Trash2 className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Hold':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Released':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Disposed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">No non-conformance items found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(item.reported_date).toLocaleDateString()}
                </div>
                <div className="mt-2 text-xs text-gray-600 line-clamp-1">
                  {item.item_name} ({item.item_category})
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline" className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <Badge variant="outline">{item.reason_category}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(item.id)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NCRecentItems;
