
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CAPA } from '@/types/capa';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Eye, AlertTriangle } from 'lucide-react';

interface RecentCapaListProps {
  items: CAPA[];
}

const RecentCapaList: React.FC<RecentCapaListProps> = ({ items }) => {
  const navigate = useNavigate();
  
  const handleViewCAPA = (id: string) => {
    navigate(`/capa/${id}`);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No recent CAPAs found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((capa) => (
        <div key={capa.id} className="flex items-start justify-between p-3 border rounded-md hover:bg-gray-50">
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm">{capa.title}</h3>
              {new Date(capa.dueDate) < new Date() && capa.status !== 'closed' && capa.status !== 'verified' && (
                <AlertTriangle className="h-3 w-3 text-red-500" />
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {capa.status.replace('-', ' ')}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {capa.priority}
              </Badge>
            </div>
            
            <div className="mt-1 text-xs text-gray-500">
              Due: {format(new Date(capa.dueDate), 'MMM d, yyyy')}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleViewCAPA(capa.id)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        </div>
      ))}
    </div>
  );
};

export default RecentCapaList;
