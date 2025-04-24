
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { CAPA } from '@/types/capa';
import { CAPAStatusBadge } from './CAPAStatusBadge';
import { isStatusEqual } from '@/services/capa/capaStatusService';

interface RecentCapaListProps {
  capas: CAPA[];
  maxItems?: number;
  showViewAll?: boolean;
}

const RecentCapaList: React.FC<RecentCapaListProps> = ({ 
  capas, 
  maxItems = 5, 
  showViewAll = true
}) => {
  const navigate = useNavigate();
  
  // Take only the first maxItems
  const displayCapas = capas.slice(0, maxItems);
  
  const viewCapa = (id: string) => {
    navigate(`/capa/${id}`);
  };
  
  const viewAllCapas = () => {
    navigate('/capa');
  };
  
  if (displayCapas.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent CAPAs</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 text-gray-500">
          No recent CAPAs found
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent CAPAs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayCapas.map((capa) => (
            <div 
              key={capa.id} 
              className="p-4 hover:bg-gray-50 cursor-pointer" 
              onClick={() => viewCapa(capa.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{capa.title}</h3>
                    {capa.dueDate && new Date(capa.dueDate) < new Date() && 
                      !isStatusEqual(capa.status, 'Closed') && !isStatusEqual(capa.status, 'Verified') && (
                      <AlertCircle className="h-4 w-4 text-red-500" title="Overdue" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <CAPAStatusBadge status={capa.status} showIcon={false} />
                    <span className="text-xs text-gray-500">
                      {format(new Date(capa.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
        
        {showViewAll && capas.length > maxItems && (
          <div className="p-3 border-t text-center">
            <Button variant="ghost" size="sm" onClick={viewAllCapas}>
              View All CAPAs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentCapaList;
