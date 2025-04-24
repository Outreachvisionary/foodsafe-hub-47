
import React from 'react';
import { CAPA } from '@/types/capa';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Clock } from 'lucide-react';
import { isStatusEqual } from '@/services/capa/capaStatusService';
import { Link } from 'react-router-dom';

interface RecentCapaListProps {
  capas: CAPA[];
  showViewAll?: boolean;
}

const RecentCapaList: React.FC<RecentCapaListProps> = ({ capas, showViewAll = false }) => {
  if (!capas || capas.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-md border">
        <p className="text-gray-500">No recent CAPAs to display</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    if (isStatusEqual(status, 'Open')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (isStatusEqual(status, 'In Progress')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (isStatusEqual(status, 'Closed') || isStatusEqual(status, 'Verified')) return 'bg-green-100 text-green-800 border-green-200';
    if (isStatusEqual(status, 'Overdue')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="divide-y">
      {capas.map(capa => (
        <div key={capa.id} className="p-3 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-sm">{capa.title}</h4>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                Created {formatDate(capa.createdAt)}
                {capa.dueDate && <span className="ml-2">• Due {formatDate(capa.dueDate)}</span>}
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${getStatusColor(capa.status)}`}
            >
              {capa.status}
            </Badge>
          </div>
        </div>
      ))}

      {showViewAll && (
        <div className="p-3">
          <Link to="/capa">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              View all CAPAs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentCapaList;
