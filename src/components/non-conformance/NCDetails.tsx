
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { NonConformance } from '@/types/non-conformance';
import { useNonConformanceService } from '@/hooks/useNonConformanceService';
import { useToast } from '@/hooks/use-toast';
import { NCWorkflowTimeline } from './NCWorkflowTimeline';
import { format } from 'date-fns';
import { CheckCircle, AlertCircle, Clock, Calendar } from 'lucide-react';
import { LinkedCAPAsList } from './LinkedCAPAsList';

interface NCDetailsProps {
  id: string;
}

export const NCDetails: React.FC<NCDetailsProps> = ({ id }) => {
  const [nc, setNc] = useState<NonConformance | null>(null);
  const { fetchNonConformanceById, loading, error } = useNonConformanceService();
  const { toast } = useToast();

  useEffect(() => {
    const loadNC = async () => {
      try {
        const data = await fetchNonConformanceById(id);
        if (data) {
          setNc(data);
        } else {
          toast({
            title: "Error",
            description: "Could not load non-conformance details",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('Error fetching non-conformance:', err);
        toast({
          title: "Error",
          description: "An error occurred while loading non-conformance details",
          variant: "destructive"
        });
      }
    };

    loadNC();
  }, [id, fetchNonConformanceById, toast]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading non-conformance details...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>;
  }

  if (!nc) {
    return <div className="p-4">No non-conformance found with ID: {id}</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'On Hold':
        return <Badge className="bg-yellow-100 text-yellow-800">On Hold</Badge>;
      case 'Under Review':
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>;
      case 'Resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'Closed':
        return <Badge className="bg-purple-100 text-purple-800">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{nc.title}</h2>
        {nc.capa_id && (
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">CAPA Created:</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">{nc.capa_id}</Badge>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg">{nc.item_name}</h3>
              <p className="text-sm text-gray-500">{nc.item_category}</p>
            </div>
            {getStatusBadge(nc.status)}
          </div>

          <p className="text-gray-700">{nc.description}</p>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-gray-500">Category</div>
              <div className="text-sm">{nc.category}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Severity</div>
              <div className="text-sm">{nc.severity}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Source</div>
              <div className="text-sm">{nc.source}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Department</div>
              <div className="text-sm">{nc.department}</div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-medium text-gray-500">Reported Date</div>
              <div className="text-sm flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                {format(new Date(nc.reported_date), 'MMM d, yyyy')}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Reported By</div>
              <div className="text-sm">{nc.created_by}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">Assigned To</div>
              <div className="text-sm">{nc.assigned_to || 'Unassigned'}</div>
            </div>
          </div>

          <Separator />

          {nc.capa_id && (
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <CheckCircle className="text-blue-500 h-5 w-5 mr-2" />
                <h3 className="font-medium">CAPA Reference</h3>
              </div>
              <p className="text-sm mb-2">
                A Corrective and Preventive Action has been created for this non-conformance.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-600 bg-white" 
              >
                View CAPA Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NCWorkflowTimeline ncId={nc.id} />
        
        {nc.capa_id ? (
          <LinkedCAPAsList capaIds={[nc.capa_id]} />
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="text-amber-500 h-5 w-5 mr-2" />
                <h3 className="font-medium">No CAPA Created</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                No Corrective and Preventive Action (CAPA) has been created for this non-conformance yet. 
                Creating a CAPA can help prevent similar issues in the future.
              </p>
              <Button>Create CAPA</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NCDetails;
