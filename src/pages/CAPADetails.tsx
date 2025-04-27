import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Save, ArrowLeft, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { CAPA, CAPAStatus, CAPAPriority, CAPASource, CAPAActivity } from '@/types/capa';
import { useToast } from '@/components/ui/use-toast';
import { getCAPAById, updateCAPA } from '@/services/capaService';
import { updateCAPAStatus } from '@/services/capa/capaUpdateService';
import { useUser } from '@/contexts/UserContext';
import { getCAPAActivities } from '@/services/capa/capaActivityService';
import CAPAActivityList from '@/components/capa/CAPAActivityList';
import CAPAEffectivenessMonitor from '@/components/capa/CAPAEffectivenessMonitor';
import { isStatusEqual } from '@/services/capa/capaStatusService';

interface CAPADetailsProps {}

const CAPADetails: React.FC<CAPADetailsProps> = () => {
  const { capaId } = useParams<{ capaId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser } = useUser();
  
  const [capa, setCapa] = useState<CAPA | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [activities, setActivities] = useState<CAPAActivity[]>([]);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<CAPAPriority>('Low');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [source, setSource] = useState<CAPASource>('Audit');
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');
  const [department, setDepartment] = useState('');
  const [fsma204Compliant, setFsma204Compliant] = useState(false);
  const [sourceId, setSourceId] = useState('');
  const [sourceReference, setSourceReference] = useState('');
  
  useEffect(() => {
    const loadCAPA = async () => {
      if (!capaId) {
        toast({
          title: "Error",
          description: "CAPA ID is missing",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const capaData = await getCAPAById(capaId);
        
        // Convert DB format to CAPA type
        const transformedCapa: CAPA = {
          id: capaData.id,
          title: capaData.title,
          description: capaData.description,
          status: mapStatusToEnum(capaData.status),
          priority: mapPriorityToEnum(capaData.priority),
          createdAt: capaData.created_at,
          createdBy: capaData.created_by,
          dueDate: capaData.due_date,
          assignedTo: capaData.assigned_to,
          source: mapSourceToEnum(capaData.source),
          completionDate: capaData.completion_date,
          rootCause: capaData.root_cause || '',
          correctiveAction: capaData.corrective_action || '',
          preventiveAction: capaData.preventive_action || '',
          effectivenessCriteria: capaData.effectiveness_criteria,
          effectivenessRating: mapEffectivenessRatingToEnum(capaData.effectiveness_rating),
          effectivenessVerified: capaData.effectiveness_verified,
          verificationDate: capaData.verification_date,
          verificationMethod: capaData.verification_method,
          verifiedBy: capaData.verified_by,
          department: capaData.department || '',
          sourceId: capaData.source_id || '',
          sourceReference: capaData.source_reference || '',
          fsma204Compliant: capaData.fsma204_compliant || false,
          relatedDocuments: [],
          relatedTraining: []
        };
        
        setCapa(transformedCapa);
        
        // Initialize form fields
        setTitle(transformedCapa.title);
        setDescription(transformedCapa.description);
        setPriority(transformedCapa.priority);
        setAssignedTo(transformedCapa.assignedTo);
        setDueDate(transformedCapa.dueDate);
        setSource(transformedCapa.source);
        setRootCause(transformedCapa.rootCause || '');
        setCorrectiveAction(transformedCapa.correctiveAction || '');
        setPreventiveAction(transformedCapa.preventiveAction || '');
        setDepartment(transformedCapa.department || '');
        setFsma204Compliant(transformedCapa.fsma204Compliant || false);
        setSourceId(transformedCapa.sourceId || '');
        setSourceReference(transformedCapa.sourceReference || '');
      } catch (error) {
        console.error("Error loading CAPA:", error);
        toast({
          title: "Error",
          description: "Failed to load CAPA details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadCAPA();
  }, [capaId, toast]);
  
  const mapStatusToEnum = (status: string): CAPAStatus => {
    if (!status) return 'Open';
    
    // Convert spaces to underscores first
    status = status.replace(/ /g, '_');
    
    switch(status.toLowerCase()) {
      case 'open': return 'Open';
      case 'in_progress': return 'In_Progress';
      case 'under_review': return 'Under_Review';
      case 'completed': return 'Completed';
      case 'closed': return 'Closed';
      case 'rejected': return 'Rejected';
      case 'on_hold': return 'On_Hold';
      case 'overdue': return 'Overdue';
      case 'pending_verification': return 'Pending_Verification';
      case 'verified': return 'Verified';
      default: return 'Open';
    }
  };

  const mapPriorityToEnum = (priority: string): CAPAPriority => {
    if (priority === 'Low' || priority === 'Medium' || priority === 'High' || priority === 'Critical') {
      return priority as CAPAPriority;
    }
    return 'Medium';
  };

  const mapSourceToEnum = (source: string): CAPASource => {
    if (source === 'Audit' || source === 'Customer Complaint' || source === 'Internal' || 
        source === 'Regulatory' || source === 'Other') {
      return source as CAPASource;
    }
    return 'Other';
  };

  const mapEffectivenessRatingToEnum = (rating: string | undefined): CAPAEffectivenessRating | undefined => {
    if (!rating) return undefined;
    
    // Convert spaces to underscores first
    rating = rating.replace(/ /g, '_');
    
    switch(rating.toLowerCase()) {
      case 'not_effective': return 'Not_Effective';
      case 'partially_effective': return 'Partially_Effective';
      case 'effective': return 'Effective';
      case 'highly_effective': return 'Highly_Effective';
      default: return undefined;
    }
  };

  useEffect(() => {
    refreshActivities();
  }, [capaId]);
  
  const refreshActivities = useCallback(async () => {
    if (!capaId) return;
    
    try {
      setIsActivitiesLoading(true);
      const activityData = await getCAPAActivities(capaId);
      setActivities(activityData);
    } catch (error) {
      console.error("Error loading CAPA activities:", error);
      toast({
        title: "Error",
        description: "Failed to load CAPA activities",
        variant: "destructive",
      });
    } finally {
      setIsActivitiesLoading(false);
    }
  }, [capaId, toast]);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    
    // Reset form fields to original values
    if (capa) {
      setTitle(capa.title);
      setDescription(capa.description);
      setPriority(capa.priority);
      setAssignedTo(capa.assignedTo);
      setDueDate(capa.dueDate);
      setSource(capa.source);
      setRootCause(capa.rootCause || '');
      setCorrectiveAction(capa.correctiveAction || '');
      setPreventiveAction(capa.preventiveAction || '');
      setDepartment(capa.department || '');
      setFsma204Compliant(capa.fsma204Compliant || false);
      setSourceId(capa.sourceId || '');
      setSourceReference(capa.sourceReference || '');
    }
  };
  
  const handleSaveClick = async () => {
    if (!capaId) {
      toast({
        title: "Error",
        description: "CAPA ID is missing",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const updatedCAPA = {
        id: capaId,
        title: title,
        description: description,
        priority: priority,
        assignedTo: assignedTo,
        dueDate: dueDate,
        source: source,
        rootCause: rootCause,
        correctiveAction: correctiveAction,
        preventiveAction: preventiveAction,
        department: department,
        fsma204Compliant: fsma204Compliant,
        sourceId: sourceId,
        sourceReference: sourceReference
      };
      
      await updateCAPA(capaId, updatedCAPA);
      
      setCapa({ ...capa, ...updatedCAPA } as CAPA);
      setIsEditing(false);
      toast({
        title: "CAPA Updated",
        description: "CAPA details have been successfully updated",
      });
    } catch (error) {
      console.error("Error updating CAPA:", error);
      toast({
        title: "Error",
        description: "Failed to update CAPA details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateCapaStatus = async (newStatus: CAPAStatus) => {
    try {
      setIsUpdatingStatus(true);
      
      const result = await updateCAPAStatus(
        capaId as string,
        newStatus,
        currentUser?.id || 'system'
      );
      
      setCapa(result);
      
      toast({
        title: "CAPA Status Updated",
        description: `Status updated to ${newStatus.replace('_', ' ')}`,
      });
      
      refreshActivities();
    } catch (error) {
      console.error("Error updating CAPA status:", error);
      toast({
        title: "Error",
        description: "Failed to update CAPA status",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  const handleGoBack = () => {
    navigate('/capa');
  };
  
  if (loading || !capa) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading CAPA details...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{capa.title}</h1>
          <p className="text-gray-500">
            <Clock className="inline-block h-4 w-4 mr-1 align-middle" />
            Created on {format(new Date(capa.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        <div>
          <Button variant="outline" onClick={handleGoBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={handleCancelEdit} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleSaveClick} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleEditClick}>Edit Details</Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>CAPA Details</CardTitle>
          <CardDescription>
            View and manage details for this Corrective and Preventive Action.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as CAPAPriority)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <Select
                value={source}
                onValueChange={(value) => setSource(value as CAPASource)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Audit">Audit</SelectItem>
                  <SelectItem value="Customer Complaint">Customer Complaint</SelectItem>
                  <SelectItem value="Internal">Internal</SelectItem>
                  <SelectItem value="Regulatory">Regulatory</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sourceId">Source ID</Label>
              <Input
                id="sourceId"
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="sourceReference">Source Reference</Label>
              <Input
                id="sourceReference"
                value={sourceReference}
                onChange={(e) => setSourceReference(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-1 gap-4">
            <div>
              <Label htmlFor="rootCause">Root Cause</Label>
              <Textarea
                id="rootCause"
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="correctiveAction">Corrective Action</Label>
              <Textarea
                id="correctiveAction"
                value={correctiveAction}
                onChange={(e) => setCorrectiveAction(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="preventiveAction">Preventive Action</Label>
              <Textarea
                id="preventiveAction"
                value={preventiveAction}
                onChange={(e) => setPreventiveAction(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fsma204Compliant"
                checked={fsma204Compliant}
                onCheckedChange={(checked) => setFsma204Compliant(!!checked)}
                disabled={!isEditing}
              />
              <Label htmlFor="fsma204Compliant">FSMA 204 Compliant</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>
            Current status of the CAPA: {capa.status}
            {capa.dueDate && new Date(capa.dueDate) < new Date() && !isStatusEqual(capa.status, 'Closed') && !isStatusEqual(capa.status, 'Verified') && (
              <AlertTriangle className="h-4 w-4 text-red-500 inline-block ml-1 align-middle" />
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Button
              variant="outline"
              onClick={() => updateCapaStatus('Open')}
              disabled={isUpdatingStatus || isStatusEqual(capa.status, 'Open')}
            >
              {isStatusEqual(capa.status, 'Open') ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Open
                </>
              ) : (
                'Mark as Open'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => updateCapaStatus('In_Progress')}
              disabled={isUpdatingStatus || isStatusEqual(capa.status, 'In_Progress')}
            >
              {isStatusEqual(capa.status, 'In_Progress') ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  In Progress
                </>
              ) : (
                'Mark as In Progress'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => updateCapaStatus('Pending_Verification')}
              disabled={isUpdatingStatus || isStatusEqual(capa.status, 'Pending_Verification')}
            >
              {isStatusEqual(capa.status, 'Pending_Verification') ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Pending Verification
                </>
              ) : (
                'Mark as Pending Verification'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => updateCapaStatus('Verified')}
              disabled={isUpdatingStatus || isStatusEqual(capa.status, 'Verified')}
            >
              {isStatusEqual(capa.status, 'Verified') ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verified
                </>
              ) : (
                'Mark as Verified'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => updateCapaStatus('Closed')}
              disabled={isUpdatingStatus || isStatusEqual(capa.status, 'Closed')}
            >
              {isStatusEqual(capa.status, 'Closed') ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Closed
                </>
              ) : (
                'Mark as Closed'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CAPAActivityList capaId={capaId} activities={activities} loading={isActivitiesLoading} onActivityChange={refreshActivities} />
        
        {capa && (
          <CAPAEffectivenessMonitor 
            id={capaId}
            implementationDate={capa.completionDate || capa.createdAt}
          />
        )}
      </div>
    </div>
  );
};

export default CAPADetails;
