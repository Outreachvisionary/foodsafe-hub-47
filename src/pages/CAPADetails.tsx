import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { getCAPA, updateCAPA, getCAPAActivities } from '@/services/capaService';
import { CAPA } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import CAPAActivityList from '@/components/capa/CAPAActivityList';
import CAPAInfoPanel from '@/components/capa/CAPAInfoPanel';
import CAPAEffectivenessMonitor from '@/components/capa/CAPAEffectivenessMonitor';
import CAPAStatusForm from '@/components/capa/CAPAStatusForm';
import CAPAAttachments from '@/components/capa/CAPAAttachments';
import CAPAWorkflowManager from '@/components/capa/CAPAWorkflowManager';
import CAPAWorkflowEngine from '@/components/capa/CAPAWorkflowEngine';
import DocumentList from '@/components/documents/DocumentList';
import { CAPAActivity } from '@/components/capa/CAPAActivityList';
import CAPASimpleWorkflow from '@/components/capa/CAPASimpleWorkflow';

const CAPADetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [capa, setCAPA] = useState<CAPA | null>(null);
  const [activities, setActivities] = useState<CAPAActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      fetchCAPA(id);
      fetchActivities(id);
    }
  }, [id]);
  
  const fetchCAPA = async (capaId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedCAPA = await getCAPA(capaId);
      setCAPA(fetchedCAPA);
    } catch (err) {
      console.error('Error fetching CAPA:', err);
      setError('Failed to load CAPA details');
      
      toast({
        title: 'Error',
        description: 'Could not load CAPA details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchActivities = async (capaId: string) => {
    try {
      setActivitiesLoading(true);
      const fetchedActivities = await getCAPAActivities(capaId);
      setActivities(fetchedActivities as CAPAActivity[]);
    } catch (err) {
      console.error('Error fetching CAPA activities:', err);
    } finally {
      setActivitiesLoading(false);
    }
  };
  
  const handleUpdateStatus = async (newStatus: CAPAStatus) => {
    if (!capa || !id) return;
    
    try {
      const updatedCAPA = await updateCAPA(id, { status: newStatus });
      setCAPA(updatedCAPA);
      
      toast({
        title: 'Status Updated',
        description: `CAPA status changed to ${newStatus}`,
      });
    } catch (err) {
      console.error('Error updating CAPA status:', err);
      
      toast({
        title: 'Error',
        description: 'Failed to update CAPA status',
        variant: 'destructive',
      });
    }
  };

  const handleWorkflowUpdate = () => {
    // Refresh CAPA data and activities when workflow is updated
    if (id) {
      fetchCAPA(id);
      fetchActivities(id);
    }
  };
  
  if (loading) {
    return <div>Loading CAPA details...</div>;
  }
  
  if (error || !capa) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || 'CAPA not found'}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{capa.title}</h1>
          <p className="text-muted-foreground">
            ID: {capa.id} • Created: {new Date(capa.created_at).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm font-normal px-2 py-1">
            {capa.priority}
          </Badge>
          <Badge variant="outline" className="text-sm font-normal px-2 py-1">
            {capa.source}
          </Badge>
          <Badge 
            className={`text-sm font-normal px-2 py-1 ${
              capa.status === CAPAStatus.Pending_Verification ? 'bg-red-100 text-red-800' :
              capa.status === CAPAStatus.Closed ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}
          >
            {capa.status}
          </Badge>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* CAPA Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{capa.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Assigned To</h3>
                  <p className="mt-1">{capa.assigned_to || 'Not assigned'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                  <p className="mt-1">{capa.due_date ? new Date(capa.due_date).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Root Cause</h3>
                <p className="mt-1">{capa.root_cause || 'Not identified yet'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Corrective Action</h3>
                <p className="mt-1">{capa.corrective_action || 'Not defined yet'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Preventive Action</h3>
                <p className="mt-1">{capa.preventive_action || 'Not defined yet'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">FSMA 204 Compliant</h3>
                  <p className="mt-1">{capa.fsma204_compliant ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Source Reference</h3>
                  <p className="mt-1">{capa.source_id || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simplified Workflow Management - Replace the complex workflow */}
          <CAPASimpleWorkflow 
            capa={capa} 
            onWorkflowUpdate={handleWorkflowUpdate}
          />
          
          <Tabs defaultValue="activity">
            <TabsList>
              <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
              <TabsTrigger value="documents">Related Documents</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="p-1">
              <CAPAActivityList 
                capaId={capa.id}
                activities={activities}
                loading={activitiesLoading}
              />
            </TabsContent>
            
            <TabsContent value="documents" className="p-1">
              <Card>
                <CardHeader>
                  <CardTitle>Related Documents</CardTitle>
                  <CardDescription>Documents associated with this CAPA</CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentList 
                    documents={[]} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attachments" className="p-1">
              <CAPAAttachments capaId={capa.id} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <CAPAStatusForm 
            capaId={capa.id}
            currentStatus={capa.status}
            onUpdateStatus={handleUpdateStatus}
          />
          
          <CAPAInfoPanel capa={capa} />
          
          {(capa.status === CAPAStatus.Closed) && (
            <CAPAEffectivenessMonitor 
              id={capa.id}
              implementationDate={capa.completion_date || capa.updated_at}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CAPADetails;
