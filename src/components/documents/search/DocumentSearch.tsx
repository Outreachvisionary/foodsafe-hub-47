
import React, { useState, useEffect } from 'react';
import { useDocuments } from '@/contexts/DocumentContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DocumentSearchFilters, Document, DocumentCategory, DocumentStatus } from '@/types/document';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DocumentList } from '@/components/documents/DocumentList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Search, CalendarIcon, Filter, FileText, Tag, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const DocumentSearch: React.FC = () => {
  const { documents } = useDocuments();
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Search filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<DocumentCategory[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<DocumentStatus[]>([]);
  const [createdDateStart, setCreatedDateStart] = useState<Date | null>(null);
  const [createdDateEnd, setCreatedDateEnd] = useState<Date | null>(null);
  const [updatedDateStart, setUpdatedDateStart] = useState<Date | null>(null);
  const [updatedDateEnd, setUpdatedDateEnd] = useState<Date | null>(null);
  const [expiryDateStart, setExpiryDateStart] = useState<Date | null>(null);
  const [expiryDateEnd, setExpiryDateEnd] = useState<Date | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [createdBy, setCreatedBy] = useState<string[]>([]);
  
  // Get unique tags, creators
  const allTags = [...new Set(documents.flatMap(doc => doc.tags || []))];
  const allCreators = [...new Set(documents.map(doc => doc.created_by))];
  
  // All possible document categories and statuses
  const categories: DocumentCategory[] = [
    'SOP', 'Policy', 'Form', 'Certificate', 'Audit Report', 
    'HACCP Plan', 'Training Material', 'Supplier Documentation', 
    'Risk Assessment', 'Other'
  ];
  
  const statuses: DocumentStatus[] = [
    'Draft', 'Pending Approval', 'Approved', 'Published', 'Archived', 'Expired'
  ];
  
  // Handle search with filters
  const handleSearch = () => {
    setIsSearching(true);
    
    try {
      // Build search filters object
      const filters: DocumentSearchFilters = {
        searchTerm,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
        createdStart: createdDateStart ? createdDateStart.toISOString() : undefined,
        createdEnd: createdDateEnd ? createdDateEnd.toISOString() : undefined,
        updatedStart: updatedDateStart ? updatedDateStart.toISOString() : undefined,
        updatedEnd: updatedDateEnd ? updatedDateEnd.toISOString() : undefined,
        expiryStart: expiryDateStart ? expiryDateStart.toISOString() : undefined,
        expiryEnd: expiryDateEnd ? expiryDateEnd.toISOString() : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        createdBy: createdBy.length > 0 ? createdBy : undefined,
      };
      
      // Count active filters for the badge
      const activeFiltersList = [];
      if (filters.categories) activeFiltersList.push('categories');
      if (filters.status) activeFiltersList.push('status');
      if (filters.createdStart || filters.createdEnd) activeFiltersList.push('created date');
      if (filters.updatedStart || filters.updatedEnd) activeFiltersList.push('updated date');
      if (filters.expiryStart || filters.expiryEnd) activeFiltersList.push('expiry date');
      if (filters.tags) activeFiltersList.push('tags');
      if (filters.createdBy) activeFiltersList.push('created by');
      setActiveFilters(activeFiltersList);
      
      // Filter documents based on search criteria
      let results = [...documents];
      
      // Text search (case insensitive)
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        results = results.filter(doc => 
          doc.title.toLowerCase().includes(query) || 
          (doc.description && doc.description.toLowerCase().includes(query)) ||
          (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      }
      
      // Category filter
      if (filters.categories && filters.categories.length > 0) {
        results = results.filter(doc => filters.categories?.includes(doc.category));
      }
      
      // Status filter
      if (filters.status && filters.status.length > 0) {
        results = results.filter(doc => filters.status?.includes(doc.status));
      }
      
      // Created date range
      if (filters.createdStart) {
        results = results.filter(doc => doc.created_at ? new Date(doc.created_at) >= new Date(filters.createdStart!) : true);
      }
      if (filters.createdEnd) {
        results = results.filter(doc => doc.created_at ? new Date(doc.created_at) <= new Date(filters.createdEnd!) : true);
      }
      
      // Updated date range
      if (filters.updatedStart) {
        results = results.filter(doc => doc.updated_at ? new Date(doc.updated_at) >= new Date(filters.updatedStart!) : true);
      }
      if (filters.updatedEnd) {
        results = results.filter(doc => doc.updated_at ? new Date(doc.updated_at) <= new Date(filters.updatedEnd!) : true);
      }
      
      // Expiry date range
      if (filters.expiryStart) {
        results = results.filter(doc => doc.expiry_date ? new Date(doc.expiry_date) >= new Date(filters.expiryStart!) : true);
      }
      if (filters.expiryEnd) {
        results = results.filter(doc => doc.expiry_date ? new Date(doc.expiry_date) <= new Date(filters.expiryEnd!) : true);
      }
      
      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        results = results.filter(doc => 
          doc.tags && filters.tags?.some(tag => doc.tags?.includes(tag))
        );
      }
      
      // Created by filter
      if (filters.createdBy && filters.createdBy.length > 0) {
        results = results.filter(doc => filters.createdBy?.includes(doc.created_by));
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setCreatedDateStart(null);
    setCreatedDateEnd(null);
    setUpdatedDateStart(null);
    setUpdatedDateEnd(null);
    setExpiryDateStart(null);
    setExpiryDateEnd(null);
    setSelectedTags([]);
    setCreatedBy([]);
    setActiveFilters([]);
    setSearchResults(documents);
  };
  
  // Initialize with all documents
  useEffect(() => {
    setSearchResults(documents);
  }, [documents]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Advanced Document Search
          </CardTitle>
          <CardDescription>
            Search for documents using multiple criteria and filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search box with toggle for advanced filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search document title, description or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={showFilters ? "default" : "outline"} 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1 rounded-full h-5 w-5 p-0 flex items-center justify-center">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
            
            {/* Active filters display */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center pt-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {activeFilters.map(filter => (
                  <Badge key={filter} variant="outline" className="flex items-center gap-1">
                    {filter}
                  </Badge>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters} 
                  className="h-7 text-xs"
                >
                  <X className="h-3 w-3 mr-1" /> Clear all
                </Button>
              </div>
            )}
            
            {/* Advanced filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 p-4 bg-muted/30 rounded-lg border">
                {/* Document category filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Document Category</Label>
                  <ScrollArea className="h-32 rounded-md border">
                    <div className="p-3 space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, category]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== category));
                              }
                            }}
                          />
                          <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                {/* Document status filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Document Status</Label>
                  <ScrollArea className="h-32 rounded-md border">
                    <div className="p-3 space-y-2">
                      {statuses.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`status-${status}`} 
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedStatuses([...selectedStatuses, status]);
                              } else {
                                setSelectedStatuses(selectedStatuses.filter(s => s !== status));
                              }
                            }}
                          />
                          <Label htmlFor={`status-${status}`} className="text-sm font-normal">
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                {/* Date filters */}
                <div className="space-y-4">
                  {/* Created date range */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Created Date Range</Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 justify-start text-left text-sm font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {createdDateStart ? format(createdDateStart, 'PPP') : <span>From date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={createdDateStart}
                            onSelect={setCreatedDateStart}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 justify-start text-left text-sm font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {createdDateEnd ? format(createdDateEnd, 'PPP') : <span>To date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={createdDateEnd}
                            onSelect={setCreatedDateEnd}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  {/* Updated date range */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Updated Date Range</Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 justify-start text-left text-sm font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {updatedDateStart ? format(updatedDateStart, 'PPP') : <span>From date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={updatedDateStart}
                            onSelect={setUpdatedDateStart}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 justify-start text-left text-sm font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {updatedDateEnd ? format(updatedDateEnd, 'PPP') : <span>To date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={updatedDateEnd}
                            onSelect={setUpdatedDateEnd}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                
                {/* Expiry date range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Expiry Date Range</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 justify-start text-left text-sm font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {expiryDateStart ? format(expiryDateStart, 'PPP') : <span>From date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={expiryDateStart}
                          onSelect={setExpiryDateStart}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 justify-start text-left text-sm font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {expiryDateEnd ? format(expiryDateEnd, 'PPP') : <span>To date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={expiryDateEnd}
                          onSelect={setExpiryDateEnd}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {/* Tags filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tags</Label>
                  <ScrollArea className="h-32 rounded-md border">
                    <div className="p-3 space-y-2">
                      {allTags.length > 0 ? (
                        allTags.map((tag) => (
                          <div key={tag} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`tag-${tag}`} 
                              checked={selectedTags.includes(tag)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTags([...selectedTags, tag]);
                                } else {
                                  setSelectedTags(selectedTags.filter(t => t !== tag));
                                }
                              }}
                            />
                            <Label htmlFor={`tag-${tag}`} className="text-sm font-normal flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No tags available</p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
                
                {/* Created by filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Created By</Label>
                  <ScrollArea className="h-32 rounded-md border">
                    <div className="p-3 space-y-2">
                      {allCreators.map((creator) => (
                        <div key={creator} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`creator-${creator}`} 
                            checked={createdBy.includes(creator)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCreatedBy([...createdBy, creator]);
                              } else {
                                setCreatedBy(createdBy.filter(c => c !== creator));
                              }
                            }}
                          />
                          <Label htmlFor={`creator-${creator}`} className="text-sm font-normal">
                            {creator}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Search results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Search Results ({searchResults.length})
          </CardTitle>
          <CardDescription>
            {searchResults.length === 0 ? (
              'No documents found matching your search criteria'
            ) : (
              `Found ${searchResults.length} documents matching your search criteria`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {searchResults.length > 0 ? (
            <DocumentList documents={searchResults} />
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No documents found</h3>
              <p className="mt-1 text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
