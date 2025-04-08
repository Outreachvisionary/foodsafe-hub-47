import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ChevronDown, PlusCircle } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fetchNonConformances } from '@/services/nonConformanceService';
import { NonConformance, NCStatus, NCItemCategory, NCReasonCategory } from '@/types/non-conformance';
import NCStatusBadge from './NCStatusBadge';
import { toast } from 'sonner';

interface NCListProps {
  onSelectItem: (id: string) => void;
}

const NCList: React.FC<NCListProps> = ({ onSelectItem }) => {
  const navigate = useNavigate();
  const [nonConformances, setNonConformances] = useState<NonConformance[]>([]);
  const [filteredNCs, setFilteredNCs] = useState<NonConformance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [reasonFilter, setReasonFilter] = useState<string[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchNonConformances();
        console.log('Loaded NC data:', data);
        setNonConformances(data as unknown as NonConformance[]);
        setFilteredNCs(data as unknown as NonConformance[]);
      } catch (error) {
        console.error('Error loading non-conformances:', error);
        toast.error('Failed to load non-conformance records');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    if (nonConformances.length === 0) return;
    
    let result = [...nonConformances];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(nc => 
        nc.title?.toLowerCase().includes(query) ||
        nc.item_name?.toLowerCase().includes(query) ||
        nc.description?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter(nc => statusFilter.includes(nc.status));
    }
    
    // Apply category filter
    if (categoryFilter.length > 0) {
      result = result.filter(nc => categoryFilter.includes(nc.item_category));
    }
    
    // Apply reason filter
    if (reasonFilter.length > 0) {
      result = result.filter(nc => reasonFilter.includes(nc.reason_category));
    }
    
    setFilteredNCs(result);
  }, [nonConformances, searchQuery, statusFilter, categoryFilter, reasonFilter]);
  
  const handleCreateNew = () => {
    console.log("Creating new item from NCList");
    navigate('/non-conformance/new');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const statuses: NCStatus[] = ['On Hold', 'Under Review', 'Released', 'Disposed', 'Approved', 'Rejected', 'Resolved', 'Closed'];
  const categories: NCItemCategory[] = [
    'Processing Equipment', 
    'Product Storage Tanks', 
    'Finished Products', 
    'Raw Products', 
    'Packaging Materials', 
    'Other'
  ];
  const reasons: NCReasonCategory[] = [
    'Contamination', 
    'Quality Issues', 
    'Regulatory Non-Compliance', 
    'Equipment Malfunction', 
    'Documentation Error', 
    'Process Deviation', 
    'Other'
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Non-Conformance Management</h1>
          <p className="text-muted-foreground">Track, manage, and resolve product and process non-conformances</p>
        </div>
        
        <div className="flex justify-between my-4">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate('/non-conformance/dashboard')}
          >
            <span className="hidden md:inline">View Dashboard</span>
          </Button>
          
          <Button 
            onClick={handleCreateNew}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Non-Conformance
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search non-conformance items..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-3.5 w-3.5 mr-2" />
                Status
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {statuses.map(status => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter.includes(status)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setStatusFilter(prev => [...prev, status]);
                    } else {
                      setStatusFilter(prev => prev.filter(s => s !== status));
                    }
                  }}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-3.5 w-3.5 mr-2" />
                Category
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {categories.map(category => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={categoryFilter.includes(category)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setCategoryFilter(prev => [...prev, category]);
                    } else {
                      setCategoryFilter(prev => prev.filter(c => c !== category));
                    }
                  }}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-3.5 w-3.5 mr-2" />
                Reason
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {reasons.map(reason => (
                <DropdownMenuCheckboxItem
                  key={reason}
                  checked={reasonFilter.includes(reason)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setReasonFilter(prev => [...prev, reason]);
                    } else {
                      setReasonFilter(prev => prev.filter(r => r !== reason));
                    }
                  }}
                >
                  {reason}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="text-center">Qty On Hold</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reported Date</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredNCs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                {loading ? 'Loading data...' : 'No non-conformance records found'}
              </TableCell>
            </TableRow>
          ) : (
            filteredNCs.map((nc) => (
              <TableRow 
                key={nc.id}
                className="cursor-pointer"
                onClick={() => onSelectItem(nc.id)}
              >
                <TableCell>{nc.title}</TableCell>
                <TableCell>{nc.item_name}</TableCell>
                <TableCell>{nc.item_category}</TableCell>
                <TableCell>{nc.reason_category}</TableCell>
                <TableCell className="text-center">
                  {nc.quantity_on_hold ? 
                    <Badge variant="outline" className="font-mono">
                      {nc.quantity_on_hold}
                    </Badge> : 
                    '-'
                  }
                </TableCell>
                <TableCell>
                  <NCStatusBadge status={nc.status} />
                </TableCell>
                <TableCell>
                  {new Date(nc.reported_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(nc.id);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default NCList;
