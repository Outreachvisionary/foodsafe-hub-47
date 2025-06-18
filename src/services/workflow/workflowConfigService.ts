
import { CAPAStatus } from '@/types/enums';

export interface WorkflowConfig {
  requiresApproval: boolean;
  approvers: string[];
  autoAdvance: boolean;
  deadlines: Record<string, number>; // days
  [key: string]: any; // Index signature for Json compatibility
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  assignedTo: string;
  dueDate: string;
  completedAt?: string;
  comments?: string;
  required: boolean;
  [key: string]: any; // Index signature for Json compatibility
}

// Get workflow configuration based on CAPA priority and source
export const getWorkflowConfig = (priority: string, source: string): WorkflowConfig => {
  const configs: Record<string, WorkflowConfig> = {
    'Critical': {
      requiresApproval: true,
      approvers: ['Quality Manager', 'Food Safety Director', 'Operations Manager'],
      autoAdvance: false,
      deadlines: { investigation: 3, implementation: 7, verification: 5 }
    },
    'High': {
      requiresApproval: true,
      approvers: ['Quality Manager', 'Department Head'],
      autoAdvance: false,
      deadlines: { investigation: 5, implementation: 14, verification: 7 }
    },
    'Medium': {
      requiresApproval: true,
      approvers: ['Quality Manager'],
      autoAdvance: true,
      deadlines: { investigation: 7, implementation: 21, verification: 10 }
    },
    'Low': {
      requiresApproval: false,
      approvers: [],
      autoAdvance: true,
      deadlines: { investigation: 10, implementation: 30, verification: 14 }
    }
  };
  
  return configs[priority] || configs['Medium'];
};

// Generate workflow steps based on CAPA and config
export const generateWorkflowSteps = (capa: any, config: WorkflowConfig): WorkflowStep[] => {
  const steps: WorkflowStep[] = [];
  
  // Investigation step
  steps.push({
    id: 'investigation',
    name: 'Root Cause Investigation',
    status: 'pending',
    assignedTo: capa.assigned_to,
    dueDate: new Date(Date.now() + config.deadlines.investigation * 24 * 60 * 60 * 1000).toISOString(),
    required: true
  });

  // Approval steps if required
  if (config.requiresApproval) {
    config.approvers.forEach((approver, index) => {
      steps.push({
        id: `approval_${index}`,
        name: `${approver} Approval`,
        status: 'pending',
        assignedTo: approver,
        dueDate: new Date(Date.now() + (config.deadlines.investigation + 2) * 24 * 60 * 60 * 1000).toISOString(),
        required: true
      });
    });
  }

  // Implementation step
  steps.push({
    id: 'implementation',
    name: 'Action Implementation',
    status: 'pending',
    assignedTo: capa.assigned_to,
    dueDate: new Date(Date.now() + config.deadlines.implementation * 24 * 60 * 60 * 1000).toISOString(),
    required: true
  });

  // Verification step
  steps.push({
    id: 'verification',
    name: 'Effectiveness Verification',
    status: 'pending',
    assignedTo: 'Quality Manager',
    dueDate: new Date(Date.now() + (config.deadlines.implementation + config.deadlines.verification) * 24 * 60 * 60 * 1000).toISOString(),
    required: true
  });

  return steps;
};
