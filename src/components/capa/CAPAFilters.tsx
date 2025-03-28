
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterX, Search, SlidersHorizontal, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CAPAFilters as CAPAFiltersType } from '@/types/capa';

interface CAPAFiltersProps {
  filters: CAPAFiltersType;
  searchQuery: string;
  setFilters: (filters: CAPAFiltersType) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  showAutomation: boolean;
  toggleAutomation: () => void;
  automationCount: number;
}

const CAPAFilters: React.FC<CAPAFiltersProps> = ({
  filters,
  searchQuery,
  setFilters,
  setSearchQuery,
  resetFilters,
  showAutomation,
  toggleAutomation,
  automationCount
}) => {
  const { toast } = useToast();

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <div className="flex-1 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search CAPAs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select 
          value={filters.status} 
          onValueChange={(value) => setFilters({...filters, status: value})}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={filters.priority} 
          onValueChange={(value) => setFilters({...filters, priority: value})}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={filters.source} 
          onValueChange={(value) => setFilters({...filters, source: value})}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="audit">Audit</SelectItem>
            <SelectItem value="haccp">HACCP</SelectItem>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="complaint">Complaint</SelectItem>
            <SelectItem value="traceability">Traceability</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => toast({
            title: "Advanced Filters",
            description: "Advanced filtering options"
          })}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={resetFilters}
        >
          <FilterX className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant={showAutomation ? "default" : "outline"} 
          onClick={toggleAutomation}
          className="flex items-center"
        >
          <Zap className="h-4 w-4 mr-2" />
          Auto-Detected Issues
          {automationCount > 0 && !showAutomation && (
            <span className="ml-1 bg-red-100 text-red-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {automationCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CAPAFilters;
