
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowUpDown, FileText, Calendar, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CAPA, CAPAFilter, CAPAFetchParams } from '@/types/capa';
import { useToast } from '@/components/ui/use-toast';
import { getCAPAs } from '@/services/capaService';
import { Link } from 'react-router-dom';

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
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('due_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  
  // Define translated filter values for API calls
  const getFilterParams = (): CAPAFetchParams => {
    const params: CAPAFetchParams = {
      page,
      limit: 10,
      sortBy,
      sortDirection,
      searchQuery: searchQuery || undefined
    };
    
    if (filters.status && filters.status !== 'all') {
      params.status = filters.status.replace(/-/g, '_');
    }
    
    if (filters.priority && filters.priority !== 'all') {
      params.priority = filters.priority;
    }
    
    if (filters.source && filters.source !== 'all') {
      params.source = filters.source.replace(/-/g, '_');
    }
    
    if (filters.dueDate && filters.dueDate !== 'all') {
      const today = new Date();
      
      if (filters.dueDate === 'overdue') {
        params.dueDateTo = today.toISOString().split('T')[0];
      } else if (filters.dueDate === 'today') {
        params.dueDateFrom = today.toISOString().split('T')[0];
        params.dueDateTo = today.toISOString().split('T')[0];
      } else if (filters.dueDate === 'this-week') {
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
        params.dueDateFrom = today.toISOString().split('T')[0];
        params.dueDateTo = endOfWeek.toISOString().split('T')[0];
      } else if (filters.dueDate === 'this-month') {
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        params.dueDateFrom = today.toISOString().split('T')[0];
        params.dueDateTo = endOfMonth.toISOString().split('T')[0];
      }
    }
    
    return params;
  };
  
  useEffect(() => {
    fetchCAPAs();
  }, [filters, searchQuery, sortBy, sortDirection, page]);
  
  const fetchCAPAs = async () => {
    try {
      setLoading(true);
      const filterParams = getFilterParams();
      const data = await getCAPAs(filterParams);
      setCapas(data);
    } catch (error) {
      console.error("Error fetching CAPAs:", error);
      toast({
        title: "Error",
        description: "Failed to load CAPA records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>CAPA Records</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : capas.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">No CAPAs Found</h3>
            <p className="text-gray-500 mt-1">
              There are no CAPA records matching your current filters.
            </p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <Button variant="ghost" onClick={() => handleSort('title')} className="p-0 h-auto font-medium">
                        Title
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <Button variant="ghost" onClick={() => handleSort('priority')} className="p-0 h-auto font-medium">
                        Priority
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <Button variant="ghost" onClick={() => handleSort('source')} className="p-0 h-auto font-medium">
                        Source
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <Button variant="ghost" onClick={() => handleSort('due_date')} className="p-0 h-auto font-medium">
                        Due Date
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {capas.map((capa) => (
                    <tr key={capa.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link to={`/capa/${capa.id}`} className="text-blue-600 hover:underline font-medium">
                          {capa.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={
                          capa.status === 'Open' ? 'bg-blue-100 text-blue-800' : 
                          capa.status === 'In_Progress' ? 'bg-amber-100 text-amber-800' :
                          capa.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          capa.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {capa.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={
                          capa.priority === 'Critical' ? 'bg-red-100 text-red-800' : 
                          capa.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                          capa.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {capa.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {capa.source.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {capa.due_date ? format(new Date(capa.due_date), 'MMM d, yyyy') : 'N/A'}
                          {capa.due_date && new Date(capa.due_date) < new Date() && capa.status !== 'Completed' && (
                            <AlertCircle className="h-4 w-4 ml-2 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {capa.assigned_to}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => setPage(page - 1)} 
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <span>Page {page}</span>
              <Button 
                variant="outline" 
                onClick={() => setPage(page + 1)} 
                disabled={capas.length < 10 || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPAList;
