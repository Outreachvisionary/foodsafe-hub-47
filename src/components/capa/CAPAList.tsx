
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { CAPA, CAPAFilter, CAPAStatus, CAPAPriority, CAPASource, CAPAFetchParams } from '@/types/capa';
import { ListActions } from '@/components/ui/list-actions';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteCAPA } from '@/services/capa/capaFetchService';
import { getCAPAs } from '@/services/capaService';
import { isStatusEqual } from '@/services/capa/capaStatusService';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCapaId, setSelectedCapaId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleView = (id: string) => {
    navigate(`/capa/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/capa/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCAPA(id);
      setCapas(capas.filter(capa => capa.id !== id));
      toast({
        title: 'CAPA Deleted',
        description: 'The CAPA has been successfully deleted.',
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting CAPA:', error);
      toast({
        title: 'Error',
        description: 'There was an error deleting the CAPA.',
        variant: 'destructive',
      });
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedCapaId(id);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    const loadCAPAs = async () => {
      try {
        setLoading(true);
        
        const capaFilter: CAPAFilter = {};
        
        if (filters.status !== 'all') {
          capaFilter.status = filters.status as CAPAStatus;
        }
        
        if (filters.priority !== 'all') {
          capaFilter.priority = filters.priority as CAPAPriority;
        }
        
        if (filters.source !== 'all') {
          capaFilter.source = filters.source as CAPASource;
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
        
        const fetchParams: CAPAFetchParams = {
          status: capaFilter.status,
          priority: capaFilter.priority,
          source: capaFilter.source,
          searchQuery: capaFilter.searchTerm,
          ...(capaFilter.dateRange && {
            dueDate: capaFilter.dateRange.end
          })
        };
        
        const data = await getCAPAs();
        setCapas(data);
      } catch (error) {
        console.error('Error loading CAPAs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCAPAs();
  }, [filters, searchQuery]);
  
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
    <>
      <div className="space-y-4">
        {capas.map((capa) => (
          <Card key={capa.id} className="hover:bg-gray-50 transition-colors">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-grow">
                  <div className="flex items-start gap-1">
                    <h3 className="font-medium">{capa.title}</h3>
                    {capa.dueDate && new Date(capa.dueDate) < new Date() && 
                     !isStatusEqual(capa.status, 'Closed') && !isStatusEqual(capa.status, 'Verified') && (
                      <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 truncate">{capa.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-xs capitalize">
                      {capa.source.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {capa.department || 'No Department'}
                    </Badge>
                    {capa.fsma204Compliant && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        FSMA 204 Compliant
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-2">
                    <ListActions
                      onView={() => handleView(capa.id)}
                      onEdit={() => handleEdit(capa.id)}
                      onDelete={() => confirmDelete(capa.id)}
                      disableEdit={isStatusEqual(capa.status, 'Closed') || isStatusEqual(capa.status, 'Verified')}
                    />
                  </div>
                  
                  {capa.dueDate && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Due: {format(new Date(capa.dueDate), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete CAPA"
        description="Are you sure you want to delete this CAPA? This action cannot be undone."
        onConfirm={() => selectedCapaId && handleDelete(selectedCapaId)}
      />
    </>
  );
};

export default CAPAList;
