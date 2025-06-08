
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { NonConformance } from '@/types/non-conformance';
import { formatEnumValue } from '@/utils/typeAdapters';

interface NCRecentItemsProps {
  items: NonConformance[];
}

const NCRecentItems: React.FC<NCRecentItemsProps> = ({ items }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'On Hold':
        return 'secondary';
      case 'Under Review':
        return 'outline';
      case 'Resolved':
        return 'default';
      case 'Closed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Non-Conformances
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recent non-conformances found.
            </p>
          ) : (
            items.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.item_name} • {formatDate(item.reported_date)}
                  </p>
                </div>
                <Badge variant={getStatusVariant(item.status as string)}>
                  {formatEnumValue(item.status as string)}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NCRecentItems;
