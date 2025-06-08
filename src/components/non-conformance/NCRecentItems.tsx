import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';
import { NCStatus } from '@/types/enums';
import { stringToNCStatus } from '@/utils/typeAdapters';

interface NCItem {
  id: string;
  title: string;
  status: string;
  reportedDate: string;
}

const mockData: NCItem[] = [
  {
    id: 'NC-2023-001',
    title: 'Damaged Packaging',
    status: NCStatus.On_Hold,
    reportedDate: '2023-11-15',
  },
  {
    id: 'NC-2023-002',
    title: 'Temperature Excursion',
    status: NCStatus.Under_Review,
    reportedDate: '2023-11-14',
  },
  {
    id: 'NC-2023-003',
    title: 'Incorrect Labeling',
    status: NCStatus.Released,
    reportedDate: '2023-11-13',
  },
];

const NCRecentItems: React.FC = () => {
  const getStatusColor = (statusString: string) => {
    const status = stringToNCStatus(statusString);
    switch (status) {
      case NCStatus.On_Hold:
        return 'bg-red-100 text-red-800';
      case NCStatus.Under_Review:
        return 'bg-yellow-100 text-yellow-800';
      case NCStatus.Released:
        return 'bg-green-100 text-green-800';
      case NCStatus.Disposed:
        return 'bg-gray-100 text-gray-800';
      case NCStatus.Resolved:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Non-Conformances</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockData.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{item.title}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                Reported: {item.reportedDate}
              </div>
            </div>
            <Badge className={`font-normal ${getStatusColor(item.status)}`}>
              {item.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NCRecentItems;
