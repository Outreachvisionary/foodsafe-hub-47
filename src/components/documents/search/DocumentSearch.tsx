
import React, { useState, useEffect } from 'react';
import { useDocuments } from '@/contexts/DocumentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Document } from '@/types/document';
import { Search, Filter, Calendar as CalendarIcon, Tag, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import DocumentList from '@/components/documents/DocumentList';

// Define filter types
interface DocumentSearchFilters {
  searchTerm: string;
  category: string;
  status: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  tags: string[];
}

export const DocumentSearch: React.FC = () => {
  const { documents } = useDocuments();
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Initialize filters
  const [filters, setFilters] = useState<DocumentSearchFilters>({
    searchTerm: '',
    category: '',
    status: '',
    dateFrom: undefined,
    dateTo: undefined,
    tags: [],
  });
  
  // Get unique categories and tags from documents
  const categories = [...new Set(documents.map(doc => doc.category))];
  const allTags = documents.reduce((acc: string[], doc) => {
    if (doc.tags) {
      return [...acc, ...doc.tags.filter(tag => !acc.includes(tag))];
    }
    return acc;
  }, []);
  
  // Apply filters to documents
  useEffect(() => {
    let results = [...documents];
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter(doc => 
        doc.title.toLowerCase().includes(searchLower) || 
        (doc.description && doc.description.toLowerCase().includes(searchLower)) ||
        doc.file_name.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by category
    if (filters.category) {
      results = results.filter(doc => doc.category === filters.category);
    }
    
    // Filter by status
    if (filters.status) {
      results = results.filter(doc => {
        if (filters.status === 'approved') return doc.approval_status === 'approved';
        if (filters.status === 'rejected') return doc.approval_status === 'rejected';
        if (filters.status === 'pending') return doc.approval_status === 'pending';
        if (filters.status === 'expired') return doc.is_expired;
        return true;
      });
    }
    
    // Filter by date range
    if (filters.dateFrom) {
      results = results.filter(doc => 
        new Date(doc.created_at) >= new Date(filters.dateFrom as Date)
      );
    }
    
    if (filters.dateTo) {
      results = results.filter(doc => 
        new Date(doc.created_at) <= new Date(filters.dateTo as Date)
      );
    }
    
    // Filter by tags
    if (filters.tags.length > 0) {
      results = results.filter(doc => 
        doc.tags && filters.tags.some(tag => doc.tags?.includes(tag))
      );
    }
    
    setFilteredDocuments(results);
  }, [documents, filters]);
  
  // Update filters
  const handleFilterChange = (key: keyof DocumentSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setFilters(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      status: '',
      dateFrom: undefined,
      dateTo: undefined,
      tags: [],
    });
  };
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 pb-3">
          <CardTitle className="text-lg">Document Search</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search documents by title, content or filename..."
                  className="pl-9"
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="shrink-0"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Button className="shrink-0">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={filters.category} 
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateFrom ? (
                          format(filters.dateFrom, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateFrom}
                        onSelect={(date) => handleFilterChange('dateFrom', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateTo ? (
                          format(filters.dateTo, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateTo}
                        onSelect={(date) => handleFilterChange('dateTo', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="lg:col-span-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center">
                      <Tag className="h-4 w-4 mr-1.5" />
                      Tags
                    </Label>
                    {filters.tags.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs"
                        onClick={() => handleFilterChange('tags', [])}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allTags.length > 0 ? (
                      allTags.map(tag => (
                        <div 
                          key={tag}
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer",
                            filters.tags.includes(tag)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No tags available</p>
                    )}
                  </div>
                </div>
                
                <div className="lg:col-span-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={resetFilters} className="ml-auto">
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="bg-muted/30 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Search Results</CardTitle>
          <div className="text-sm text-muted-foreground">
            {filteredDocuments.length} document{filteredDocuments.length === 1 ? '' : 's'} found
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {filteredDocuments.length > 0 ? (
            <DocumentList documents={filteredDocuments} />
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <h3 className="text-lg font-medium mb-1">No Documents Found</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Try adjusting your search criteria or filters to find what you're looking for
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
