
import React from 'react';
import { Button } from '@/components/ui/button';
import { CAPA } from '@/types/capa';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { isStatusEqual } from '@/services/capa/capaStatusService';

interface RecentCapaListProps {
  capas: CAPA[];
  showViewAll?: boolean;
}

const RecentCapaList: React.FC<RecentCapaListProps> = ({ capas, showViewAll = false }) => {
  const navigate = useNavigate();

  const handleView = (id: string) => {
    navigate(`/capa/${id}`);
  };

  const handleViewAll = () => {
    navigate('/capa');
  };

  if (capas.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground">No CAPAs found</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y">
        {capas.map((capa) => (
          <li 
            key={capa.id} 
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm truncate">{capa.title}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500">
                    {format(new Date(capa.created_at), 'MMM d, yyyy')}
                  </span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-sm capitalize">
                    {capa.source}
                  </span>
                  <span className="text-xs bg-gray-50 text-gray-700 px-2 py-0.5 rounded-sm">
                    {capa.priority}
                  </span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleView(capa.id)}
                className="text-xs"
              >
                View
              </Button>
            </div>
          </li>
        ))}
      </ul>
      
      {showViewAll && capas.length > 0 && (
        <div className="p-4 border-t text-center">
          <Button variant="link" onClick={handleViewAll}>
            View all CAPAs
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentCapaList;
