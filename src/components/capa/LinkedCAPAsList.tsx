import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader, AlertCircle, ClipboardList, ArrowUpRight } from 'lucide-react';
import { CAPA, CAPASource } from '@/types/capa';
import { fetchCAPAs } from '@/services/capaService';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface LinkedCAPAsListProps {
  sourceId: string;
  sourceType: 'complaint' | 'audit' | 'nonconformance' | string;
  onCreateCAPAClick?: () => void;
}

const LinkedCAPAsList: React.FC<LinkedCAPAsListProps> = ({ 
  sourceId, 
  sourceType,
  onCreateCAPAClick 
}) => {
  const [linkedCAPAs, setLinkedCAPAs] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadLinkedCAPAs = async () => {
      if (!sourceId) return;
      
      try {
        setLoading(true);
        // Fetch CAPAs linked to this source
        // For now, we'll filter on the frontend since we don't have a direct sourceId filter
        const allCapas = await fetchCAPAs();
        // Match by sourceId and sourceType
        const filtered = allCapas.filter(capa => 
          capa.sourceId === sourceId && 
          capa.source === sourceType as CAPASource
        );
        setLinkedCAPAs(filtered);
      } catch (err) {
        console.error('Error loading linked CAPAs:', err);
        setError('Failed to load linked CAPAs');
        toast.error('Failed to load linked CAPAs');
      } finally {
        setLoading(false);
      }
    };
    
    loadLinkedCAPAs();
  }, [sourceId, sourceType]);
  
  const handleViewCAPA = (capaId: string) => {
    navigate(`/capa/${capaId}`);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <ClipboardList className="h-5 w-5 mr-2" />
            Linked CAPAs
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 flex justify-center">
          <Loader className="h-5 w-5 animate-spin text-primary" />
          <span className="ml-2">Loading linked CAPAs...</span>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <ClipboardList className="h-5 w-5 mr-2" />
            Linked CAPAs
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex items-center text-red-500">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }
  
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

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <ClipboardList className="h-5 w-5 mr-2" />
          Linked CAPAs
        </CardTitle>
        <CardDescription>
          {linkedCAPAs.length 
            ? `${linkedCAPAs.length} CAPA${linkedCAPAs.length !== 1 ? 's' : ''} associated with this ${sourceType}`
            : `No CAPAs are currently linked to this ${sourceType}`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {linkedCAPAs.length > 0 ? (
          <div className="space-y-3">
            {linkedCAPAs.map(capa => (
              <div key={capa.id} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <h4 className="font-medium">{capa.title}</h4>
                    <p className="text-sm text-gray-500 mt-1 truncate">{capa.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(capa.status)}>
                      {capa.status.charAt(0).toUpperCase() + capa.status.slice(1)}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(capa.priority)}>
                      {capa.priority.charAt(0).toUpperCase() + capa.priority.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="text-xs text-gray-500">
                    Created {formatDistanceToNow(new Date(capa.createdDate), { addSuffix: true })}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewCAPA(capa.id)}
                    className="flex items-center"
                  >
                    <span>View CAPA</span>
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center text-center">
            <p className="text-gray-500 mb-4">No CAPAs have been created for this {sourceType} yet.</p>
            {onCreateCAPAClick && (
              <Button onClick={onCreateCAPAClick}>
                Create CAPA
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedCAPAsList;
