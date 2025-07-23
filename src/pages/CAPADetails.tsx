import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
import CAPARiskAssessment from '@/components/capa/CAPARiskAssessment';
import CAPARootCauseAnalysis from '@/components/capa/CAPARootCauseAnalysis';
import CAPAComplianceTracker from '@/components/capa/CAPAComplianceTracker';
import CAPAEditForm from '@/components/capa/CAPAEditForm';
import { UpdateCAPARequest } from '@/types/capa';
import { ArrowLeft, Edit, Save } from 'lucide-react';
const CAPADetails: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';
  const [capa, setCAPA] = useState<CAPA | null>(null);
  const [activities, setActivities] = useState<CAPAActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(isEditMode);
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
        variant: 'destructive'
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
      const updatedCAPA = await updateCAPA(id, {
        status: newStatus
      });
      setCAPA(updatedCAPA);
      toast({
        title: 'Status Updated',
        description: `CAPA status changed to ${newStatus}`
      });
    } catch (err) {
      console.error('Error updating CAPA status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update CAPA status',
        variant: 'destructive'
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
  const handleUpdateCAPA = async (updates: UpdateCAPARequest) => {
    if (!id) return;
    try {
      setUpdating(true);
      const updatedCAPA = await updateCAPA(id, updates);
      setCAPA(updatedCAPA);
      setEditMode(false);

      // Update URL to remove edit mode
      navigate(`/capa/${id}`, {
        replace: true
      });
      toast({
        title: 'Success',
        description: 'CAPA updated successfully'
      });
    } catch (err) {
      console.error('Error updating CAPA:', err);
      toast({
        title: 'Error',
        description: 'Failed to update CAPA',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setUpdating(false);
    }
  };
  const handleEditToggle = () => {
    if (editMode) {
      setEditMode(false);
      navigate(`/capa/${id}`, {
        replace: true
      });
    } else {
      setEditMode(true);
      navigate(`/capa/${id}?mode=edit`, {
        replace: true
      });
    }
  };
  if (loading) {
    return <div>Loading CAPA details...</div>;
  }
  if (error || !capa) {
    return <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || 'CAPA not found'}
        </AlertDescription>
      </Alert>;
  }
  return <div className="space-y-6 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/capa')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to CAPAs
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{capa.title}</h1>
            <p className="text-muted-foreground">
              ID: {capa.id} • Created: {new Date(capa.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant={editMode ? "default" : "outline"} size="sm" onClick={handleEditToggle} className="flex items-center gap-2" disabled={updating}>
            {editMode ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            {editMode ? 'View Mode' : 'Edit Mode'}
          </Button>
          
          <Badge variant="outline" className="text-sm font-normal px-2 py-1">
            {capa.priority}
          </Badge>
          <Badge variant="outline" className="text-sm font-normal px-2 py-1">
            {capa.source}
          </Badge>
          <Badge className={`text-sm font-normal px-2 py-1 ${capa.status === CAPAStatus.Pending_Verification ? 'bg-red-100 text-red-800' : capa.status === CAPAStatus.Closed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {capa.status}
          </Badge>
        </div>
      </div>
      
      <Separator />
      
      {editMode ? <CAPAEditForm capa={capa} onSave={handleUpdateCAPA} onCancel={() => setEditMode(false)} loading={updating} /> : <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <h3 className="text-sm font-medium text-muted-foreground">Source Reference</h3>
                  <p className="mt-1">{capa.source_id || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simplified Workflow Management - Replace the complex workflow */}
          <CAPASimpleWorkflow capa={capa} onWorkflowUpdate={handleWorkflowUpdate} />
          
          {/* Enhanced Analysis Section */}
          <CAPARiskAssessment capaId={capa.id} onSave={assessment => console.log('Risk assessment saved:', assessment)} />
          
          <CAPARootCauseAnalysis capaId={capa.id} onSave={analysis => console.log('Root cause analysis saved:', analysis)} />
          
          <CAPAComplianceTracker capaId={capa.id} onUpdate={compliance => console.log('Compliance updated:', compliance)} />
          
          <Tabs defaultValue="activity">
            <TabsList>
              <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
              <TabsTrigger value="documents">Related Documents</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="effectiveness">Effectiveness Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="p-1">
              <CAPAActivityList capaId={capa.id} activities={activities} loading={activitiesLoading} />
            </TabsContent>
            
            <TabsContent value="documents" className="p-1">
              <Card>
                <CardHeader>
                  <CardTitle>Related Documents</CardTitle>
                  <CardDescription>Documents associated with this CAPA</CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentList documents={[]} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attachments" className="p-1">
              <CAPAAttachments capaId={capa.id} />
            </TabsContent>
            
            <TabsContent value="effectiveness" className="p-1">
              <Card>
                <CardHeader>
                  <CardTitle>Effectiveness Review</CardTitle>
                  <CardDescription>Comprehensive effectiveness assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <CAPAEffectivenessMonitor id={capa.id} implementationDate={capa.completion_date || capa.updated_at} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <CAPAStatusForm capaId={capa.id} currentStatus={capa.status} onUpdateStatus={handleUpdateStatus} />
          
          <CAPAInfoPanel capa={capa} />
          
          {capa.status === CAPAStatus.Closed && <CAPAEffectivenessMonitor id={capa.id} implementationDate={capa.completion_date || capa.updated_at} />}
        </div>
      </div>}
    </div>;
};
export default CAPADetails;