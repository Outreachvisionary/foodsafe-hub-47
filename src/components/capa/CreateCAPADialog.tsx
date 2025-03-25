
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Plus, Zap } from 'lucide-react';
import CAPAForm from './CAPAForm';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RootCauseAnalysis from './RootCauseAnalysis';
import CAPAWorkflowEngine from './CAPAWorkflowEngine';

interface CreateCAPADialogProps {
  onCAPACreated?: (data: any) => void;
  trigger?: React.ReactNode;
  initialData?: any;
  sourceData?: {
    id: string;
    title: string;
    description: string;
    source: string;
    sourceId: string;
    date: string;
    severity: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CreateCAPADialog: React.FC<CreateCAPADialogProps> = ({ 
  onCAPACreated,
  trigger,
  initialData,
  sourceData,
  open,
  onOpenChange
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [capaData, setCAPAData] = useState<any>(initialData || {});
  const { toast } = useToast();

  // Handle controlled or uncontrolled state
  const isOpen = open !== undefined ? open : dialogOpen;
  const setIsOpen = onOpenChange || setDialogOpen;

  const handleSubmit = (data: any) => {
    console.log('New CAPA data:', data);
    
    // Save the CAPA data to be accessible to other tabs
    setCAPAData({
      ...capaData,
      ...data,
      id: capaData.id || `CAPA-${Date.now()}`,
      status: capaData.status || 'open',
      createdDate: capaData.createdDate || new Date().toISOString().split('T')[0]
    });
    
    // Here we would normally send this to an API
    // For now we'll just simulate success and call the callback
    
    if (onCAPACreated) {
      onCAPACreated({
        ...capaData,
        ...data,
        id: capaData.id || `CAPA-${Date.now()}`,
        status: capaData.status || 'open',
        createdDate: capaData.createdDate || new Date().toISOString().split('T')[0]
      });
    }
    
    if (activeTab === "workflow") {
      // If on the last tab, close the dialog
      setIsOpen(false);
    } else {
      // Otherwise move to the next tab
      if (activeTab === "details") setActiveTab("rootcause");
      else if (activeTab === "rootcause") setActiveTab("workflow");
    }
  };

  const handleRootCauseSelected = (rootCause: string) => {
    setCAPAData({
      ...capaData,
      rootCause
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    setCAPAData({});
    setActiveTab("details");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(newOpen) => {
      setIsOpen(newOpen);
      if (!newOpen) {
        setCAPAData({});
        setActiveTab("details");
      }
    }}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>{sourceData ? 'Create CAPA from Issue' : 'Create New CAPA'}</DialogTitle>
          <DialogDescription>
            {sourceData 
              ? `Creating a corrective and preventive action plan based on ${sourceData.id}`
              : 'Define a new Corrective and Preventive Action plan'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="details">CAPA Details</TabsTrigger>
            <TabsTrigger value="rootcause">Root Cause Analysis</TabsTrigger>
            <TabsTrigger value="workflow">Approval Workflow</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
            <CAPAForm 
              initialData={sourceData ? {
                title: sourceData.title,
                description: sourceData.description,
                source: sourceData.source as any,
                sourceId: sourceData.sourceId,
                priority: (sourceData.severity === 'critical' ? 'critical' : 
                          sourceData.severity === 'major' ? 'high' : 
                          sourceData.severity === 'minor' ? 'medium' : 'low') as any
              } : initialData}
              onSubmit={handleSubmit} 
              onCancel={handleCancel} 
            />
          </TabsContent>
          
          <TabsContent value="rootcause" className="pt-4">
            {capaData.title ? (
              <RootCauseAnalysis 
                findingId={capaData.sourceId || "New CAPA"}
                findingType={capaData.source || ""}
                findingDescription={capaData.description || ""}
                severity={capaData.priority || "medium"}
                onRootCauseSelected={handleRootCauseSelected}
              />
            ) : (
              <div className="p-8 text-center">
                <p>Please complete the CAPA details first</p>
                <Button onClick={() => setActiveTab("details")} className="mt-4">
                  Go to CAPA Details
                </Button>
              </div>
            )}
            
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("workflow")}>
                Continue to Workflow
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="workflow" className="pt-4">
            {capaData.title ? (
              <CAPAWorkflowEngine 
                capaId={capaData.id || "New CAPA"}
                title={capaData.title}
                priority={capaData.priority || "medium"}
                requiredSignoffs={['Quality Manager', 'Department Head']}
                initialStatus="draft"
              />
            ) : (
              <div className="p-8 text-center">
                <p>Please complete the CAPA details first</p>
                <Button onClick={() => setActiveTab("details")} className="mt-4">
                  Go to CAPA Details
                </Button>
              </div>
            )}
            
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={() => setActiveTab("rootcause")}>
                Back
              </Button>
              <Button onClick={() => {
                if (onCAPACreated) {
                  onCAPACreated(capaData);
                }
                setIsOpen(false);
                setCAPAData({});
                setActiveTab("details");
              }}>
                {sourceData ? (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Create Automated CAPA
                  </>
                ) : (
                  "Finish & Create CAPA"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCAPADialog;
