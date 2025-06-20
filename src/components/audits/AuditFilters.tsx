
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface AuditFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  stats: {
    total: number;
    scheduled: number;
    inProgress: number;
    completed: number;
  };
}

const AuditFilters: React.FC<AuditFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  stats
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audits..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              onClick={() => onStatusChange('all')}
            >
              All ({stats.total})
            </Button>
            <Button 
              variant={selectedStatus === 'Scheduled' ? 'default' : 'outline'}
              onClick={() => onStatusChange('Scheduled')}
            >
              Scheduled ({stats.scheduled})
            </Button>
            <Button 
              variant={selectedStatus === 'In Progress' ? 'default' : 'outline'}
              onClick={() => onStatusChange('In Progress')}
            >
              In Progress ({stats.inProgress})
            </Button>
            <Button 
              variant={selectedStatus === 'Completed' ? 'default' : 'outline'}
              onClick={() => onStatusChange('Completed')}
            >
              Completed ({stats.completed})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditFilters;
