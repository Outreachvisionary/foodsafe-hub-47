
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  Loader2,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { CAPA, CAPAFilters } from '@/types/capa';
import { fetchCAPAs, deleteCAPA } from '@/services/capaService';
import CAPADetails from './CAPADetails';

interface CAPAListProps {
  filters: {
    status: string;
    priority: string;
    source: string;
    dueDate: string;
  };
  searchQuery: string;
}

const CAPAList: React.FC<CAPAListProps> = ({ filters, searchQuery }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [capaList, setCAPAList] = useState<CAPA[]>([]);
  const [selectedCAPA, setSelectedCAPA] = useState<CAPA | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Fetch CAPA data
  const fetchCAPAData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCAPAs({
        ...filters,
        searchQuery
      });
      setCAPAList(data);
    } catch (error) {
      console.error('Error fetching CAPA data:', error);
      toast.error('Failed to load CAPA data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCAPAData();
  }, [filters, searchQuery]);

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Sort data
  const sortedData = React.useMemo(() => {
    return [...capaList].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
          valueA = priorityOrder[a.priority] || 0;
          valueB = priorityOrder[b.priority] || 0;
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        case 'source':
          valueA = a.source;
          valueB = b.source;
          break;
        case 'dueDate':
          valueA = new Date(a.dueDate).getTime();
          valueB = new Date(b.dueDate).getTime();
          break;
        default:
          valueA = new Date(a.createdDate).getTime();
          valueB = new Date(b.createdDate).getTime();
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [capaList, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // View CAPA details
  const handleViewDetails = (capa: CAPA) => {
    setSelectedCAPA(capa);
    setShowDetails(true);
  };

  // Delete CAPA
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this CAPA?')) {
      try {
        await deleteCAPA(id);
        toast.success('CAPA deleted successfully');
        setCAPAList(capaList.filter(capa => capa.id !== id));
      } catch (error) {
        console.error('Error deleting CAPA:', error);
        toast.error('Failed to delete CAPA');
      }
    }
  };

  // Priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
      case 'in-progress':
        return <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>;
      case 'closed':
        return <Badge className="bg-green-100 text-green-800">Closed</Badge>;
      case 'verified':
        return <Badge className="bg-emerald-100 text-emerald-800">Verified</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {showDetails && selectedCAPA ? (
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setShowDetails(false)}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to CAPA List
          </Button>
          <CAPADetails 
            capa={selectedCAPA} 
            onClose={() => setShowDetails(false)}
            onUpdate={(updatedCAPA) => {
              // Update the CAPA in the list
              setCAPAList(capaList.map(capa => 
                capa.id === updatedCAPA.id ? updatedCAPA : capa
              ));
              setSelectedCAPA(updatedCAPA);
            }}
          />
        </div>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>CAPA List</CardTitle>
              <CardDescription>
                Manage and track all corrective and preventive actions
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={fetchCAPAData}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading CAPA data...</span>
              </div>
            ) : capaList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="font-medium text-gray-900">No CAPAs Found</h3>
                <p className="text-gray-500 mt-1">
                  {searchQuery || Object.values(filters).some(v => v !== 'all') 
                    ? 'Try adjusting your filters or search terms'
                    : 'Create your first CAPA to get started'}
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="w-[300px] cursor-pointer"
                          onClick={() => handleSort('title')}
                        >
                          <div className="flex items-center">
                            Title
                            <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('priority')}
                        >
                          <div className="flex items-center">
                            Priority
                            <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center">
                            Status
                            <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('source')}
                        >
                          <div className="flex items-center">
                            Source
                            <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('dueDate')}
                        >
                          <div className="flex items-center">
                            Due Date
                            <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map((capa) => (
                        <TableRow key={capa.id}>
                          <TableCell className="font-medium">{capa.title}</TableCell>
                          <TableCell>{getPriorityBadge(capa.priority)}</TableCell>
                          <TableCell>{getStatusBadge(capa.status)}</TableCell>
                          <TableCell className="capitalize">{capa.source}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                              {new Date(capa.dueDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetails(capa)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(capa.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-gray-500">
                      Showing page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CAPAList;
