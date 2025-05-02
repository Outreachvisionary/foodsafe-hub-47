
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { NonConformance, NCStatus } from '@/types/non-conformance';
import { Badge } from '@/components/ui/badge';
import { stringToNCStatus, ncStatusToString } from '@/utils/typeAdapters';

interface NCRecentItemsProps {
  items: NonConformance[];
  loading: boolean;
  onItemClick: (itemId: string) => void;
}

const NCRecentItems: React.FC<NCRecentItemsProps> = ({ items, loading, onItemClick }) => {
  const getStatusBadgeColor = (status: string): string => {
    const statusStr = status.toString();
    
    switch(statusStr) {
      case 'On Hold':
      case NCStatus.OnHold:
        return 'bg-orange-100 text-orange-800';
      case 'Open':
      case NCStatus.Open:
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
      case NCStatus.UnderReview:
        return 'bg-purple-100 text-purple-800';
      case 'In Progress':
      case NCStatus.InProgress:
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
      case 'Completed':
      case NCStatus.Resolved:
      case NCStatus.Completed:
        return 'bg-green-100 text-green-800';
      case 'Closed':
      case NCStatus.Closed:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card className="h-full w-full">
        <CardHeader>
          <CardTitle>Recent Non-Conformances</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Loading recent items...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Recent Non-Conformances</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => {
              // Convert string status to NCStatus enum for display
              const statusEnum = stringToNCStatus(item.status);
              
              return (
                <div 
                  key={item.id}
                  className="flex justify-between items-start p-3 border rounded-md cursor-pointer hover:bg-muted/50"
                  onClick={() => onItemClick(item.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getStatusBadgeColor(item.status)}>
                        {ncStatusToString(statusEnum)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.reported_date)}
                      </span>
                    </div>
                    <p className="font-medium line-clamp-1">{item.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.item_name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No recent non-conformances</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NCRecentItems;
