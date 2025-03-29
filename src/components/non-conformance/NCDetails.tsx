
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
        nonConformance.status,
        'current-user', // This should be the actual user ID in a real app
        `Status changed to ${newStatus}`
      );
      
      // Update local state
      setNonConformance({
        ...nonConformance,
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...(newStatus === 'Under Review' ? { review_date: new Date().toISOString() } : {}),
        ...(newStatus === 'Released' || newStatus === 'Disposed' ? { resolution_date: new Date().toISOString() } : {})
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

  const getStatusClass = () => {
    switch (nonConformance.status) {
      case 'On Hold':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Released':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Disposed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            onClick={() => onClose ? onClose() : navigate('/non-conformance')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{nonConformance?.title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full border ${getStatusClass()}`}>
            {nonConformance?.status}
          </div>
          <NCQuickActions 
            id={id}
            status={nonConformance?.status || ''}
            onEdit={() => navigate(`/non-conformance/${id}/edit`)}
            onView={() => {}} // Already viewing, no action needed
            onStatusChange={handleStatusChange}
            onCreateCAPA={handleGenerateCapa}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Item Name</h3>
                  <p>{nonConformance.item_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Item ID</h3>
                  <p>{nonConformance.item_id || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p>{nonConformance.item_category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reason</h3>
                  <p>{nonConformance.reason_category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Quantity</h3>
                  <p>{nonConformance.quantity ? `${nonConformance.quantity} ${nonConformance.units || ''}` : 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Quantity On Hold</h3>
                  <p>{nonConformance.quantity_on_hold ? `${nonConformance.quantity_on_hold} ${nonConformance.units || ''}` : 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{nonConformance.description || 'No description provided.'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reason Details</h3>
                <p className="mt-1">{nonConformance.reason_details || 'No reason details provided.'}</p>
              </div>
            </CardContent>
          </Card>
          
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
          <Card>
            <CardHeader>
              <CardTitle>Status Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
                <div className={`mt-1 px-3 py-1 rounded-full border inline-block ${getStatusClass()}`}>
                  {nonConformance.status}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reported Date</h3>
                <p>{formatDate(nonConformance.reported_date)}</p>
              </div>
              
              {nonConformance.review_date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Review Date</h3>
                  <p>{formatDate(nonConformance.review_date)}</p>
                </div>
              )}
              
              {nonConformance.resolution_date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Resolution Date</h3>
                  <p>{formatDate(nonConformance.resolution_date)}</p>
                </div>
              )}
              
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                <p>{nonConformance.assigned_to || 'Not assigned'}</p>
              </div>
              
              {nonConformance.reviewer && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reviewer</h3>
                  <p>{nonConformance.reviewer}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                <p>{nonConformance.created_by}</p>
              </div>
              
              {nonConformance.location && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p>{nonConformance.location}</p>
                </div>
              )}
              
              {nonConformance.department && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department</h3>
                  <p>{nonConformance.department}</p>
                </div>
              )}
              
              {nonConformance.priority && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                  <p>{nonConformance.priority}</p>
                </div>
              )}
              
              {nonConformance.risk_level && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Risk Level</h3>
                  <p>{nonConformance.risk_level}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
<Button 
  className="w-full" 
  onClick={() => navigate(`/non-conformance/edit/${id}`)}
>
  Edit
</Button>
                
                {nonConformance.capa_id ? (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate(`/capa/${nonConformance.capa_id}`)}
                  >
                    View CAPA
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={handleGenerateCapa}
                  >
                    Generate CAPA
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NCDetails;
