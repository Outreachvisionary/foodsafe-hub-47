import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ChevronDown, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { CAPA, CAPAStatus, CAPAPriority, CAPASource } from '@/types/capa';
import { fetchCAPAs } from '@/services/capaService';
import { useToast } from '@/components/ui/use-toast';

interface CAPAListProps {
  filters: {
    status: string;
    priority: string;
    source: string;
  };
  searchQuery: string;
}

const CAPAList: React.FC<CAPAListProps> = ({ filters, searchQuery }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [filteredCapas, setFilteredCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchCAPAs(filters);
        setCapas(data);
        setFilteredCapas(data);
      } catch (error) {
        console.error('Error loading CAPAs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load CAPA records',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, toast]);

  useEffect(() => {
    if (capas.length === 0) return;

    let result = [...capas];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(capa =>
        capa.title?.toLowerCase().includes(query) ||
        capa.description?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter(capa => statusFilter.includes(capa.status));
    }

    // Apply priority filter
    if (priorityFilter.length > 0) {
      result = result.filter(capa => priorityFilter.includes(capa.priority));
    }

    // Apply source filter
    if (sourceFilter.length > 0) {
      result = result.filter(capa => sourceFilter.includes(capa.source));
    }

    setFilteredCapas(result);
  }, [capas, searchQuery, statusFilter, priorityFilter, sourceFilter]);

  const handleCreateNew = () => {
    navigate('/capa/new');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statuses: CAPAStatus[] = ['Open', 'In Progress', 'Closed', 'Verified'];
  const priorities: CAPAPriority[] = ['low', 'medium', 'high', 'critical'];
  const sources: CAPASource[] = ['audit', 'complaint', 'non_conformance', 'supplier', 'haccp', 'traceability'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <div>
          <h1 className="text-2xl font-semibold text-primary">CAPA Management</h1>
          <p className="text-muted-foreground">Track, manage, and resolve corrective and preventive actions</p>
        </div>

        <div className="flex justify-end my-4">
          <Button onClick={handleCreateNew} className="bg-cyan-500 hover:bg-cyan-600 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            New CAPA
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search CAPAs..."
            className="pl-8"
            value={searchQuery}
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
                Priority
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {priorities.map(priority => (
                <DropdownMenuCheckboxItem
                  key={priority}
                  checked={priorityFilter.includes(priority)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setPriorityFilter(prev => [...prev, priority]);
                    } else {
                      setPriorityFilter(prev => prev.filter(p => p !== priority));
                    }
                  }}
                >
                  {priority}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-3.5 w-3.5 mr-2" />
                Source
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sources.map(source => (
                <DropdownMenuCheckboxItem
                  key={source}
                  checked={sourceFilter.includes(source)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSourceFilter(prev => [...prev, source]);
                    } else {
                      setSourceFilter(prev => prev.filter(s => s !== source));
                    }
                  }}
                >
                  {source}
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
            <TableHead>Source</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCapas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                {loading ? 'Loading data...' : 'No CAPA records found'}
              </TableCell>
            </TableRow>
          ) : (
            filteredCapas.map((capa) => {
              const isResolved = capa.status === 'Closed' || capa.status === 'Verified';

              return (
                <TableRow
                  key={capa.id}
                  className={`cursor-pointer ${isResolved ? 'opacity-50' : ''}`}
                  onClick={() => navigate(`/capa/${capa.id}`)}
                >
                  <TableCell>{capa.title}</TableCell>
                  <TableCell>{capa.source}</TableCell>
                  <TableCell>{capa.priority}</TableCell>
                  <TableCell>{capa.status}</TableCell>
                  <TableCell>{new Date(capa.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{capa.assignedTo}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/capa/${capa.id}`);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CAPAList;
