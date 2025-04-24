
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LinkedCAPAsListProps {
  capaId?: string;
}

export const LinkedCAPAsList: React.FC<LinkedCAPAsListProps> = ({ capaId }) => {
  const navigate = useNavigate();
  
  const handleViewCapa = () => {
    if (capaId) {
      navigate(`/capa/${capaId}`);
    }
  };

  if (!capaId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Linked CAPAs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No CAPAs linked to this record</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked CAPAs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-3 border rounded-md bg-blue-50 border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                <h4 className="font-medium text-sm">CAPA #{capaId}</h4>
              </div>
              <div className="mt-1 text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>Created on 2023-10-10</span>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={handleViewCapa}>
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
