
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, ChevronDown, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fetchNonConformances } from '@/services/nonConformanceService';
import { NonConformance, NCStatus } from '@/types/non-conformance';
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
        setNonConformances(data);
        setFilteredNCs(data);
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
  
  const statuses: NCStatus[] = ['On Hold', 'Under Review', 'Released', 'Disposed', 'Resolved', 'Closed'];
  const categories = [...new Set(nonConformances.map(nc => nc.item_category))];
  const reasons = [...new Set(nonConformances.map(nc => nc.reason_category))];
  
  return (
    <div className="overflow-hidden">
      <div className="p-4 bg-background border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search non-conformance items..."
            className="pl-8 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
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
          
          <Button 
            size="sm"
            onClick={handleCreateNew}
            className="h-9 bg-primary hover:bg-primary/90"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            New Item
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium text-muted-foreground">Title</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Item</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Reason</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Qty On Hold</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Reported Date</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredNCs.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-8 text-muted-foreground">
                  {loading ? 'Loading data...' : 'No non-conformance records found'}
                </td>
              </tr>
            ) : (
              filteredNCs.map((nc) => (
                <tr 
                  key={nc.id} 
                  className="border-b hover:bg-muted/30 cursor-pointer"
                  onClick={() => onSelectItem(nc.id)}
                >
                  <td className="p-3">{nc.title}</td>
                  <td className="p-3">{nc.item_name}</td>
                  <td className="p-3">{nc.item_category}</td>
                  <td className="p-3">{nc.reason_category}</td>
                  <td className="p-3 text-center">
                    {nc.quantity_on_hold ? 
                      <Badge variant="outline" className="font-mono">
                        {nc.quantity_on_hold}
                      </Badge> : 
                      '-'
                    }
                  </td>
                  <td className="p-3">
                    <NCStatusBadge status={nc.status} />
                  </td>
                  <td className="p-3">
                    {new Date(nc.reported_date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NCList;
