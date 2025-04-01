
import React from 'react';
import { CheckCircle2, Clock, ArrowRight, User, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ApprovalStep {
  step: number;
  name: string;
  status: 'completed' | 'current' | 'pending';
  approver?: string;
  date?: string;
}

interface SupplierApprovalStepsProps {
  steps: ApprovalStep[];
  currentStep: number;
  onEditStep?: (step: number) => void;
}

const SupplierApprovalSteps: React.FC<SupplierApprovalStepsProps> = ({ 
  steps, 
  currentStep,
  onEditStep 
}) => {
  return (
    <div className="my-6 px-4 py-5 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-base font-medium text-gray-900 mb-4">Approval Process</h3>
      
      <div className="relative">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start mb-8 last:mb-0">
            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
              step.status === 'completed' ? 'bg-green-100 text-green-600' : 
              step.status === 'current' ? 'bg-blue-100 text-blue-600' : 
              'bg-gray-100 text-gray-400'
            }`}>
              {step.status === 'completed' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : step.status === 'current' ? (
                <Clock className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{step.step}</span>
              )}
            </div>
            
            <div className="ml-4 flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{step.name}</h4>
                  {step.approver && (
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      {step.approver}
                    </div>
                  )}
                  {step.date && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {step.date}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  <Badge className={
                    step.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : 
                    step.status === 'current' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }>
                    {step.status === 'completed' ? 'Completed' : 
                     step.status === 'current' ? 'In Progress' : 'Pending'}
                  </Badge>
                  
                  {onEditStep && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2 h-6 px-2 text-gray-500 hover:text-gray-700"
                      onClick={() => onEditStep(step.step)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="absolute h-8 w-px bg-gray-200 left-4 -ml-px mt-8" style={{ top: `${index * 32}px` }}></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
        <p>Editing a step will reset the approval process to that point.</p>
      </div>
    </div>
  );
};

export default SupplierApprovalSteps;
