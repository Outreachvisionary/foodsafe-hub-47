
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LinkedCAPAsListProps {
  capaIds: string[];
}

export const LinkedCAPAsList: React.FC<LinkedCAPAsListProps> = ({ capaIds }) => {
  if (!capaIds || capaIds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Linked CAPAs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No CAPAs linked to this non-conformance</p>
        </CardContent>
      </Card>
    );
  }

  // Sample CAPA data - in a real app, this would be fetched
  const capas = capaIds.map(id => ({
    id,
    title: `CAPA for ${id}`,
    status: ['Open', 'In_Progress', 'Closed'][Math.floor(Math.random() * 3)] as 'Open' | 'In_Progress' | 'Closed',
    priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low'
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'In_Progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Closed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-yellow-100 text-yellow-800';
      case 'In_Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Linked CAPAs</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {capas.map(capa => (
            <li key={capa.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
              <div className="flex flex-col">
                <span className="font-medium">{capa.title}</span>
                <div className="flex items-center mt-1 space-x-2">
                  <Badge className={getStatusColor(capa.status)}>
                    {getStatusIcon(capa.status)}
                    <span className="ml-1">{capa.status.replace('_', ' ')}</span>
                  </Badge>
                  <Badge variant="outline">{capa.priority}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/capa/${capa.id}`}>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LinkedCAPAsList;
