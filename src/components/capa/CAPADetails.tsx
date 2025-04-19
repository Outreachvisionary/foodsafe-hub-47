
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CAPA, CAPAEffectivenessRating } from '@/types/capa';
import { updateCAPA } from '@/services/capaService';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, NotebookPen, CheckSquare, XSquare, AlertTriangle, RefreshCw, Calendar as CalendarIcon, User, Building, Tag, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { mapInternalToStatus, mapStatusToInternal } from '@/services/capa/capaStatusService';

interface CAPADetailsProps {
  capa: CAPA;
  onClose: () => void;
  onUpdate: (updatedCAPA: CAPA) => void;
}

const CAPADetails: React.FC<CAPADetailsProps> = ({ capa, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Form state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(capa);
  
  useEffect(() => {
    setFormData(capa);
  }, [capa]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleToggleEdit = () => {
    if (editMode) {
      // Cancel editing
      setFormData(capa);
    }
    setEditMode(!editMode);
  };
  
  const handleSave = async () => {
    try {
      setLoading(true);
      const result = await updateCAPA(capa.id, formData);
      onUpdate(result);
      setEditMode(false);
      toast({
        title: "CAPA Updated",
        description: "Changes to the CAPA have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating CAPA:', error);
      toast({
        title: "Error",
        description: "Failed to update CAPA. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (newStatus: string) => {
    try {
      setLoading(true);
      
      // Prepare data for update
      const statusUpdateData = {
        ...capa,
        status: mapStatusToInternal(newStatus)
      };
      
      // Additional fields based on status
      if (newStatus === 'Closed') {
        statusUpdateData.completionDate = new Date().toISOString();
      } else if (newStatus === 'Verified') {
        statusUpdateData.verificationDate = new Date().toISOString();
      }
      
      const result = await updateCAPA(capa.id, statusUpdateData);
      onUpdate(result);
      
      toast({
        title: "Status Updated",
        description: `CAPA status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating CAPA status:', error);
      toast({
        title: "Error",
        description: "Failed to update CAPA status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const renderEditButtons = () => (
    <div className="mt-4 flex justify-end gap-2">
      <Button variant="outline" onClick={handleToggleEdit} disabled={loading}>
        {editMode ? "Cancel" : "Edit"}
      </Button>
      
      {editMode && (
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      )}
    </div>
  );
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase().replace(/[- ]/g, '')) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inprogress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'closed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'verified':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pendingverification':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getEffectivenessRatingColor = (rating: CAPAEffectivenessRating) => {
    if (rating === 'excellent') {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (rating === 'good') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (rating === 'poor') {
      return 'bg-red-100 text-red-800 border-red-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const isOverdue = () => {
    if (capa.status === 'closed' || capa.status === 'verified') return false;
    
    const now = new Date();
    const dueDate = new Date(capa.dueDate);
    return now > dueDate;
  };
  
  const hasRelatedDocuments = capa.relatedDocuments && Array.isArray(capa.relatedDocuments) && capa.relatedDocuments.length > 0;
  const hasRelatedTraining = capa.relatedTraining && Array.isArray(capa.relatedTraining) && capa.relatedTraining.length > 0;
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md shadow-sm border overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b">
          <div>
            <h1 className="text-2xl font-bold">{capa.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created: {formatDate(capa.createdDate)}
              </div>
              <span>•</span>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                By: {capa.createdBy}
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                ID: {capa.id.substring(0, 8)}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(capa.status)}`}>
              {mapInternalToStatus(capa.status)}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(capa.priority)}`}>
              {capa.priority.charAt(0).toUpperCase() + capa.priority.slice(1)}
            </div>
            {isOverdue() && (
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                Overdue
              </div>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 border-b">
            <TabsList className="bg-transparent border-b-0 -mb-px h-12">
              <TabsTrigger value="info" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12">
                Info
              </TabsTrigger>
              <TabsTrigger value="actions" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12">
                Corrective Actions
              </TabsTrigger>
              <TabsTrigger value="effectiveness" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12">
                Effectiveness
              </TabsTrigger>
              <TabsTrigger value="related" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12">
                Related Items
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="info" className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Description</h3>
                  {editMode ? (
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full h-32 p-2 mt-2 border rounded-md"
                    />
                  ) : (
                    <p className="mt-2 text-gray-700">{capa.description}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Root Cause Analysis</h3>
                  {editMode ? (
                    <textarea
                      name="rootCause"
                      value={formData.rootCause || ''}
                      onChange={handleInputChange}
                      className="w-full h-32 p-2 mt-2 border rounded-md"
                      placeholder="Describe the root cause of the issue..."
                    />
                  ) : (
                    <p className="mt-2 text-gray-700">
                      {capa.rootCause || 'No root cause analysis has been documented yet.'}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Due Date</div>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {editMode ? (
                          <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate.split('T')[0]}
                            onChange={handleInputChange}
                            className="w-full p-1 border rounded-md"
                          />
                        ) : (
                          <span className={isOverdue() ? 'text-red-600 font-medium' : ''}>
                            {formatDate(capa.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500">Assigned To</div>
                      <div className="flex items-center mt-1">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {editMode ? (
                          <input
                            type="text"
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleInputChange}
                            className="w-full p-1 border rounded-md"
                          />
                        ) : (
                          <span>{capa.assignedTo}</span>
                        )}
                      </div>
                    </div>
                    
                    {capa.department && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Department</div>
                        <div className="flex items-center mt-1">
                          <Building className="h-4 w-4 mr-2 text-gray-400" />
                          {editMode ? (
                            <input
                              type="text"
                              name="department"
                              value={formData.department || ''}
                              onChange={handleInputChange}
                              className="w-full p-1 border rounded-md"
                            />
                          ) : (
                            <span>{capa.department}</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500">Source</div>
                      <div className="flex items-center mt-1">
                        <Info className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="capitalize">{capa.source.replace('-', ' ')}</span>
                      </div>
                    </div>
                    
                    {capa.completionDate && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Completion Date</div>
                        <div className="flex items-center mt-1">
                          <CheckSquare className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{formatDate(capa.completionDate)}</span>
                        </div>
                      </div>
                    )}
                    
                    {capa.verificationDate && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Verification Date</div>
                        <div className="flex items-center mt-1">
                          <CheckSquare className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{formatDate(capa.verificationDate)}</span>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500">FSMA 204 Compliant</div>
                      <div className="flex items-center mt-1">
                        {capa.isFsma204Compliant ? (
                          <>
                            <CheckSquare className="h-4 w-4 mr-2 text-green-500" />
                            <span className="text-green-600">Yes</span>
                          </>
                        ) : (
                          <>
                            <XSquare className="h-4 w-4 mr-2 text-red-500" />
                            <span className="text-red-600">No</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {!editMode && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {capa.status !== 'closed' && capa.status !== 'verified' && (
                          <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => handleStatusChange('Closed')}
                            disabled={loading}
                          >
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Mark as Closed
                          </Button>
                        )}
                        
                        {capa.status === 'closed' && (
                          <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => handleStatusChange('Verified')}
                            disabled={loading}
                          >
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Mark as Verified
                          </Button>
                        )}
                        
                        {capa.status !== 'open' && (
                          <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => handleStatusChange('Open')}
                            disabled={loading}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reopen CAPA
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            {renderEditButtons()}
          </TabsContent>
          
          <TabsContent value="actions" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium">Corrective Action</h3>
                {editMode ? (
                  <textarea
                    name="correctiveAction"
                    value={formData.correctiveAction || ''}
                    onChange={handleInputChange}
                    className="w-full h-32 p-2 mt-2 border rounded-md"
                    placeholder="Describe the corrective action taken to address the immediate issue..."
                  />
                ) : (
                  <p className="mt-2 text-gray-700">
                    {capa.correctiveAction || 'No corrective action has been documented yet.'}
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Preventive Action</h3>
                {editMode ? (
                  <textarea
                    name="preventiveAction"
                    value={formData.preventiveAction || ''}
                    onChange={handleInputChange}
                    className="w-full h-32 p-2 mt-2 border rounded-md"
                    placeholder="Describe the preventive action taken to prevent recurrence..."
                  />
                ) : (
                  <p className="mt-2 text-gray-700">
                    {capa.preventiveAction || 'No preventive action has been documented yet.'}
                  </p>
                )}
              </div>
            </div>
            
            {capa.verificationMethod && (
              <div className="mt-6">
                <h3 className="text-lg font-medium">Verification Method</h3>
                {editMode ? (
                  <textarea
                    name="verificationMethod"
                    value={formData.verificationMethod || ''}
                    onChange={handleInputChange}
                    className="w-full h-24 p-2 mt-2 border rounded-md"
                    placeholder="Describe how the effectiveness of actions will be verified..."
                  />
                ) : (
                  <p className="mt-2 text-gray-700">{capa.verificationMethod}</p>
                )}
              </div>
            )}
            
            {renderEditButtons()}
          </TabsContent>
          
          <TabsContent value="effectiveness" className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Effectiveness Criteria</h3>
                {editMode ? (
                  <textarea
                    name="effectivenessCriteria"
                    value={formData.effectivenessCriteria || ''}
                    onChange={handleInputChange}
                    className="w-full h-32 p-2 mt-2 border rounded-md"
                    placeholder="Define criteria for determining effectiveness of actions taken..."
                  />
                ) : (
                  <p className="mt-2 text-gray-700">
                    {capa.effectivenessCriteria || 'No effectiveness criteria have been defined yet.'}
                  </p>
                )}
              </div>
              
              {capa.effectivenessRating && (
                <div className="bg-gray-50 p-4 rounded-md border">
                  <h3 className="text-md font-medium">Effectiveness Evaluation</h3>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Rating</div>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getEffectivenessRatingColor(capa.effectivenessRating)}`}>
                          {capa.effectivenessRating}
                        </span>
                      </div>
                    </div>
                    
                    {capa.verifiedBy && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Verified By</div>
                        <div className="mt-1 flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{capa.verifiedBy}</span>
                        </div>
                      </div>
                    )}
                    
                    {capa.verificationDate && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Verification Date</div>
                        <div className="mt-1 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{formatDate(capa.verificationDate)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {renderEditButtons()}
          </TabsContent>
          
          <TabsContent value="related" className="p-6">
            <div className="space-y-6">
              {hasRelatedDocuments ? (
                <div>
                  <h3 className="text-lg font-medium">Related Documents</h3>
                  <div className="mt-3 space-y-2">
                    {capa.relatedDocuments?.map(doc => (
                      <div key={doc.id} className="flex items-center p-3 border rounded-md bg-gray-50 hover:bg-gray-100">
                        <FileText className="h-5 w-5 mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">{doc.title || `Document: ${doc.documentId}`}</div>
                          <div className="text-sm text-gray-500">
                            {doc.type || doc.documentType} • Added on {formatDate(doc.addedAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-md border">
                  <FileText className="h-10 w-10 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No Related Documents</h3>
                  <p className="text-gray-500 mt-1">
                    No documents have been attached to this CAPA yet.
                  </p>
                </div>
              )}
              
              {hasRelatedTraining ? (
                <div>
                  <h3 className="text-lg font-medium">Related Training</h3>
                  <div className="mt-3 space-y-2">
                    {capa.relatedTraining?.map(training => (
                      <div key={training.id} className="flex items-center p-3 border rounded-md bg-gray-50 hover:bg-gray-100">
                        <NotebookPen className="h-5 w-5 mr-3 text-green-500" />
                        <div>
                          <div className="font-medium">{training.title || `Training: ${training.trainingId}`}</div>
                          <div className="text-sm text-gray-500">
                            {training.type || 'Training'} • Added on {formatDate(training.addedAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-md border">
                  <NotebookPen className="h-10 w-10 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No Related Training</h3>
                  <p className="text-gray-500 mt-1">
                    No training records have been linked to this CAPA yet.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CAPADetails;
