import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Edit2, 
  FileText, 
  Link2, 
  Loader,
  PenTool, 
  RotateCcw, 
  Send, 
  Timer, 
  Trash2,
  User,
  X as XIcon,
  Save as SaveIcon,
  BookOpen as BookOpenIcon
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { CAPA, CAPAStatus } from '@/types/capa';
import { fetchCAPAById, deleteCAPA, updateCAPA } from '@/services/capaService';
import RootCauseAnalysis from './RootCauseAnalysis';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CAPAEffectivenessMonitor from './CAPAEffectivenessMonitor';
import CAPATraceabilityIntegration from './CAPATraceabilityIntegration';

interface CAPADetailsProps {
  capa: CAPA;
  onClose: () => void;
  onUpdate: (updatedCAPA: CAPA) => void;
}

const CAPADetails: React.FC<CAPADetailsProps> = ({
  capa,
  onClose,
  onUpdate
}) => {
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  const [formData, setFormData] = useState({
    title: capa.title,
    description: capa.description,
    priority: capa.priority,
    status: capa.status,
    assignedTo: capa.assignedTo,
    dueDate: capa.dueDate,
    rootCause: capa.rootCause || '',
    correctiveAction: capa.correctiveAction || '',
    preventiveAction: capa.preventiveAction || '',
    verificationMethod: capa.verificationMethod || '',
  });
  
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const updatedCAPA = await updateCAPA(capa.id, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority as any,
        status: formData.status as any,
        assignedTo: formData.assignedTo,
        dueDate: formData.dueDate,
        rootCause: formData.rootCause,
        correctiveAction: formData.correctiveAction,
        preventiveAction: formData.preventiveAction,
        verificationMethod: formData.verificationMethod,
      });
      
      toast.success('CAPA updated successfully');
      onUpdate(updatedCAPA);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating CAPA:', error);
      toast.error('Failed to update CAPA');
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-purple-500" />;
      case 'closed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'verified':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(capa.status)}
            <CardTitle>{editMode ? 'Edit CAPA' : 'CAPA Details'}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {!editMode && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setEditMode(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="outline" 
              size="icon"
              onClick={onClose}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {!editMode && (
          <p className="text-sm text-muted-foreground">
            ID: {capa.id} | Created: {formatDate(capa.createdDate)}
            {capa.completedDate && ` | Completed: ${formatDate(capa.completedDate)}`}
          </p>
        )}
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="capaplan">CAPA Plan</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="documents">Related Items</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <TabsContent value="details">
            {editMode ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleChange('priority', value)}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange('status', value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Input
                      id="assignedTo"
                      value={formData.assignedTo}
                      onChange={(e) => handleChange('assignedTo', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate.split('T')[0]}
                      onChange={(e) => handleChange('dueDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{capa.title}</h3>
                  <p className="text-gray-700">{capa.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Priority</h4>
                      <div className="mt-1">{getPriorityBadge(capa.priority)}</div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Source</h4>
                      <p className="mt-1 flex items-center">
                        <span className="capitalize">{capa.source}</span>
                        {capa.sourceId && (
                          <span className="ml-1 text-gray-500">({capa.sourceId})</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <div className="mt-1">{getStatusBadge(capa.status)}</div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Due Date</h4>
                      <p className="mt-1 flex items-center">
                        <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                        {formatDate(capa.dueDate)}
                        {new Date(capa.dueDate) < new Date() && capa.status !== 'Closed' && capa.status !== 'Verified' && (
                          <Badge className="ml-2 bg-red-100 text-red-800">Overdue</Badge>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Assigned To</h4>
                  <p className="mt-1 flex items-center">
                    <User className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                    {capa.assignedTo}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="capaplan">
            {editMode ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="rootCause">Root Cause Analysis</Label>
                  <Textarea
                    id="rootCause"
                    value={formData.rootCause}
                    onChange={(e) => handleChange('rootCause', e.target.value)}
                    placeholder="Describe the underlying root cause of the issue"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="correctiveAction">Corrective Action</Label>
                  <Textarea
                    id="correctiveAction"
                    value={formData.correctiveAction}
                    onChange={(e) => handleChange('correctiveAction', e.target.value)}
                    placeholder="Describe actions to correct the immediate issue"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="preventiveAction">Preventive Action</Label>
                  <Textarea
                    id="preventiveAction"
                    value={formData.preventiveAction}
                    onChange={(e) => handleChange('preventiveAction', e.target.value)}
                    placeholder="Describe actions to prevent recurrence"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Root Cause Analysis</h4>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md border">
                    {capa.rootCause || "No root cause analysis has been provided yet."}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Corrective Action</h4>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md border">
                    {capa.correctiveAction || "No corrective action has been defined yet."}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Preventive Action</h4>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md border">
                    {capa.preventiveAction || "No preventive action has been defined yet."}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="verification">
            {editMode ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="verificationMethod">Verification Method</Label>
                  <Textarea
                    id="verificationMethod"
                    value={formData.verificationMethod || ''}
                    onChange={(e) => handleChange('verificationMethod', e.target.value)}
                    placeholder="Describe how the effectiveness of this CAPA will be verified"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Verification Method</h4>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md border">
                    {capa.verificationMethod || "No verification method has been defined yet."}
                  </p>
                </div>
                
                {capa.verificationDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Verification Date</h4>
                    <p className="mt-1 flex items-center">
                      <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                      {formatDate(capa.verificationDate)}
                    </p>
                  </div>
                )}
                
                {capa.verifiedBy && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Verified By</h4>
                    <p className="mt-1 flex items-center">
                      <User className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                      {capa.verifiedBy}
                    </p>
                  </div>
                )}
                
                {capa.effectivenessRating && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Effectiveness Rating</h4>
                    <div className="mt-1">
                      {capa.effectivenessRating === 'Effective' && (
                        <Badge className="bg-green-100 text-green-800">Effective</Badge>
                      )}
                      {capa.effectivenessRating === 'Partially Effective' && (
                        <Badge className="bg-yellow-100 text-yellow-800">Partially Effective</Badge>
                      )}
                      {capa.effectivenessRating === 'Ineffective' && (
                        <Badge className="bg-red-100 text-red-800">Not Effective</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Related Documents</h4>
                {(capa.relatedDocuments && capa.relatedDocuments.length > 0) ? (
                  <div className="mt-2 space-y-2">
                    {capa.relatedDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md border">
                        <FileText className="h-4 w-4 text-blue-500 mr-2" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-gray-500">No related documents</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Related Training</h4>
                {(capa.relatedTraining && capa.relatedTraining.length > 0) ? (
                  <div className="mt-2 space-y-2">
                    {capa.relatedTraining.map((training, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md border">
                        <BookOpenIcon className="h-4 w-4 text-purple-500 mr-2" />
                        <span>{training}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-gray-500">No related training</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">FSMA 204 Compliance</h4>
                <div className="mt-1">
                  {capa.fsma204Compliant ? (
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Not Applicable</Badge>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      {editMode && (
        <CardFooter className="border-t flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              setFormData({
                title: capa.title,
                description: capa.description,
                priority: capa.priority,
                status: capa.status,
                assignedTo: capa.assignedTo,
                dueDate: capa.dueDate,
                rootCause: capa.rootCause || '',
                correctiveAction: capa.correctiveAction || '',
                preventiveAction: capa.preventiveAction || '',
                verificationMethod: capa.verificationMethod || '',
              });
              setEditMode(false);
            }}
          >
            <XIcon className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CAPADetails;
