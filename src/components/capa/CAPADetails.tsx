
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  ClipboardCheck,
  Clock,
  Edit,
  FileText,
  BarChart3,
  Shield,
  User,
  Users,
  X,
  AlertCircle
} from 'lucide-react';
import { CAPA, CAPAEffectivenessRating } from '@/types/capa';
import { format } from 'date-fns';

interface CAPADetailsProps {
  capa: CAPA;
  onEdit: () => void;
}

const CAPADetails: React.FC<CAPADetailsProps> = ({ capa, onEdit }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Open
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'closed':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Closed
          </Badge>
        );
      case 'verified':
        return (
          <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
            <ClipboardCheck className="h-3 w-3" />
            Verified
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {status}
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Critical
          </Badge>
        );
      case 'high':
        return (
          <Badge className="bg-amber-100 text-amber-800">
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

  const getEffectivenessRatingBadge = (rating?: CAPAEffectivenessRating) => {
    if (!rating) return null;
    
    switch (rating) {
      case 'Effective':
        return (
          <Badge className="bg-green-100 text-green-800">
            Effective
          </Badge>
        );
      case 'Partially Effective':
        return (
          <Badge className="bg-amber-100 text-amber-800">
            Partially Effective
          </Badge>
        );
      case 'Not Effective':
        return (
          <Badge className="bg-red-100 text-red-800">
            Not Effective
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{capa.id}: {capa.title}</CardTitle>
            <CardDescription className="mt-2">{capa.description}</CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {getPriorityBadge(capa.priority)}
            {getStatusBadge(capa.status)}
            {capa.fsma204Compliant && (
              <Badge className="bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                FSMA 204 Compliant
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="related">Related Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Source</h3>
                <p className="mt-1 flex items-center">
                  <span className="capitalize">{capa.source}</span>
                  {capa.sourceId && <span className="text-xs text-gray-500 ml-2">({capa.sourceId})</span>}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                <p className="mt-1 flex items-center">
                  <User className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  <span>{capa.assignedTo}</span>
                  <span className="text-xs text-gray-500 ml-2">({capa.department})</span>
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
                <p className="mt-1 flex items-center">
                  <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  <span>{capa.createdDate}</span>
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                <p className="mt-1 flex items-center">
                  <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  <span>{capa.dueDate}</span>
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1 flex items-center">
                  <Clock className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  <span>{capa.lastUpdated}</span>
                </p>
              </div>
              
              {capa.completedDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Completed Date</h3>
                  <p className="mt-1 flex items-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                    <span>{capa.completedDate}</span>
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="mt-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Root Cause Analysis</h3>
              <p className="mt-1 p-3 bg-gray-50 rounded-md border">{capa.rootCause}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Corrective Action</h3>
              <p className="mt-1 p-3 bg-gray-50 rounded-md border">{capa.correctiveAction}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Preventive Action</h3>
              <p className="mt-1 p-3 bg-gray-50 rounded-md border">{capa.preventiveAction}</p>
            </div>
            
            {capa.verificationMethod && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Verification Method</h3>
                <p className="mt-1 p-3 bg-gray-50 rounded-md border">{capa.verificationMethod}</p>
              </div>
            )}
            
            {capa.status === 'open' && (
              <div className="flex justify-end space-x-3 mt-4">
                <Button variant="outline">Update Plan</Button>
                <Button>Mark In Progress</Button>
              </div>
            )}
            {capa.status === 'in-progress' && (
              <div className="flex justify-end mt-4">
                <Button>Complete Corrective Action</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="verification" className="mt-4 space-y-6">
            {capa.verificationDate ? (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
                  <div className="mt-1 p-3 bg-green-50 rounded-md border border-green-100 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="font-medium">Verified on {capa.verificationDate}</p>
                      <p className="text-sm text-gray-600">By: {capa.verifiedBy}</p>
                      <p className="text-sm text-gray-600">
                        Effectiveness: {capa.effectivenessRating} 
                        {capa.effectivenessScore !== undefined && ` (${capa.effectivenessScore}%)`}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Verification Evidence</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      View Verification Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      View Effectiveness Data
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                  <h4 className="font-medium flex items-center text-amber-800">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Verification Pending
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    This CAPA has not been verified yet. Verification can be performed once corrective actions are complete.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Verification Checklist</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="check1" className="h-4 w-4" disabled />
                      <label htmlFor="check1">Corrective action implemented</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="check2" className="h-4 w-4" disabled />
                      <label htmlFor="check2">Preventive measures in place</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="check3" className="h-4 w-4" disabled />
                      <label htmlFor="check3">Effectiveness verified</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="check4" className="h-4 w-4" disabled />
                      <label htmlFor="check4">Documentation complete</label>
                    </div>
                  </div>
                </div>
                
                {(capa.status === 'closed' || capa.status === 'verified') && (
                  <div className="flex justify-end mt-4">
                    <Button>Verify CAPA</Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="related" className="mt-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Related Documents</h3>
              {capa.relatedDocuments && capa.relatedDocuments.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {capa.relatedDocuments.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>{doc}</span>
                      <Button variant="ghost" size="sm" className="ml-auto h-6">
                        <FileText className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-gray-600 text-sm">No related documents found.</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Related Training</h3>
              {capa.relatedTraining && capa.relatedTraining.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {capa.relatedTraining.map((training: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{training}</span>
                      <Button variant="ghost" size="sm" className="ml-auto h-6">
                        <FileText className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-gray-600 text-sm">No related training found.</p>
              )}
              
              <div className="mt-4">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-1" />
                  Assign Training
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit CAPA
        </Button>
        
        <div className="space-x-2">
          {capa.status === 'open' && (
            <Button>
              <Clock className="h-4 w-4 mr-2" />
              Start CAPA
            </Button>
          )}
          {capa.status === 'in-progress' && (
            <Button>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete CAPA
            </Button>
          )}
          {capa.status === 'closed' && !capa.verificationDate && (
            <Button>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Verify CAPA
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CAPADetails;
