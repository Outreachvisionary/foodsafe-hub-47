import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCAPAs } from '@/services/capaService';
import { CAPA, CAPAFilter, CAPAStatus, CAPAPriority, CAPASource } from '@/types/capa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader, Eye, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

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
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadCAPAs = async () => {
      try {
        setLoading(true);
        
        // Build filter based on selected options
        const capaFilter: CAPAFilter = {};
        
        if (filters.status !== 'all') {
          capaFilter.status = [filters.status as CAPAStatus];
        }
        
        if (filters.priority !== 'all') {
          capaFilter.priority = [filters.priority as CAPAPriority];
        }
        
        if (filters.source !== 'all') {
          capaFilter.source = [filters.source as CAPASource];
        }
        
        if (filters.dueDate === 'overdue') {
          capaFilter.dateRange = {
            start: '1970-01-01',
            end: new Date().toISOString()
          };
        }
        
        if (searchQuery) {
          capaFilter.searchTerm = searchQuery;
        }
        
        const data = await fetchCAPAs(capaFilter);
        setCapas(data);
      } catch (error) {
        console.error('Error loading CAPAs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCAPAs();
  }, [filters, searchQuery]);
  
  const handleViewCAPA = (id: string) => {
    navigate(`/capa/${id}`);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      case 'verified': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading CAPAs...</span>
      </div>
    );
  }
  
  if (capas.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No CAPAs found with the current filters.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {capas.map((capa) => (
        <Card key={capa.id} className="hover:bg-gray-50 transition-colors">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-grow">
                <div className="flex items-start gap-1">
                  <h3 className="font-medium">{capa.title}</h3>
                  {new Date(capa.dueDate) < new Date() && capa.status !== 'closed' && capa.status !== 'verified' && (
                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 truncate">{capa.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-xs capitalize">
                    {capa.source}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {capa.department || 'No Department'}
                  </Badge>
                  {capa.isFsma204Compliant && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                      FSMA 204 Compliant
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:items-end gap-2">
                <div className="flex gap-2">
                  <Badge className={`capitalize`}>
                    {capa.status.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline" className={`capitalize`}>
                    {capa.priority}
                  </Badge>
                </div>
                
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Due: {format(new Date(capa.dueDate), 'MMM d, yyyy')}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1" 
                  onClick={() => handleViewCAPA(capa.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CAPAList;
