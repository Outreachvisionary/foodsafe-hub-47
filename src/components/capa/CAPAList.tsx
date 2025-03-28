
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2, Clock, Eye, Loader } from 'lucide-react';
import { CAPA } from '@/types/capa';
import { fetchCAPAs } from '@/services/capaService';
import { useNavigate } from 'react-router-dom';

interface CAPAListProps {
  filters?: {
    status?: string;
    priority?: string;
    source?: string;
    dueDate?: string;
  };
  searchQuery?: string;
}

const CAPAList: React.FC<CAPAListProps> = ({ filters, searchQuery }) => {
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCapas = async () => {
      setLoading(true);
      try {
        const data = await fetchCAPAs({
          ...filters,
          searchQuery
        });
        setCapas(data);
      } catch (error) {
        console.error('Error loading CAPAs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCapas();
  }, [filters, searchQuery]);
  
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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-purple-500" />;
      case 'closed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'verified':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const viewCAPADetails = (id: string) => {
    navigate(`/capa/${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CAPA List</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="w-full h-12" />
            ))}
          </div>
        ) : capas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No CAPA records found matching your criteria.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {capas.map((capa) => (
                <TableRow key={capa.id}>
                  <TableCell className="font-medium">{capa.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={capa.title}>
                      {capa.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(capa.status)}
                      <span>{getStatusBadge(capa.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(capa.priority)}</TableCell>
                  <TableCell className="capitalize">{capa.source}</TableCell>
                  <TableCell>
                    {formatDate(capa.dueDate)}
                    {new Date(capa.dueDate) < new Date() && 
                      capa.status !== 'closed' && 
                      capa.status !== 'verified' && (
                        <Badge className="ml-2 bg-red-100 text-red-800">Overdue</Badge>
                      )
                    }
                  </TableCell>
                  <TableCell>{capa.assignedTo}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => viewCAPADetails(capa.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPAList;
