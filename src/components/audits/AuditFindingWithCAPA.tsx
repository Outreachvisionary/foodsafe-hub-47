
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import { Calendar, AlertTriangle, FileText, ClipboardList, Users, BookOpen } from 'lucide-react';
import TrainingIntegration from './TrainingIntegration';

interface AuditFinding {
  id: string;
  auditId: string;
  description: string;
  severity: 'critical' | 'major' | 'minor' | 'observation';
  status: 'open' | 'in-progress' | 'closed';
  dateIdentified: string;
}

interface CAPA {
  id: string;
  findingId: string;
  rootCause: string;
  correctionPlan: string;
  preventionPlan: string;
  assignedTo: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'closed' | 'verified';
}

interface AuditFindingWithCAPAProps {
  finding: AuditFinding;
  capa?: CAPA;
  onCAPACreated?: (capa: CAPA) => void;
}

const AuditFindingWithCAPA: React.FC<AuditFindingWithCAPAProps> = ({
  finding,
  capa,
  onCAPACreated
}) => {
  const { toast } = useToast();
  const [showCAPAForm, setShowCAPAForm] = useState(false);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  
  const [rootCause, setRootCause] = useState('');
  const [correctionPlan, setCorrectionPlan] = useState('');
  const [preventionPlan, setPreventionPlan] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'major':
        return 'bg-amber-100 text-amber-800';
      case 'minor':
        return 'bg-yellow-100 text-yellow-800';
      case 'observation':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'verified':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitCAPA = () => {
    if (!rootCause || !correctionPlan || !preventionPlan || !assignedTo || !dueDate) {
      toast({
        title: "Missing Information",
        description: "Please complete all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new CAPA
    const newCAPA: CAPA = {
      id: `capa-${Date.now()}`,
      findingId: finding.id,
      rootCause,
      correctionPlan,
      preventionPlan,
      assignedTo,
      dueDate,
      status: 'open'
    };
    
    // Simulate API call
    setTimeout(() => {
      if (onCAPACreated) {
        onCAPACreated(newCAPA);
      }
      
      toast({
        title: "CAPA Created",
        description: "Corrective and preventive action plan has been created"
      });
      
      setShowCAPAForm(false);
    }, 500);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Finding #{finding.id}</CardTitle>
              <Badge className={getSeverityColor(finding.severity)}>
                {finding.severity}
              </Badge>
            </div>
            <CardDescription>
              Audit #{finding.auditId} | {finding.dateIdentified}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(finding.status)}>
            {finding.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p>{finding.description}</p>
          </div>
          
          {capa ? (
            <div className="border rounded-md p-4 space-y-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">CAPA #{capa.id}</h4>
                <Badge className={getStatusColor(capa.status)}>
                  {capa.status}
                </Badge>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700">Root Cause:</h5>
                <p className="text-sm">{capa.rootCause}</p>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700">Correction Plan:</h5>
                <p className="text-sm">{capa.correctionPlan}</p>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700">Prevention Plan:</h5>
                <p className="text-sm">{capa.preventionPlan}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>Assigned to: {capa.assignedTo}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Due: {capa.dueDate}</span>
                </div>
              </div>
            </div>
          ) : showCAPAForm ? (
            <div className="border rounded-md p-4 space-y-4">
              <h4 className="font-medium">Create CAPA</h4>
              
              <div>
                <Label htmlFor="rootCause">Root Cause Analysis</Label>
                <Textarea 
                  id="rootCause" 
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  placeholder="Identify the underlying cause of the finding..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="correctionPlan">Correction Plan</Label>
                <Textarea 
                  id="correctionPlan" 
                  value={correctionPlan}
                  onChange={(e) => setCorrectionPlan(e.target.value)}
                  placeholder="Actions to correct the immediate issue..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="preventionPlan">Prevention Plan</Label>
                <Textarea 
                  id="preventionPlan" 
                  value={preventionPlan}
                  onChange={(e) => setPreventionPlan(e.target.value)}
                  placeholder="Actions to prevent recurrence..."
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input 
                    id="assignedTo" 
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="Employee name or ID"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <div className="relative mt-1">
                    <Input 
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCAPAForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitCAPA}>
                  Create CAPA
                </Button>
              </div>
            </div>
          ) : null}
          
          {showTrainingForm && (
            <TrainingIntegration 
              findingId={finding.id}
              findingDescription={finding.description}
              severity={finding.severity}
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-2 border-t">
        {!capa && !showCAPAForm && (
          <Button 
            variant="outline" 
            onClick={() => setShowCAPAForm(true)}
            className="flex items-center gap-1"
          >
            <ClipboardList className="h-4 w-4" />
            Create CAPA
          </Button>
        )}
        
        {!showTrainingForm && (
          <Button 
            variant={!capa && !showCAPAForm ? "outline" : "default"}
            onClick={() => setShowTrainingForm(!showTrainingForm)}
            className="flex items-center gap-1"
          >
            <BookOpen className="h-4 w-4" />
            {showTrainingForm ? 'Hide Training' : 'Assign Training'}
          </Button>
        )}
        
        <Button variant="outline" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuditFindingWithCAPA;
