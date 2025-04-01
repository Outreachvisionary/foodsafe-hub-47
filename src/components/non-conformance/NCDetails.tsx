
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchNonConformanceById, updateNCStatus, updateNCQuantity } from '@/services/nonConformanceService';
import { useState, useEffect } from 'react';
import { NonConformance, NCStatus } from '@/types/non-conformance';
import NCActivityTimeline from './NCActivityTimeline';
import NCAttachmentUploader from './NCAttachmentUploader';
import NCIntegrationsList from './NCIntegrationsList';
import NCQuickActions from './NCQuickActions';
import NCStatusBadge from './NCStatusBadge';
import NCDetailsHeader from './NCDetailsHeader';
import NCItemDetails from './NCItemDetails';
import NCStatusInfo from './NCStatusInfo';
import NCActionsPanel from './NCActionsPanel';

interface NCDetailsProps {
  id: string;
  onClose?: () => void;
}

const NCDetails: React.FC<NCDetailsProps> = ({ id, onClose }) => {
  const [nonConformance, setNonConformance] = useState<NonConformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [changingStatus, setChangingStatus] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadNonConformance = async () => {
      try {
        setLoading(true);
        const ncData = await fetchNonConformanceById(id);
        setNonConformance(ncData);
      } catch (error) {
        console.error('Error loading non-conformance:', error);
        toast({
          title: 'Failed to load data',
          description: 'There was an error loading the non-conformance details.',
          variant: 'destructive',
        });
        
        if (onClose) {
          onClose();
        } else {
          navigate('/non-conformance');
        }
      } finally {
        setLoading(false);
      }
    };

    loadNonConformance();
  }, [id, navigate, onClose, toast]);

  const handleStatusChange = async (newStatus: NCStatus) => {
    if (!nonConformance) return;
    
    try {
      setChangingStatus(true);
      
      await updateNCStatus(
        id,
        newStatus,
        'current-user', // This should be the actual user ID in a real app
        `Status changed to ${newStatus}` // Added comment parameter
      );
      
      // Update local state
      setNonConformance({
        ...nonConformance,
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...(newStatus === 'Under Review' ? { review_date: new Date().toISOString() } : {}),
        ...(newStatus === 'Released' || newStatus === 'Disposed' || newStatus === 'Resolved' || newStatus === 'Closed' 
           ? { resolution_date: new Date().toISOString() } : {})
      });
      
      toast({
        title: 'Status updated',
        description: `Status has been changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Status update failed',
        description: 'There was an error updating the status.',
        variant: 'destructive',
      });
    } finally {
      setChangingStatus(false);
    }
  };

  const handleGenerateCapa = () => {
    // This would be implemented when the CAPA integration is ready
    toast({
      title: 'CAPA Integration',
      description: 'CAPA generation functionality will be implemented soon.',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!nonConformance) {
    return (
      <div className="text-center p-10">
        <h3 className="text-lg font-medium">Non-conformance not found</h3>
        <p className="text-gray-500 mt-2">
          The non-conformance item you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => onClose ? onClose() : navigate('/non-conformance')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NCDetailsHeader 
        nonConformance={nonConformance} 
        onBackClick={() => onClose ? onClose() : navigate('/non-conformance')} 
        onStatusChange={handleStatusChange}
        onEdit={() => navigate(`/non-conformance/edit/${id}`)}
        onViewCapa={nonConformance.capa_id ? () => navigate(`/capa/${nonConformance.capa_id}`) : undefined}
        onCreateCapa={handleGenerateCapa}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <NCItemDetails nonConformance={nonConformance} />
          
          <div className="mt-6">
            <Tabs defaultValue="activity">
              <TabsList>
                <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
                <TabsTrigger value="integrations">Related Items</TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <NCActivityTimeline nonConformanceId={id} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="attachments" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <NCAttachmentUploader nonConformanceId={id} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="integrations" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <NCIntegrationsList nonConformanceId={id} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div>
          <NCStatusInfo nonConformance={nonConformance} />
          <NCActionsPanel 
            id={id} 
            capaId={nonConformance.capa_id} 
            onEdit={() => navigate(`/non-conformance/edit/${id}`)} 
            onGenerateCapa={handleGenerateCapa} 
            onViewCapa={nonConformance.capa_id ? () => navigate(`/capa/${nonConformance.capa_id}`) : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default NCDetails;
