
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, PlusCircle, Search } from 'lucide-react';
import { CAPA, CAPAListProps, CAPAStatus, CAPAPriority, CAPASource } from '@/types/capa';

const CAPAList: React.FC<CAPAListProps> = ({ 
  items, 
  capas,
  loading, 
  error, 
  onCAPAClick 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CAPAStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<CAPAPriority | ''>('');
  const [filteredItems, setFilteredItems] = useState<CAPA[]>([]);
  const navigate = useNavigate();

  // Use items or capas, whichever is provided
  const dataSource = items || capas || [];

  useEffect(() => {
    if (dataSource) {
      let filtered = [...dataSource];
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(capa => 
          capa.title.toLowerCase().includes(query) || 
          (capa.description && capa.description.toLowerCase().includes(query))
        );
      }
      
      // Apply status filter
      if (statusFilter) {
        filtered = filtered.filter(capa => capa.status === statusFilter);
      }
      
      // Apply priority filter
      if (priorityFilter) {
        filtered = filtered.filter(capa => capa.priority === priorityFilter);
      }
      
      setFilteredItems(filtered);
    }
  }, [dataSource, searchQuery, statusFilter, priorityFilter]);

  const getStatusBadge = (status: CAPAStatus) => {
    switch (status) {
      case 'Open':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Open</Badge>;
      case 'In Progress':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">In Progress</Badge>;
      case 'Completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>;
      case 'Closed':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Closed</Badge>;
      case 'Overdue':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Overdue</Badge>;
      case 'Pending Verification':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Pending Verification</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: CAPAPriority) => {
    switch (priority) {
      case 'Critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'High':
        return <Badge className="bg-amber-100 text-amber-800">High</Badge>;
      case 'Medium':
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };
  
  const getStatusIcon = (status: CAPAStatus) => {
    switch (status) {
      case 'Completed':
      case 'Closed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'Open':
      case 'In Progress':
      case 'Pending Verification':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleNewCapa = () => {
    navigate('/capa/new');
  };

  if (error) {
    return <div className="p-4 bg-red-50 text-red-800 rounded-md">{error}</div>;
  }

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
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={value => setStatusFilter(value as CAPAStatus)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Pending Verification">Pending Verification</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={value => setPriorityFilter(value as CAPAPriority)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priorities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleNewCapa}>
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
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No CAPAs found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((capa) => (
                <TableRow 
                  key={capa.id} 
                  className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => onCAPAClick?.(capa)}
                >
                  <TableCell className="font-medium">{capa.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      {getStatusIcon(capa.status)}
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
                  <TableCell>{getPriorityBadge(capa.priority)}</TableCell>
                  <TableCell>{getStatusBadge(capa.status)}</TableCell>
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
