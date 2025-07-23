import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Filter, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';

interface AdvancedFilters {
  status: CAPAStatus[];
  priority: CAPAPriority[];
  source: CAPASource[];
  assignedTo: string[];
  department: string[];
  riskLevel: string[];
  complianceStandard: string[];
  effectivenessRating: string[];
  dateCreatedFrom?: Date;
  dateCreatedTo?: Date;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  completionDateFrom?: Date;
  completionDateTo?: Date;
  isOverdue: boolean;
  hasRiskAssessment: boolean;
  hasRootCauseAnalysis: boolean;
  fsmaCompliant: boolean;
  textSearch: string;
  costRange: {
    min?: number;
    max?: number;
  };
}

interface CAPAAdvancedFiltersProps {
  onFiltersChange: (filters: AdvancedFilters) => void;
  availableUsers?: string[];
  availableDepartments?: string[];
}

const CAPAAdvancedFilters: React.FC<CAPAAdvancedFiltersProps> = ({
  onFiltersChange,
  availableUsers = [],
  availableDepartments = []
}) => {
  const [filters, setFilters] = useState<AdvancedFilters>({
    status: [],
    priority: [],
    source: [],
    assignedTo: [],
    department: [],
    riskLevel: [],
    complianceStandard: [],
    effectivenessRating: [],
    isOverdue: false,
    hasRiskAssessment: false,
    hasRootCauseAnalysis: false,
    fsmaCompliant: false,
    textSearch: '',
    costRange: {}
  });

  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = <K extends keyof AdvancedFilters>(
    key: K,
    value: AdvancedFilters[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = <K extends keyof AdvancedFilters>(
    key: K,
    value: string
  ) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray as AdvancedFilters[K]);
  };

  const clearFilters = () => {
    const clearedFilters: AdvancedFilters = {
      status: [],
      priority: [],
      source: [],
      assignedTo: [],
      department: [],
      riskLevel: [],
      complianceStandard: [],
      effectivenessRating: [],
      isOverdue: false,
      hasRiskAssessment: false,
      hasRootCauseAnalysis: false,
      fsmaCompliant: false,
      textSearch: '',
      costRange: {}
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    count += filters.status.length;
    count += filters.priority.length;
    count += filters.source.length;
    count += filters.assignedTo.length;
    count += filters.department.length;
    count += filters.riskLevel.length;
    count += filters.complianceStandard.length;
    count += filters.effectivenessRating.length;
    if (filters.dateCreatedFrom || filters.dateCreatedTo) count++;
    if (filters.dueDateFrom || filters.dueDateTo) count++;
    if (filters.completionDateFrom || filters.completionDateTo) count++;
    if (filters.isOverdue) count++;
    if (filters.hasRiskAssessment) count++;
    if (filters.hasRootCauseAnalysis) count++;
    if (filters.fsmaCompliant) count++;
    if (filters.textSearch) count++;
    if (filters.costRange.min || filters.costRange.max) count++;
    return count;
  };

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
            {getActiveFilterCount() > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 text-xs">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[800px] p-0" align="start">
          <Card className="border-0 shadow-none">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Advanced Filters</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button size="sm" onClick={() => setIsOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Text Search */}
              <div className="space-y-2">
                <Label>Text Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search in title, description, root cause..."
                    value={filters.textSearch}
                    onChange={(e) => updateFilter('textSearch', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status, Priority, Source */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="space-y-2">
                    {Object.values(CAPAStatus).map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={filters.status.includes(status)}
                          onCheckedChange={() => toggleArrayFilter('status', status)}
                        />
                        <Label htmlFor={`status-${status}`} className="text-sm">
                          {status.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="space-y-2">
                    {Object.values(CAPAPriority).map(priority => (
                      <div key={priority} className="flex items-center space-x-2">
                        <Checkbox
                          id={`priority-${priority}`}
                          checked={filters.priority.includes(priority)}
                          onCheckedChange={() => toggleArrayFilter('priority', priority)}
                        />
                        <Label htmlFor={`priority-${priority}`} className="text-sm">
                          {priority}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Source</Label>
                  <div className="space-y-2">
                    {Object.values(CAPASource).map(source => (
                      <div key={source} className="flex items-center space-x-2">
                        <Checkbox
                          id={`source-${source}`}
                          checked={filters.source.includes(source)}
                          onCheckedChange={() => toggleArrayFilter('source', source)}
                        />
                        <Label htmlFor={`source-${source}`} className="text-sm">
                          {source.replace(/_/g, ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Risk Level and Compliance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Risk Level</Label>
                  <div className="space-y-2">
                    {['Critical', 'High', 'Medium', 'Low'].map(level => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`risk-${level}`}
                          checked={filters.riskLevel.includes(level)}
                          onCheckedChange={() => toggleArrayFilter('riskLevel', level)}
                        />
                        <Label htmlFor={`risk-${level}`} className="text-sm">
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Compliance Standard</Label>
                  <div className="space-y-2">
                    {['SQF', 'BRC', 'FSSC 22000', 'HACCP', 'GFSI'].map(standard => (
                      <div key={standard} className="flex items-center space-x-2">
                        <Checkbox
                          id={`compliance-${standard}`}
                          checked={filters.complianceStandard.includes(standard)}
                          onCheckedChange={() => toggleArrayFilter('complianceStandard', standard)}
                        />
                        <Label htmlFor={`compliance-${standard}`} className="text-sm">
                          {standard}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Created Date</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !filters.dateCreatedFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateCreatedFrom ? format(filters.dateCreatedFrom, "PP") : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateCreatedFrom}
                          onSelect={(date) => updateFilter('dateCreatedFrom', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !filters.dateCreatedTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateCreatedTo ? format(filters.dateCreatedTo, "PP") : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateCreatedTo}
                          onSelect={(date) => updateFilter('dateCreatedTo', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !filters.dueDateFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dueDateFrom ? format(filters.dueDateFrom, "PP") : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dueDateFrom}
                          onSelect={(date) => updateFilter('dueDateFrom', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !filters.dueDateTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dueDateTo ? format(filters.dueDateTo, "PP") : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dueDateTo}
                          onSelect={(date) => updateFilter('dueDateTo', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Completion Date</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !filters.completionDateFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.completionDateFrom ? format(filters.completionDateFrom, "PP") : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.completionDateFrom}
                          onSelect={(date) => updateFilter('completionDateFrom', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !filters.completionDateTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.completionDateTo ? format(filters.completionDateTo, "PP") : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.completionDateTo}
                          onSelect={(date) => updateFilter('completionDateTo', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Cost Range */}
              <div className="space-y-2">
                <Label>Cost Range ($)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.costRange.min || ''}
                    onChange={(e) => updateFilter('costRange', {
                      ...filters.costRange,
                      min: e.target.value ? Number(e.target.value) : undefined
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.costRange.max || ''}
                    onChange={(e) => updateFilter('costRange', {
                      ...filters.costRange,
                      max: e.target.value ? Number(e.target.value) : undefined
                    })}
                  />
                </div>
              </div>

              {/* Boolean Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="overdue"
                      checked={filters.isOverdue}
                      onCheckedChange={(checked) => updateFilter('isOverdue', !!checked)}
                    />
                    <Label htmlFor="overdue">Show only overdue CAPAs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="risk-assessment"
                      checked={filters.hasRiskAssessment}
                      onCheckedChange={(checked) => updateFilter('hasRiskAssessment', !!checked)}
                    />
                    <Label htmlFor="risk-assessment">Has risk assessment</Label>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="root-cause"
                      checked={filters.hasRootCauseAnalysis}
                      onCheckedChange={(checked) => updateFilter('hasRootCauseAnalysis', !!checked)}
                    />
                    <Label htmlFor="root-cause">Has root cause analysis</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fsma-compliant"
                      checked={filters.fsmaCompliant}
                      onCheckedChange={(checked) => updateFilter('fsmaCompliant', !!checked)}
                    />
                    <Label htmlFor="fsma-compliant">FSMA 204 compliant</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.status.map(status => (
            <Badge key={`status-${status}`} variant="secondary" className="gap-1">
              Status: {status.replace('_', ' ')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleArrayFilter('status', status)}
              />
            </Badge>
          ))}
          {filters.priority.map(priority => (
            <Badge key={`priority-${priority}`} variant="secondary" className="gap-1">
              Priority: {priority}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleArrayFilter('priority', priority)}
              />
            </Badge>
          ))}
          {filters.source.map(source => (
            <Badge key={`source-${source}`} variant="secondary" className="gap-1">
              Source: {source.replace(/_/g, ' ')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleArrayFilter('source', source)}
              />
            </Badge>
          ))}
          {filters.textSearch && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.textSearch}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('textSearch', '')}
              />
            </Badge>
          )}
          {filters.isOverdue && (
            <Badge variant="destructive" className="gap-1">
              Overdue Only
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('isOverdue', false)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default CAPAAdvancedFilters;