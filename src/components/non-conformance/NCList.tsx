
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NonConformance, NCFilter, NCItemCategory, NCReasonCategory, NCStatus } from '@/types/non-conformance';
import { fetchNonConformances } from '@/services/nonConformanceService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Clock, CheckCircle, Trash2, Plus, Filter, Search, X, Package } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const NCList: React.FC = () => {
  const [nonConformances, setNonConformances] = useState<NonConformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<NCFilter>({
    status: undefined,
    item_category: undefined,
    reason_category: undefined,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadNonConformances = async () => {
      try {
        setLoading(true);
        
        // Modified to call fetchNonConformances without arguments
        // since the implementation doesn't accept filters yet
        const items = await fetchNonConformances();
        
        // Apply client-side filtering
        let filteredItems = items;
        
        // Filter by search term
        if (searchTerm) {
          filteredItems = filteredItems.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
        
        // Filter by status
        if (filters.status && filters.status.length > 0) {
          filteredItems = filteredItems.filter(item => 
            filters.status?.includes(item.status)
          );
        }
        
        // Filter by item category
        if (filters.item_category && filters.item_category.length > 0) {
          filteredItems = filteredItems.filter(item => 
            filters.item_category?.includes(item.item_category)
          );
        }
        
        // Filter by reason category
        if (filters.reason_category && filters.reason_category.length > 0) {
          filteredItems = filteredItems.filter(item => 
            filters.reason_category?.includes(item.reason_category)
          );
        }
        
        setNonConformances(filteredItems);
      } catch (error) {
        console.error('Error loading non-conformances:', error);
        toast({
          title: 'Failed to load data',
          description: 'There was an error loading the non-conformance items.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadNonConformances();
  }, [filters, searchTerm, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already triggered in the useEffect
  };

  const clearFilters = () => {
    setFilters({
      status: undefined,
      item_category: undefined,
      reason_category: undefined,
    });
    setSearchTerm('');
  };

  const getStatusBadge = (status: NCStatus) => {
    switch (status) {
      case 'On Hold':
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            On Hold
          </Badge>
        );
      case 'Under Review':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Under Review
          </Badge>
        );
      case 'Released':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Released
          </Badge>
        );
      case 'Disposed':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 flex items-center gap-1">
            <Trash2 className="h-3 w-3" />
            Disposed
          </Badge>
        );
    }
  };

  const formatQuantity = (item: NonConformance) => {
    if (item.quantity_on_hold && item.units) {
      return `${item.quantity_on_hold} ${item.units}`;
    } else if (item.quantity_on_hold) {
      return `${item.quantity_on_hold}`;
    }
    return '-';
  };

  const hasActiveFilters = Boolean(
    (filters.status && filters.status.length > 0) ||
    (filters.item_category && filters.item_category.length > 0) ||
    (filters.reason_category && filters.reason_category.length > 0) ||
    searchTerm
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle>Non-Conformance Items</CardTitle>
        <Button onClick={() => navigate('/non-conformance/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Item
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form onSubmit={handleSearch} className="flex w-full md:w-1/3 items-center space-x-2">
            <Input
              placeholder="Search non-conformance items..."
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
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['On Hold', 'Under Review', 'Released', 'Disposed'] as NCStatus[]).map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={filters.status?.includes(status)}
                    onCheckedChange={(checked) => {
                      setFilters(prev => {
                        const newStatus = prev.status ? [...prev.status] : [];
                        if (checked) {
                          newStatus.push(status);
                        } else {
                          const index = newStatus.indexOf(status);
                          if (index > -1) {
                            newStatus.splice(index, 1);
                          }
                        }
                        return { ...prev, status: newStatus.length > 0 ? newStatus : undefined };
                      });
                    }}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Category
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {([
                  'Processing Equipment',
                  'Product Storage Tanks',
                  'Finished Products',
                  'Raw Products',
                  'Packaging Materials',
                  'Other'
                ] as NCItemCategory[]).map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={filters.item_category?.includes(category)}
                    onCheckedChange={(checked) => {
                      setFilters(prev => {
                        const newCategory = prev.item_category ? [...prev.item_category] : [];
                        if (checked) {
                          newCategory.push(category);
                        } else {
                          const index = newCategory.indexOf(category);
                          if (index > -1) {
                            newCategory.splice(index, 1);
                          }
                        }
                        return { ...prev, item_category: newCategory.length > 0 ? newCategory : undefined };
                      });
                    }}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Reason
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Reason</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {([
                  'Contamination',
                  'Quality Issues',
                  'Regulatory Non-Compliance',
                  'Equipment Malfunction',
                  'Documentation Error',
                  'Process Deviation',
                  'Other'
                ] as NCReasonCategory[]).map((reason) => (
                  <DropdownMenuCheckboxItem
                    key={reason}
                    checked={filters.reason_category?.includes(reason)}
                    onCheckedChange={(checked) => {
                      setFilters(prev => {
                        const newReason = prev.reason_category ? [...prev.reason_category] : [];
                        if (checked) {
                          newReason.push(reason);
                        } else {
                          const index = newReason.indexOf(reason);
                          if (index > -1) {
                            newReason.splice(index, 1);
                          }
                        }
                        return { ...prev, reason_category: newReason.length > 0 ? newReason : undefined };
                      });
                    }}
                  >
                    {reason}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : nonConformances.length === 0 ? (
          <div className="text-center p-10">
            <h3 className="text-lg font-medium">No items found</h3>
            <p className="text-gray-500 mt-2">
              {hasActiveFilters
                ? "Try adjusting your filters or search criteria."
                : "There are no non-conformance items yet."}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Qty On Hold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nonConformances.map((item) => (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/non-conformance/${item.id}`)}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.item_name}</TableCell>
                    <TableCell>{item.item_category}</TableCell>
                    <TableCell>{item.reason_category}</TableCell>
                    <TableCell>
                      {item.status === 'On Hold' && item.quantity_on_hold ? (
                        <div className="flex items-center">
                          <Package className="h-3 w-3 text-orange-500 mr-1" />
                          {formatQuantity(item)}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{new Date(item.reported_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/non-conformance/${item.id}`);
                      }}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NCList;
