
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, X } from 'lucide-react';
import { OrganizationType } from './OrganizationTypeSelector';

interface OrganizationFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filters: {
    types: OrganizationType[];
    statuses: ('active' | 'inactive')[];
  };
  setFilters: (filters: {
    types: OrganizationType[];
    statuses: ('active' | 'inactive')[];
  }) => void;
  onClearFilters: () => void;
}

const OrganizationFilters: React.FC<OrganizationFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  onClearFilters
}) => {
  const organizationTypes: OrganizationType[] = [
    'Food Manufacturer',
    'Distributor',
    'Restaurant',
    'Hotel',
    'Catering',
    'Retail',
    'Other'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const hasActiveFilters = Boolean(
    (filters.types && filters.types.length > 0) ||
    (filters.statuses && filters.statuses.length > 0) ||
    searchTerm
  );

  return (
    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <form onSubmit={handleSearch} className="flex w-full md:w-1/3 items-center space-x-2">
        <Input
          placeholder="Search organizations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <Button type="submit" variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Type
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {organizationTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={filters.types?.includes(type)}
                onCheckedChange={(checked) => {
                  setFilters({
                    ...filters,
                    types: checked 
                      ? [...(filters.types || []), type] 
                      : filters.types?.filter(t => t !== type) || []
                  });
                }}
              >
                {type}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(['active', 'inactive'] as const).map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={filters.statuses?.includes(status)}
                onCheckedChange={(checked) => {
                  setFilters({
                    ...filters,
                    statuses: checked 
                      ? [...(filters.statuses || []), status] 
                      : filters.statuses?.filter(s => s !== status) || []
                  });
                }}
              >
                {status === 'active' ? 'Active' : 'Inactive'}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrganizationFilters;
