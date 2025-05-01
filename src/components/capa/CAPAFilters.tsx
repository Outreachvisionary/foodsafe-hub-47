
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DatePicker } from '@/components/ui/date-picker';
import { CAPAFilter } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { formatEnumValue } from '@/utils/typeAdapters';

interface CAPAFiltersProps {
  filters: CAPAFilter;
  setFilters: (filters: CAPAFilter) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

const CAPAFilters: React.FC<CAPAFiltersProps> = ({
  filters,
  setFilters,
  searchQuery,
  onSearchChange,
}) => {
  const handleStatusChange = (status: CAPAStatus) => {
    let newStatus: CAPAStatus[] = [];
    
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        if (filters.status.includes(status)) {
          newStatus = filters.status.filter(s => s !== status);
        } else {
          newStatus = [...filters.status, status];
        }
      } else {
        if (filters.status === status) {
          newStatus = [];
        } else {
          newStatus = [filters.status, status];
        }
      }
    } else {
      newStatus = [status];
    }
    
    setFilters({ ...filters, status: newStatus.length ? newStatus : undefined });
  };
  
  const handlePriorityChange = (priority: CAPAPriority) => {
    let newPriority: CAPAPriority[] = [];
    
    if (filters.priority) {
      if (Array.isArray(filters.priority)) {
        if (filters.priority.includes(priority)) {
          newPriority = filters.priority.filter(p => p !== priority);
        } else {
          newPriority = [...filters.priority, priority];
        }
      } else {
        if (filters.priority === priority) {
          newPriority = [];
        } else {
          newPriority = [filters.priority, priority];
        }
      }
    } else {
      newPriority = [priority];
    }
    
    setFilters({ ...filters, priority: newPriority.length ? newPriority : undefined });
  };
  
  const handleSourceChange = (source: CAPASource) => {
    let newSource: CAPASource[] = [];
    
    if (filters.source) {
      if (Array.isArray(filters.source)) {
        if (filters.source.includes(source)) {
          newSource = filters.source.filter(s => s !== source);
        } else {
          newSource = [...filters.source, source];
        }
      } else {
        if (filters.source === source) {
          newSource = [];
        } else {
          newSource = [filters.source, source];
        }
      }
    } else {
      newSource = [source];
    }
    
    setFilters({ ...filters, source: newSource.length ? newSource : undefined });
  };

  const handleDepartmentChange = (department: string) => {
    if (!department) return;
    
    let newDepartment: string[] = [];
    
    if (filters.department) {
      if (Array.isArray(filters.department)) {
        if (!filters.department.includes(department)) {
          newDepartment = [...filters.department, department];
        }
      } else {
        if (filters.department !== department) {
          newDepartment = [filters.department, department];
        }
      }
    } else {
      newDepartment = [department];
    }
    
    setFilters({ ...filters, department: newDepartment.length ? newDepartment : undefined });
  };
  
  const removeDepartmentFilter = (department: string) => {
    if (!filters.department) return;
    
    if (Array.isArray(filters.department)) {
      const newDepartment = filters.department.filter(d => d !== department);
      setFilters({ ...filters, department: newDepartment.length ? newDepartment : undefined });
    } else {
      setFilters({ ...filters, department: undefined });
    }
  };
  
  const handleClearFilters = () => {
    setFilters({});
  };
  
  const isStatusSelected = (status: CAPAStatus) => {
    if (!filters.status) return false;
    if (Array.isArray(filters.status)) {
      return filters.status.includes(status);
    }
    return filters.status === status;
  };
  
  const isPrioritySelected = (priority: CAPAPriority) => {
    if (!filters.priority) return false;
    if (Array.isArray(filters.priority)) {
      return filters.priority.includes(priority);
    }
    return filters.priority === priority;
  };
  
  const isSourceSelected = (source: CAPASource) => {
    if (!filters.source) return false;
    if (Array.isArray(filters.source)) {
      return filters.source.includes(source);
    }
    return filters.source === source;
  };
  
  // Format enum value for display
  const displayEnumValue = (value: string) => {
    return value.replace(/_/g, ' ');
  };
  
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search CAPAs..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <Accordion type="multiple" defaultValue={["status", "priority"]}>
          <AccordionItem value="status">
            <AccordionTrigger>Status</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.values(CAPAStatus).map((status) => (
                  <Badge
                    key={status}
                    variant={isStatusSelected(status) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleStatusChange(status)}
                  >
                    {displayEnumValue(status)}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="priority">
            <AccordionTrigger>Priority</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.values(CAPAPriority).map((priority) => (
                  <Badge
                    key={priority}
                    variant={isPrioritySelected(priority) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handlePriorityChange(priority)}
                  >
                    {priority}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="source">
            <AccordionTrigger>Source</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.values(CAPASource).map((source) => (
                  <Badge
                    key={source}
                    variant={isSourceSelected(source) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleSourceChange(source)}
                  >
                    {displayEnumValue(source)}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="department">
            <AccordionTrigger>Department</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <div className="flex-grow">
                    <Input 
                      placeholder="Add department..." 
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleDepartmentChange((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                  </div>
                </div>
                
                {filters.department && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {Array.isArray(filters.department) 
                      ? filters.department.map((dept) => (
                          <Badge key={dept} variant="secondary" className="flex items-center gap-1">
                            {dept}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeDepartmentFilter(dept)} />
                          </Badge>
                        ))
                      : (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {filters.department}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeDepartmentFilter(filters.department)} />
                        </Badge>
                      )
                    }
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="dateRange">
            <AccordionTrigger>Date Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div>
                  <Label>Start Date</Label>
                  <DatePicker
                    date={filters.dateRange?.start ? new Date(filters.dateRange.start) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setFilters({
                          ...filters,
                          dateRange: {
                            start: date.toISOString(),
                            end: filters.dateRange?.end || new Date().toISOString(),
                          },
                        });
                      }
                    }}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <DatePicker
                    date={filters.dateRange?.end ? new Date(filters.dateRange.end) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setFilters({
                          ...filters,
                          dateRange: {
                            start: filters.dateRange?.start || new Date(0).toISOString(),
                            end: date.toISOString(),
                          },
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default CAPAFilters;
