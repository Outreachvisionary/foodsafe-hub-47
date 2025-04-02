import React, { useState, useEffect } from 'react';
import { Document, DocumentCategory, DocumentSearchFilters } from '@/types/document';
import { useDocuments } from '@/contexts/DocumentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DocumentList from '@/components/documents/DocumentList';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search, Filter, Calendar, Tag, User, FileText, RefreshCw, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

export const DocumentSearch: React.FC = () => {
  const { documents, isLoading, refreshData } = useDocuments();
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<DocumentSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Function to handle search term input
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Function to handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Function to toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Function to handle filter changes
  const handleFilterChange = (newFilters: DocumentSearchFilters) => {
    setFilters(newFilters);
  };
  
  // Function to clear all filters
  const clearFilters = () => {
    setFilters({});
  };
  
  // Function to apply date filters
  const applyDateFilters = (docs: Document[]) => {
    let filteredDocs = [...docs];
    
    if (filters.createdStart) {
      const startDate = new Date(filters.createdStart);
      filteredDocs = filteredDocs.filter(doc => 
        doc.created_at && new Date(doc.created_at) >= startDate
      );
    }
    
    if (filters.createdEnd) {
      const endDate = new Date(filters.createdEnd);
      filteredDocs = filteredDocs.filter(doc => 
        doc.created_at && new Date(doc.created_at) <= endDate
      );
    }
    
    if (filters.updatedStart) {
      const updatedStartDate = new Date(filters.updatedStart);
      filteredDocs = filteredDocs.filter(doc => 
        doc.updated_at && new Date(doc.updated_at) >= updatedStartDate
      );
    }
    
    if (filters.updatedEnd) {
      const updatedEndDate = new Date(filters.updatedEnd);
      filteredDocs = filteredDocs.filter(doc => 
        doc.updated_at && new Date(doc.updated_at) <= updatedEndDate
      );
    }
    
    if (filters.expiryStart) {
      const expiryStartDate = new Date(filters.expiryStart);
      filteredDocs = filteredDocs.filter(doc => 
        doc.expiry_date && new Date(doc.expiry_date) >= expiryStartDate
      );
    }
    
    if (filters.expiryEnd) {
      const expiryEndDate = new Date(filters.expiryEnd);
      filteredDocs = filteredDocs.filter(doc => 
        doc.expiry_date && new Date(doc.expiry_date) <= expiryEndDate
      );
    }
    
    return filteredDocs;
  };
  
  // Function to filter documents based on selected filters
  const filterDocuments = (docs: Document[]) => {
    let filteredDocs = [...docs];
    
    // Apply search term filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredDocs = filteredDocs.filter(doc => 
        doc.title.toLowerCase().includes(term) || 
        (doc.description && doc.description.toLowerCase().includes(term)) ||
        doc.file_name.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filteredDocs = filteredDocs.filter(doc => 
        filters.categories!.includes(doc.category)
      );
    }
    
    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filteredDocs = filteredDocs.filter(doc => 
        filters.status!.includes(doc.status)
      );
    }
    
    // Apply tab filtering
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'pending':
          filteredDocs = filteredDocs.filter(doc => doc.approval_status === 'pending');
          break;
        case 'approved':
          filteredDocs = filteredDocs.filter(doc => doc.approval_status === 'approved');
          break;
        case 'rejected':
          filteredDocs = filteredDocs.filter(doc => doc.approval_status === 'rejected');
          break;
        case 'expired':
          filteredDocs = filteredDocs.filter(doc => doc.is_expired);
          break;
      }
    }
    
    // Apply date filters
    if (filters.createdStart) {
      const startDate = new Date(filters.createdStart);
      filteredDocs = filteredDocs.filter(doc => 
        doc.created_at && new Date(doc.created_at) >= startDate
      );
    }
    
    if (filters.createdEnd) {
      const endDate = new Date(filters.createdEnd);
      filteredDocs = filteredDocs.filter(doc => 
        doc.created_at && new Date(doc.created_at) <= endDate
      );
    }
    
    if (filters.updatedStart) {
      const updatedStartDate = new Date(filters.updatedStart);
      filteredDocs = filteredDocs.filter(doc => 
        doc.updated_at && new Date(doc.updated_at) >= updatedStartDate
      );
    }
    
    if (filters.updatedEnd) {
      const updatedEndDate = new Date(filters.updatedEnd);
      filteredDocs = filteredDocs.filter(doc => 
        doc.updated_at && new Date(doc.updated_at) <= updatedEndDate
      );
    }
    
    if (filters.expiryStart) {
      const expiryStartDate = new Date(filters.expiryStart);
      filteredDocs = filteredDocs.filter(doc => 
        doc.expiry_date && new Date(doc.expiry_date) >= expiryStartDate
      );
    }
    
    if (filters.expiryEnd) {
      const expiryEndDate = new Date(filters.expiryEnd);
      filteredDocs = filteredDocs.filter(doc => 
        doc.expiry_date && new Date(doc.expiry_date) <= expiryEndDate
      );
    }
    
    return filteredDocs;
  };
  
  // Update search results whenever documents or search term changes
  useEffect(() => {
    if (!isLoading) {
      const results = filterDocuments(documents);
      setSearchResults(results);
    }
  }, [documents, searchTerm, filters, activeTab, isLoading]);
  
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Document Search</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFilters}>
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={handleSearchTermChange}
                className="pl-9"
              />
            </div>
            
            {showFilters && (
              <div className="border p-4 rounded-md">
                {/* Implement filter components here */}
                <p>Filter options will go here</p>
              </div>
            )}
            
            <Tabs defaultValue={activeTab} className="space-y-4" onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-2 focus:outline-none">
                {searchResults.length > 0 ? (
                  <DocumentList documents={searchResults} />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No documents found.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="pending" className="space-y-2 focus:outline-none">
                {searchResults.filter(doc => doc.approval_status === 'pending').length > 0 ? (
                  <DocumentList documents={searchResults.filter(doc => doc.approval_status === 'pending')} />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No pending documents found.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="approved" className="space-y-2 focus:outline-none">
                {searchResults.filter(doc => doc.approval_status === 'approved').length > 0 ? (
                  <DocumentList documents={searchResults.filter(doc => doc.approval_status === 'approved')} />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No approved documents found.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="rejected" className="space-y-2 focus:outline-none">
                {searchResults.filter(doc => doc.approval_status === 'rejected').length > 0 ? (
                  <DocumentList documents={searchResults.filter(doc => doc.approval_status === 'rejected')} />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No rejected documents found.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="expired" className="space-y-2 focus:outline-none">
                {searchResults.filter(doc => doc.is_expired).length > 0 ? (
                  <DocumentList documents={searchResults.filter(doc => doc.is_expired)} />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No expired documents found.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
