
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, PlusCircle, Search } from 'lucide-react';
import { CAPA } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import { getCAPAs } from '@/services/capaService';

interface CAPAListProps {
  filter?: {
    status?: CAPAStatus | CAPAStatus[];
    priority?: CAPAPriority | CAPAPriority[];
    source?: CAPASource | CAPASource[];
    department?: string;
  };
  limit?: number;
  searchQuery?: string;
}

const CAPAList: React.FC<CAPAListProps> = ({ filter, limit, searchQuery: externalSearchQuery }) => {
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || '');
  const [statusFilter, setStatusFilter] = useState<CAPAStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<CAPAPriority | ''>('');
  const [sourceFilter, setSourceFilter] = useState<CAPASource | ''>('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
    fetchCAPAs();
  }, [filter, statusFilter, priorityFilter, sourceFilter, externalSearchQuery]);
  
  const fetchCAPAs = async () => {
    try {
      setLoading(true);
      
      // Combine component filters with prop filters
      const combinedFilter: any = {
        ...filter,
      };
      
      if (statusFilter) {
        combinedFilter.status = statusFilter;
      }
      
      if (priorityFilter) {
        combinedFilter.priority = priorityFilter;
      }
      
      if (sourceFilter) {
        combinedFilter.source = sourceFilter;
      }
      
      const fetchedCAPAs = await getCAPAs(combinedFilter);
      
      // Apply search filter in memory
      let filteredCAPAs = [...fetchedCAPAs];
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredCAPAs = filteredCAPAs.filter(capa => 
          capa.title.toLowerCase().includes(query) || 
          (capa.description && capa.description.toLowerCase().includes(query))
        );
      }
      
      // Apply limit if specified
      if (limit && limit > 0) {
        filteredCAPAs = filteredCAPAs.slice(0, limit);
      }
      
      setCapas(filteredCAPAs);
    } catch (error) {
      console.error('Error fetching CAPAs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRowClick = (capa: CAPA) => {
    navigate(`/capa/${capa.id}`);
  };
  
  const handleSearch = () => {
    fetchCAPAs();
  };
  
  const getStatusBadge = (status: CAPAStatus) => {
    switch (status) {
      case CAPAStatus.Open:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Open</Badge>;
      case CAPAStatus.InProgress:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">In Progress</Badge>;
      case CAPAStatus.Completed:
        return <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>;
      case CAPAStatus.Closed:
        return <Badge variant="outline" className="bg-green-50 text-green-700">Closed</Badge>;
      case CAPAStatus.Overdue:
        return <Badge variant="outline" className="bg-red-50 text-red-700">Overdue</Badge>;
      case CAPAStatus.PendingVerification:
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Pending Verification</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: CAPAPriority) => {
    switch (priority) {
      case CAPAPriority.Critical:
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case CAPAPriority.High:
        return <Badge className="bg-amber-100 text-amber-800">High</Badge>;
      case CAPAPriority.Medium:
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
      case CAPAPriority.Low:
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };
  
  const getStatusIcon = (status: CAPAStatus) => {
    switch (status) {
      case CAPAStatus.Completed:
      case CAPAStatus.Closed:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case CAPAStatus.Overdue:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case CAPAStatus.Open:
      case CAPAStatus.InProgress:
      case CAPAStatus.PendingVerification:
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search CAPAs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleSearch}
            size="icon"
            variant="ghost"
            className="h-10 w-10"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={value => setStatusFilter(value as CAPAStatus)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value={CAPAStatus.Open}>Open</SelectItem>
              <SelectItem value={CAPAStatus.InProgress}>In Progress</SelectItem>
              <SelectItem value={CAPAStatus.Completed}>Completed</SelectItem>
              <SelectItem value={CAPAStatus.Closed}>Closed</SelectItem>
              <SelectItem value={CAPAStatus.Overdue}>Overdue</SelectItem>
              <SelectItem value={CAPAStatus.PendingVerification}>Pending Verification</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={value => setPriorityFilter(value as CAPAPriority)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priorities</SelectItem>
              <SelectItem value={CAPAPriority.Critical}>Critical</SelectItem>
              <SelectItem value={CAPAPriority.High}>High</SelectItem>
              <SelectItem value={CAPAPriority.Medium}>Medium</SelectItem>
              <SelectItem value={CAPAPriority.Low}>Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New CAPA
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">Source</TableHead>
              <TableHead className="w-[120px]">Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading CAPAs...
                </TableCell>
              </TableRow>
            ) : capas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No CAPAs found
                </TableCell>
              </TableRow>
            ) : (
              capas.map((capa) => (
                <TableRow 
                  key={capa.id} 
                  className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => handleRowClick(capa)}
                >
                  <TableCell className="font-medium">{capa.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      {getStatusIcon(capa.status as CAPAStatus)}
                      <div>
                        <div className="font-medium">{capa.title}</div>
                        {capa.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {capa.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(capa.priority as CAPAPriority)}</TableCell>
                  <TableCell>{getStatusBadge(capa.status as CAPAStatus)}</TableCell>
                  <TableCell>{capa.source}</TableCell>
                  <TableCell>
                    {capa.due_date ? new Date(capa.due_date).toLocaleDateString() : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CAPAList;
