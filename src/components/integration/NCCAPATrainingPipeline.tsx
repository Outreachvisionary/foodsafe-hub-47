
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, FileX, ClipboardList, GraduationCap, AlertTriangle } from 'lucide-react';
import { useNCCAPAIntegration } from '@/hooks/useNCCAPAIntegration';
import { useComplaintCAPAIntegration } from '@/hooks/useComplaintCAPAIntegration';

interface PipelineStep {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  icon: React.ReactNode;
  description: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
}

interface NCCAPATrainingPipelineProps {
  sourceId: string;
  sourceType: 'non-conformance' | 'complaint' | 'audit-finding';
  sourceData: any;
}

const NCCAPATrainingPipeline: React.FC<NCCAPATrainingPipelineProps> = ({
  sourceId,
  sourceType,
  sourceData
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  
  const ncCapaIntegration = useNCCAPAIntegration(sourceType === 'non-conformance' ? sourceId : '');
  const complaintCapaIntegration = useComplaintCAPAIntegration(sourceType === 'complaint' ? sourceId : '');

  const generateCAPA = () => {
    if (sourceType === 'non-conformance') {
      ncCapaIntegration.generateCAPA({ isAutomatic: true });
    } else if (sourceType === 'complaint') {
      complaintCapaIntegration.generateCAPA('current-user-id');
    }
    setCurrentStep(1);
  };

  const assignTraining = () => {
    // Mock training assignment based on source
    const trainingPlan = generateTrainingPlan(sourceData);
    
    toast({
      title: "Training Assigned",
      description: `${trainingPlan.courses.length} training courses have been assigned to relevant personnel`
    });
    
    setCurrentStep(2);
  };

  const generateTrainingPlan = (sourceData: any) => {
    // Auto-generate training plan based on source type and data
    const baseCourses = ['Root Cause Analysis', 'Quality Management Systems'];
    
    if (sourceType === 'non-conformance') {
      if (sourceData.reason_category === 'Food Safety') {
        baseCourses.push('Food Safety Fundamentals', 'HACCP Principles');
      } else if (sourceData.reason_category === 'Quality Issue') {
        baseCourses.push('Quality Control Procedures', 'Statistical Process Control');
      }
    }
    
    return {
      title: `Training Plan for ${sourceType.replace('-', ' ')} #${sourceId}`,
      courses: baseCourses,
      assignedTo: ['All Department Staff'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    };
  };

  const steps: PipelineStep[] = [
    {
      id: 'source',
      title: `${sourceType.replace('-', ' ')} Identified`,
      status: 'completed',
      icon: <FileX className="h-4 w-4" />,
      description: `Issue documented and requires corrective action`,
    },
    {
      id: 'capa',
      title: 'CAPA Generation',
      status: currentStep >= 1 ? 'completed' : 'pending',
      icon: <ClipboardList className="h-4 w-4" />,
      description: 'Generate corrective and preventive actions',
      actions: currentStep === 0 ? [{
        label: 'Generate CAPA',
        onClick: generateCAPA,
        variant: 'default' as const
      }] : undefined
    },
    {
      id: 'training',
      title: 'Training Assignment',
      status: currentStep >= 2 ? 'completed' : currentStep === 1 ? 'in-progress' : 'pending',
      icon: <GraduationCap className="h-4 w-4" />,
      description: 'Assign remedial training to prevent recurrence',
      actions: currentStep === 1 ? [{
        label: 'Assign Training',
        onClick: assignTraining,
        variant: 'default' as const
      }] : undefined
    }
  ];

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Quality Issue Resolution Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Source Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Source Issue</h4>
            <div className="text-sm text-muted-foreground">
              <p><strong>Type:</strong> {sourceType.replace('-', ' ')}</p>
              <p><strong>ID:</strong> {sourceId}</p>
              {sourceData.title && <p><strong>Title:</strong> {sourceData.title}</p>}
              {sourceData.priority && <p><strong>Priority:</strong> {sourceData.priority}</p>}
            </div>
          </div>

          {/* Pipeline Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id}>
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-100' :
                    step.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {step.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <Badge className={getStepStatusColor(step.status)}>
                        {step.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    
                    {step.actions && (
                      <div className="flex gap-2">
                        {step.actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            size="sm"
                            variant={action.variant || 'default'}
                            onClick={action.onClick}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="ml-5 mt-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-gray-400 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progress Summary */}
          <Separator />
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Pipeline Status</h4>
            <div className="flex items-center justify-between text-sm">
              <span>Steps Completed:</span>
              <span className="font-medium">
                {steps.filter(s => s.status === 'completed').length} / {steps.length}
              </span>
            </div>
            
            {currentStep === steps.length && (
              <div className="mt-2 p-2 bg-green-100 rounded text-sm text-green-800">
                ✓ Quality issue resolution pipeline completed successfully
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NCCAPATrainingPipeline;
