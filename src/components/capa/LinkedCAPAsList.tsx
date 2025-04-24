
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { CAPA } from '@/types/capa';
import { CAPAStatusBadge } from './CAPAStatusBadge';

interface LinkedCAPAsListProps {
  caption?: string;
  capas: CAPA[];
  showViewAll?: boolean;
  sourceType?: string;
  emptyMessage?: string;
}

const LinkedCAPAsList: React.FC<LinkedCAPAsListProps> = ({
  caption = 'Related CAPAs',
  capas,
  showViewAll = true,
  sourceType,
  emptyMessage = 'No CAPAs found'
}) => {
  const navigate = useNavigate();

  const viewCapa = (id: string) => {
    navigate(`/capa/${id}`);
  };
  
  const viewAllCapas = () => {
    if (sourceType) {
      navigate(`/capa?source=${sourceType}`);
    } else {
      navigate(`/capa`);
    }
  };

  if (!capas || capas.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{caption}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 text-gray-500">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{caption}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {capas.map((capa) => (
            <div key={capa.id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => viewCapa(capa.id)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm">{capa.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{capa.description}</p>
                  <div className="flex gap-2 mt-2">
                    <CAPAStatusBadge status={capa.status} showIcon={false} />
                    {capa.source && (
                      <Badge variant="outline" className="text-xs">
                        {capa.source}
                      </Badge>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
        {showViewAll && capas.length > 0 && (
          <div className="p-3 border-t text-center">
            <Button variant="ghost" size="sm" onClick={viewAllCapas}>
              View All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedCAPAsList;
