
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X, Filter, Check } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DocumentCategory, DocumentStatus, DocumentSearchFilters, ModuleReference } from '@/types/document';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface DocumentAdvancedFiltersProps {
  filters: DocumentSearchFilters;
  onFilterChange: (filters: DocumentSearchFilters) => void;
  onClearFilters: () => void;
}

export const DocumentAdvancedFilters: React.FC<DocumentAdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const [calendarOpen, setCalendarOpen] = useState<string | null>(null);
  
  // Helper for date format
  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'PPP');
  };
  
  // Category options
  const categoryOptions: DocumentCategory[] = [
    'SOP', 'Policy', 'Form', 'Certificate', 'Audit Report', 
    'HACCP Plan', 'Training Material', 'Supplier Documentation', 
    'Risk Assessment', 'Other'
  ];
  
  // Status options
  const statusOptions: DocumentStatus[] = [
    'Draft', 'Pending Approval', 'Approved', 'Published', 'Archived', 'Expired'
  ];
  
  // Module reference options
  const moduleOptions: ModuleReference[] = [
    'none', 'haccp', 'training', 'audits', 'suppliers', 'capa', 'traceability', 'non-conformance'
  ];
  
  // Handle category selection
  const handleCategoryChange = (category: DocumentCategory) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    onFilterChange({
      ...filters,
      categories: newCategories
    });
  };
  
  // Handle status selection
  const handleStatusChange = (status: DocumentStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    onFilterChange({
      ...filters,
      status: newStatuses
    });
  };
  
  // Handle module reference selection
  const handleModuleChange = (module: ModuleReference) => {
    const currentModules = filters.modules || [];
    const newModules = currentModules.includes(module)
      ? currentModules.filter(m => m !== module)
      : [...currentModules, module];
    
    onFilterChange({
      ...filters,
      modules: newModules
    });
  };
  
  // Handle calendar date selection
  const handleDateSelect = (date: Date | undefined, field: string) => {
    if (!date) return;
    
    const dateStr = date.toISOString();
    
    switch (field) {
      case 'createdStart':
        onFilterChange({ ...filters, createdStart: dateStr });
        break;
      case 'createdEnd':
        onFilterChange({ ...filters, createdEnd: dateStr });
        break;
      case 'updatedStart':
        onFilterChange({ ...filters, updatedStart: dateStr });
        break;
      case 'updatedEnd':
        onFilterChange({ ...filters, updatedEnd: dateStr });
        break;
      case 'expiryStart':
        onFilterChange({ ...filters, expiryStart: dateStr });
        break;
      case 'expiryEnd':
        onFilterChange({ ...filters, expiryEnd: dateStr });
        break;
    }
    
    setCalendarOpen(null);
  };
  
  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (filters.categories && filters.categories.length > 0) count++;
    if (filters.status && filters.status.length > 0) count++;
    if (filters.modules && filters.modules.length > 0) count++;
    if (filters.createdStart || filters.createdEnd) count++;
    if (filters.updatedStart || filters.updatedEnd) count++;
    if (filters.expiryStart || filters.expiryEnd) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    if (filters.createdBy && filters.createdBy.length > 0) count++;
    if (filters.approvedBy && filters.approvedBy.length > 0) count++;
    return count;
  };
  
  const activeFiltersCount = countActiveFilters();
  
  return (
    <Card className="border shadow-sm mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-muted-foreground" />
            <h3 className="font-medium">Advanced Filters</h3>
            {activeFiltersCount > 0 && (
              <Badge className="ml-2" variant="secondary">{activeFiltersCount} active</Badge>
            )}
          </div>
          
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Categories filter */}
          <div>
            <Label className="text-sm mb-1 block">Document Categories</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between text-left font-normal">
                  {filters.categories && filters.categories.length > 0 
                    ? `${filters.categories.length} selected`
                    : "Select categories"}
                  <Filter className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    <CommandGroup>
                      {categoryOptions.map(category => (
                        <CommandItem
                          key={category}
                          onSelect={() => handleCategoryChange(category)}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={cn(
                              "h-4 w-4 border rounded-sm flex items-center justify-center",
                              filters.categories?.includes(category) 
                                ? "bg-primary border-primary text-primary-foreground" 
                                : "border-input"
                            )}>
                              {filters.categories?.includes(category) && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                            <span>{category}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Status filter */}
          <div>
            <Label className="text-sm mb-1 block">Document Status</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between text-left font-normal">
                  {filters.status && filters.status.length > 0 
                    ? `${filters.status.length} selected`
                    : "Select status"}
                  <Filter className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search status..." />
                  <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    <CommandGroup>
                      {statusOptions.map(status => (
                        <CommandItem
                          key={status}
                          onSelect={() => handleStatusChange(status)}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={cn(
                              "h-4 w-4 border rounded-sm flex items-center justify-center",
                              filters.status?.includes(status) 
                                ? "bg-primary border-primary text-primary-foreground" 
                                : "border-input"
                            )}>
                              {filters.status?.includes(status) && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                            <span>{status}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Module References filter */}
          <div>
            <Label className="text-sm mb-1 block">Related Modules</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between text-left font-normal">
                  {filters.modules && filters.modules.length > 0 
                    ? `${filters.modules.length} selected`
                    : "Select modules"}
                  <Filter className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search modules..." />
                  <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    <CommandGroup>
                      {moduleOptions.map(module => (
                        <CommandItem
                          key={module}
                          onSelect={() => handleModuleChange(module)}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={cn(
                              "h-4 w-4 border rounded-sm flex items-center justify-center",
                              filters.modules?.includes(module) 
                                ? "bg-primary border-primary text-primary-foreground" 
                                : "border-input"
                            )}>
                              {filters.modules?.includes(module) && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                            <span className="capitalize">{module === 'none' ? 'No Module' : module}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Created date range */}
          <div className="space-y-1">
            <Label className="text-sm block">Created Date Range</Label>
            <div className="flex gap-2">
              <Popover open={calendarOpen === 'createdStart'} onOpenChange={(open) => open ? setCalendarOpen('createdStart') : setCalendarOpen(null)}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs w-full justify-start font-normal">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {filters.createdStart ? formatDate(filters.createdStart) : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    initialFocus
                    selected={filters.createdStart ? new Date(filters.createdStart) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'createdStart')}
                  />
                </PopoverContent>
              </Popover>
              
              <Popover open={calendarOpen === 'createdEnd'} onOpenChange={(open) => open ? setCalendarOpen('createdEnd') : setCalendarOpen(null)}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs w-full justify-start font-normal">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {filters.createdEnd ? formatDate(filters.createdEnd) : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    initialFocus
                    selected={filters.createdEnd ? new Date(filters.createdEnd) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'createdEnd')}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Updated date range */}
          <div className="space-y-1">
            <Label className="text-sm block">Last Updated Range</Label>
            <div className="flex gap-2">
              <Popover open={calendarOpen === 'updatedStart'} onOpenChange={(open) => open ? setCalendarOpen('updatedStart') : setCalendarOpen(null)}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs w-full justify-start font-normal">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {filters.updatedStart ? formatDate(filters.updatedStart) : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    initialFocus
                    selected={filters.updatedStart ? new Date(filters.updatedStart) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'updatedStart')}
                  />
                </PopoverContent>
              </Popover>
              
              <Popover open={calendarOpen === 'updatedEnd'} onOpenChange={(open) => open ? setCalendarOpen('updatedEnd') : setCalendarOpen(null)}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs w-full justify-start font-normal">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {filters.updatedEnd ? formatDate(filters.updatedEnd) : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    initialFocus
                    selected={filters.updatedEnd ? new Date(filters.updatedEnd) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'updatedEnd')}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Expiry date range */}
          <div className="space-y-1">
            <Label className="text-sm block">Expiry Date Range</Label>
            <div className="flex gap-2">
              <Popover open={calendarOpen === 'expiryStart'} onOpenChange={(open) => open ? setCalendarOpen('expiryStart') : setCalendarOpen(null)}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs w-full justify-start font-normal">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {filters.expiryStart ? formatDate(filters.expiryStart) : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    initialFocus
                    selected={filters.expiryStart ? new Date(filters.expiryStart) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'expiryStart')}
                  />
                </PopoverContent>
              </Popover>
              
              <Popover open={calendarOpen === 'expiryEnd'} onOpenChange={(open) => open ? setCalendarOpen('expiryEnd') : setCalendarOpen(null)}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs w-full justify-start font-normal">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {filters.expiryEnd ? formatDate(filters.expiryEnd) : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    initialFocus
                    selected={filters.expiryEnd ? new Date(filters.expiryEnd) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'expiryEnd')}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
