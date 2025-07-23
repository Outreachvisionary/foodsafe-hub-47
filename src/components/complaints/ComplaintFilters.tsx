import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface ComplaintFiltersProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  stats?: {
    total: number;
    new: number;
    investigating: number;
    resolved: number;
    escalated?: number;
  };
  onFilterChange?: (filters: any) => void;
  onFilterClear?: () => void;
}

const ComplaintFilters: React.FC<ComplaintFiltersProps> = ({
  searchTerm = '',
  onSearchChange,
  selectedStatus = 'all',
  onStatusChange,
  stats = { total: 0, new: 0, investigating: 0, resolved: 0 },
  onFilterChange,
  onFilterClear
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              onClick={() => onStatusChange?.('all')}
              size="sm"
            >
              All ({stats.total})
            </Button>
            <Button 
              variant={selectedStatus === 'New' ? 'default' : 'outline'}
              onClick={() => onStatusChange?.('New')}
              size="sm"
            >
              New ({stats.new})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplaintFilters;