import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AlertCircle, BookOpen, Calendar, CheckCircle2, ChevronRight, Clock, Edit, FileText, Loader2, Save, Trash2, X } from 'lucide-react';
import { CAPA, CAPAStatus, CAPAEffectivenessRating } from '@/types/capa';
import { deleteCAPA } from '@/services/capaService';
import { mapInternalToStatus, mapStatusToInternal } from '@/services/capa/capaStatusService';

interface CAPADetailsProps {
  capa: CAPA;
  onClose: () => void;
  onUpdate: (updatedCAPA: CAPA) => void;
}

const CAPADetails: React.FC<CAPADetailsProps> = ({ capa, onClose, onUpdate }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedData, setEditedData] = useState<CAPA>(capa);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setEditedData(capa);
  }, [capa]);

  const handleStatusChange = (newStatus: string) => {
    setEditedData({
      ...editedData,
      status: mapStatusToInternal(newStatus as any)
    });

    // If changing to closed and no completion date, set it to today
    if (newStatus === 'Closed' && !editedData.completionDate) {
      setEditedData({
        ...editedData,
        status: mapStatusToInternal(newStatus as any),
        completionDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setEditedData({
      ...editedData,
      [name]: checked
    });
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      // In a real app, you would call an API to update the CAPA
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onUpdate(editedData);
      setIsEditing(false);
      
      toast({
        title: "CAPA Updated",
        description: "CAPA details have been updated successfully"
      });
    } catch (error) {
      console.error('Error updating CAPA:', error);
      toast({
        title: "Error",
        description: "Failed to update CAPA details",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteCAPA(capa.id);
      
      toast({
        title: "CAPA Deleted",
        description: "CAPA has been deleted successfully"
      });
      
      onClose();
    } catch (error) {
      console.error('Error deleting CAPA:', error);
      toast({
        title: "Error",
        description: "Failed to delete CAPA",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusBadge = (status: CAPAStatus) => {
    // Convert internal status to display value
    const displayStatus = mapInternalToStatus(status);
    
    switch (status) {
      case 'open':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            {displayStatus}
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            {displayStatus}
          </Badge>
        );
      case 'closed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            {displayStatus}
          </Badge>
        );
      case 'verified':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            {displayStatus}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {displayStatus}
          </Badge>
        );
    }
  };

  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return (
          <Badge className="bg-red-100 text-red-800">
            Critical
          </Badge>
        );
      case 'high':
        return (
          <Badge className="bg-orange-100 text-orange-800">
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-green-100 text-green-800">
            Low
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {priority}
          </Badge>
        );
    }
  };

  const renderEffectivenessRating = (rating: CAPAEffectivenessRating) => {
    switch (rating) {
      case 'excellent':
        return (
          <Badge className="bg-green-100 text-green-800">
            Excellent
          </Badge>
        );
      case 'good':
        return (
          <Badge className="bg-teal-100 text-teal-800">
            Good
          </Badge>
        );
      case 'adequate':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Adequate
          </Badge>
        );
      case 'poor':
        return (
          <Badge className="bg-amber-100 text-amber-800">
            Poor
          </Badge>
        );
      case 'ineffective':
        return (
          <Badge className="bg-red-100 text-red-800">
            Ineffective
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            Not Rated
          </Badge>
        );
    }
  };

  // Rendering related documents section
  const renderRelatedDocuments = () => {
    if (!capa.relatedDocuments || capa.relatedDocuments.length === 0) {
      return (
        <div className="bg-gray-50 p-4 text-center rounded-md border border-gray-100">
          <p className="text-gray-500">No related documents</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {capa.relatedDocuments.map((doc) => (
          <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-blue-500 mr-2" />
              <span>{doc.title}</span>
            </div>
            <Badge variant="outline">{doc.type}</Badge>
          </div>
        ))}
      </div>
    );
  };

  // Rendering related training section
  const renderRelatedTraining = () => {
    if (!capa.relatedTraining || capa.relatedTraining.length === 0) {
      return (
        <div className="bg-gray-50 p-4 text-center rounded-md border border-gray-100">
          <p className="text-gray-500">No related training</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {capa.relatedTraining.map((training) => (
          <div key={training.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 text-green-500 mr-2" />
              <span>{training.title}</span>
            </div>
            <Badge variant="outline">{training.type}</Badge>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-xl">{capa.title}</CardTitle>
          <CardDescription>
            CAPA #{capa.id} | Created on {new Date(capa.createdDate).toLocaleDateString()}
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                Save
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the CAPA
                      and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Status</Label>
            {isEditing ? (
              <Select 
                value={mapInternalToStatus(editedData.status)} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div>{renderStatusBadge(capa.status)}</div>
            )}
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Priority</Label>
            {isEditing ? (
              <Select 
                value={editedData.priority} 
                onValueChange={(value) => setEditedData({...editedData, priority: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div>{renderPriorityBadge(capa.priority)}</div>
            )}
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Source</Label>
            <div className="flex items-center">
              <Badge variant="outline" className="capitalize">
                {capa.source.replace('_', ' ')}
              </Badge>
              {capa.sourceId && (
                <span className="text-xs text-gray-500 ml-2">
                  ID: {capa.sourceId}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Due Date</Label>
            <div className="flex items-center">
              {isEditing ? (
                <Input 
                  type="date" 
                  name="dueDate"
                  value={editedData.dueDate}
                  onChange={handleInputChange}
                />
              ) : (
                <>
                  <Calendar className="h-4 w-4 text-gray-500 mr-1.5" />
                  <span>{new Date(capa.dueDate).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Completion Date</Label>
            <div className="flex items-center">
              {isEditing ? (
                <Input 
                  type="date" 
                  name="completionDate"
                  value={editedData.completionDate || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-gray-500 mr-1.5" />
                  <span>
                    {capa.completionDate ? new Date(capa.completionDate).toLocaleDateString() : 'Not completed'}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Assigned To</Label>
            <div className="flex items-center">
              {isEditing ? (
                <Input 
                  name="assignedTo"
                  value={editedData.assignedTo}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{capa.assignedTo}</span>
              )}
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="related">Related Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Description</Label>
              {isEditing ? (
                <Textarea 
                  name="description"
                  value={editedData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                  {capa.description}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Root Cause</Label>
              {isEditing ? (
                <Textarea 
                  name="rootCause"
                  value={editedData.rootCause || ''}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe the root cause of the issue"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                  {capa.rootCause || 'No root cause analysis documented'}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Corrective Action</Label>
                {isEditing ? (
                  <Textarea 
                    name="correctiveAction"
                    value={editedData.correctiveAction || ''}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe the corrective action taken"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                    {capa.correctiveAction || 'No corrective action documented'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Preventive Action</Label>
                {isEditing ? (
                  <Textarea 
                    name="preventiveAction"
                    value={editedData.preventiveAction || ''}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe the preventive action taken"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                    {capa.preventiveAction || 'No preventive action documented'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Department</Label>
              {isEditing ? (
                <Input 
                  name="department"
                  value={editedData.department || ''}
                  onChange={handleInputChange}
                  placeholder="Department responsible"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                  {capa.department || 'No department specified'}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Label>FSMA 204 Compliant</Label>
              {isEditing ? (
                <Switch 
                  checked={editedData.fsma204Compliant || false}
                  onCheckedChange={(checked) => handleSwitchChange('fsma204Compliant', checked)}
                />
              ) : (
                <Badge variant={capa.fsma204Compliant ? "success" : "outline"}>
                  {capa.fsma204Compliant ? 'Yes' : 'No'}
                </Badge>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Effectiveness Criteria</Label>
              {isEditing ? (
                <Textarea 
                  name="effectivenessCriteria"
                  value={editedData.effectivenessCriteria || ''}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Define criteria to measure effectiveness"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                  {capa.effectivenessCriteria || 'No effectiveness criteria defined'}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Action Timeline</Label>
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-blue-50 rounded-md border border-blue-100">
                  <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-blue-700">Created: {new Date(capa.createdDate).toLocaleDateString()}</span>
                  <ChevronRight className="h-4 w-4 mx-2 text-blue-300" />
                  <Clock className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-blue-700">Due: {new Date(capa.dueDate).toLocaleDateString()}</span>
                </div>
                
                {capa.completionDate && (
                  <div className="flex items-center p-3 bg-green-50 rounded-md border border-green-100">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-green-700">Completed: {new Date(capa.completionDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                {capa.lastUpdated && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-100">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">Last Updated: {new Date(capa.lastUpdated).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="verification" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Verification Method</Label>
              {isEditing ? (
                <Textarea 
                  name="verificationMethod"
                  value={editedData.verificationMethod || ''}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe how the CAPA will be verified"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                  {capa.verificationMethod || 'No verification method defined'}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Verification Date</Label>
                {isEditing ? (
                  <Input 
                    type="date" 
                    name="verificationDate"
                    value={editedData.verificationDate || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                    {capa.verificationDate ? new Date(capa.verificationDate).toLocaleDateString() : 'Not verified'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Verified By</Label>
                {isEditing ? (
                  <Input 
                    name="verifiedBy"
                    value={editedData.verifiedBy || ''}
                    onChange={handleInputChange}
                    placeholder="Person who verified the CAPA"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                    {capa.verifiedBy || 'Not verified'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Effectiveness Verified</Label>
                {isEditing ? (
                  <Switch 
                    checked={editedData.effectivenessVerified || false}
                    onCheckedChange={(checked) => handleSwitchChange('effectivenessVerified', checked)}
                  />
                ) : (
                  <Badge variant={capa.effectivenessVerified ? "success" : "outline"}>
                    {capa.effectivenessVerified ? 'Yes' : 'No'}
                  </Badge>
                )}
              </div>
              
              {capa.effectivenessVerified && capa.effectivenessRating && (
                <div className="flex items-center mt-2">
                  <Label className="mr-2">Effectiveness Rating:</Label>
                  {renderEffectivenessRating(capa.effectivenessRating)}
                </div>
              )}
            </div>
            
            {(capa.status === 'closed' || capa.status === 'verified') && !capa.effectivenessVerified && (
              <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800">Effectiveness Verification Required</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      This CAPA has been closed but effectiveness has not been verified.
                      Complete the effectiveness assessment to ensure the issue has been properly addressed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="related" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Related Documents</Label>
              {renderRelatedDocuments()}
            </div>
            
            <div className="space-y-2">
              <Label>Related Training</Label>
              {renderRelatedTraining()}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit CAPA
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CAPADetails;
