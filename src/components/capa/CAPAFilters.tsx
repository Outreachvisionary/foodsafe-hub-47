
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import { CAPAFilter } from '@/types/capa';
import { formatEnumValue } from '@/utils/typeAdapters';

interface CAPAFiltersProps {
  onFilterChange: (filters: CAPAFilter) => void;
  initialFilters?: CAPAFilter;
}

const CAPAFilters: React.FC<CAPAFiltersProps> = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState<CAPAFilter>(initialFilters);

  const updateFilter = (key: keyof CAPAFilter, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const removeFilter = (key: keyof CAPAFilter) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const toggleStatusFilter = (status: CAPAStatus) => {
    const currentStatuses = Array.isArray(filters.status) ? filters.status : 
                           filters.status ? [filters.status] : [];
    
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    updateFilter('status', newStatuses.length > 0 ? newStatuses : undefined);
  };

  const togglePriorityFilter = (priority: CAPAPriority) => {
    const currentPriorities = Array.isArray(filters.priority) ? filters.priority : 
                             filters.priority ? [filters.priority] : [];
    
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority];
    
    updateFilter('priority', newPriorities.length > 0 ? newPriorities : undefined);
  };

  const toggleSourceFilter = (source: CAPASource) => {
    const currentSources = Array.isArray(filters.source) ? filters.source : 
                          filters.source ? [filters.source] : [];
    
    const newSources = currentSources.includes(source)
      ? currentSources.filter(s => s !== source)
      : [...currentSources, source];
    
    updateFilter('source', newSources.length > 0 ? newSources : undefined);
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof CAPAFilter] !== undefined);
  const activeStatusFilters = Array.isArray(filters.status) ? filters.status : 
                             filters.status ? [filters.status] : [];
  const activePriorityFilters = Array.isArray(filters.priority) ? filters.priority : 
                               filters.priority ? [filters.priority] : [];
  const activeSourceFilters = Array.isArray(filters.source) ? filters.source : 
                             filters.source ? [filters.source] : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label>Search</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Search by title or description..."
              value={filters.searchTerm || ''}
              onChange={(e) => updateFilter('searchTerm', e.target.value || undefined)}
            />
            {filters.searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFilter('searchTerm')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Status Filters */}
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex flex-wrap gap-2">
            {Object.values(CAPAStatus).map((status) => (
              <Badge
                key={status}
                variant={activeStatusFilters.includes(status) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleStatusFilter(status)}
              >
                {formatEnumValue(status)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Priority Filters */}
        <div className="space-y-2">
          <Label>Priority</Label>
          <div className="flex flex-wrap gap-2">
            {Object.values(CAPAPriority).map((priority) => (
              <Badge
                key={priority}
                variant={activePriorityFilters.includes(priority) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => togglePriorityFilter(priority)}
              >
                {priority}
              </Badge>
            ))}
          </div>
        </div>

        {/* Source Filters */}
        <div className="space-y-2">
          <Label>Source</Label>
          <div className="flex flex-wrap gap-2">
            {Object.values(CAPASource).map((source) => (
              <Badge
                key={source}
                variant={activeSourceFilters.includes(source) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSourceFilter(source)}
              >
                {formatEnumValue(source)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Created Date From</Label>
            <Input
              type="date"
              value={filters.createdDateFrom || ''}
              onChange={(e) => updateFilter('createdDateFrom', e.target.value || undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label>Created Date To</Label>
            <Input
              type="date"
              value={filters.createdDateTo || ''}
              onChange={(e) => updateFilter('createdDateTo', e.target.value || undefined)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Due Date From</Label>
            <Input
              type="date"
              value={filters.dueDateFrom || ''}
              onChange={(e) => updateFilter('dueDateFrom', e.target.value || undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label>Due Date To</Label>
            <Input
              type="date"
              value={filters.dueDateTo || ''}
              onChange={(e) => updateFilter('dueDateTo', e.target.value || undefined)}
            />
          </div>
        </div>

        {/* Assigned To Filter */}
        <div className="space-y-2">
          <Label>Assigned To</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter assignee name..."
              value={Array.isArray(filters.assignedTo) ? filters.assignedTo.join(', ') : filters.assignedTo || ''}
              onChange={(e) => updateFilter('assignedTo', e.target.value || undefined)}
            />
            {filters.assignedTo && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFilter('assignedTo')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Department Filter */}
        <div className="space-y-2">
          <Label>Department</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter department..."
              value={Array.isArray(filters.department) ? filters.department.join(', ') : filters.department || ''}
              onChange={(e) => updateFilter('department', e.target.value || undefined)}
            />
            {filters.department && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFilter('department')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAFilters;
