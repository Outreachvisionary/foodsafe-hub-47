import { supabase } from '@/integrations/supabase/client';
import ModuleIntegrationService from './moduleIntegrationService';
import { toast } from 'sonner';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  triggerConditions: TriggerCondition[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  moduleType: string;
  actionType: string;
  requiredData: string[];
  autoExecute: boolean;
  approvalRequired: boolean;
  assignedRole?: string;
}

export interface TriggerCondition {
  moduleType: string;
  event: string;
  conditions: Record<string, any>;
}

export class WorkflowOrchestrationService {
  private static workflows: WorkflowTemplate[] = [
    {
      id: 'audit-finding-resolution',
      name: 'Audit Finding Resolution',
      description: 'Complete workflow from audit finding to resolution',
      steps: [
        {
          id: 'create-nc',
          name: 'Create Non-Conformance',
          moduleType: 'non-conformance',
          actionType: 'create',
          requiredData: ['item_name', 'description', 'severity'],
          autoExecute: true,
          approvalRequired: false
        },
        {
          id: 'generate-capa',
          name: 'Generate CAPA',
          moduleType: 'capa',
          actionType: 'create',
          requiredData: ['root_cause', 'corrective_action'],
          autoExecute: false,
          approvalRequired: true,
          assignedRole: 'Quality Manager'
        },
        {
          id: 'assign-training',
          name: 'Assign Training',
          moduleType: 'training',
          actionType: 'create',
          requiredData: ['training_type', 'assigned_users'],
          autoExecute: false,
          approvalRequired: false
        }
      ],
      triggerConditions: [
        {
          moduleType: 'audit-finding',
          event: 'severity_updated',
          conditions: { severity: ['major', 'critical'] }
        }
      ]
    }
  ];

  static async executeWorkflow(workflowId: string, sourceId: string, initialData: any): Promise<boolean> {
    try {
      const workflow = this.workflows.find(w => w.id === workflowId);
      if (!workflow) {
        toast.error('Workflow template not found');
        return false;
      }

      console.log(`Executing workflow: ${workflow.name}`);
      
      let currentData = { ...initialData };
      
      for (const step of workflow.steps) {
        console.log(`Executing step: ${step.name}`);
        
        if (step.autoExecute) {
          const result = await this.executeStep(step, sourceId, currentData);
          if (result) {
            currentData = { ...currentData, ...result };
          }
        } else {
          // Create pending task for manual execution
          await this.createPendingTask(step, sourceId, currentData);
        }
      }

      toast.success(`Workflow ${workflow.name} initiated successfully`);
      return true;
    } catch (error) {
      console.error('Error executing workflow:', error);
      toast.error('Failed to execute workflow');
      return false;
    }
  }

  private static async executeStep(step: WorkflowStep, sourceId: string, data: any): Promise<any> {
    switch (step.moduleType) {
      case 'non-conformance':
        return await this.createNonConformance(sourceId, data);
      case 'capa':
        return await this.createCAPA(sourceId, data);
      case 'training':
        return await this.createTraining(sourceId, data);
      default:
        console.warn(`Unknown module type: ${step.moduleType}`);
        return null;
    }
  }

  private static async createNonConformance(auditFindingId: string, data: any): Promise<any> {
    const { data: ncData, error } = await supabase
      .from('non_conformances')
      .insert({
        item_name: data.title || 'NC from Audit Finding',
        description: data.description,
        item_category: 'Other',
        reason_category: 'Quality Issue',
        status: 'On Hold',
        created_by: data.userId,
        priority: data.severity === 'critical' ? 'High' : 'Medium'
      })
      .select('id')
      .single();

    if (error) throw error;

    // Create relationship
    await ModuleIntegrationService.createRelationship({
      sourceType: 'audit-finding',
      sourceId: auditFindingId,
      targetType: 'non-conformance',
      targetId: ncData.id,
      relationshipType: 'generated-from',
      createdBy: data.userId
    });

    return { nonConformanceId: ncData.id };
  }

  private static async createCAPA(sourceId: string, data: any): Promise<any> {
    const { data: capaData, error } = await supabase
      .from('capa_actions')
      .insert({
        title: data.capaTitle || 'CAPA from Workflow',
        description: data.description,
        source: data.source || 'Workflow',
        priority: data.priority || 'Medium',
        assigned_to: data.assignedTo || 'Quality Manager',
        created_by: data.userId,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select('id')
      .single();

    if (error) throw error;

    return { capaId: capaData.id };
  }

  private static async createTraining(sourceId: string, data: any): Promise<any> {
    // Training creation would be implemented here
    // For now, just return a placeholder
    return { trainingId: 'placeholder' };
  }

  private static async createPendingTask(step: WorkflowStep, sourceId: string, data: any): Promise<void> {
    // Create a pending task that can be executed later
    console.log(`Created pending task: ${step.name} for ${sourceId}`);
    
    // This would typically be stored in a tasks table
    toast.info(`Task created: ${step.name}`);
  }

  static getAvailableWorkflows(): WorkflowTemplate[] {
    return this.workflows;
  }

  static async checkTriggerConditions(moduleType: string, event: string, data: any): Promise<string[]> {
    const triggeredWorkflows: string[] = [];

    for (const workflow of this.workflows) {
      for (const condition of workflow.triggerConditions) {
        if (condition.moduleType === moduleType && condition.event === event) {
          // Check if conditions are met
          let conditionsMet = true;
          for (const [key, expectedValues] of Object.entries(condition.conditions)) {
            if (Array.isArray(expectedValues)) {
              if (!expectedValues.includes(data[key])) {
                conditionsMet = false;
                break;
              }
            } else {
              if (data[key] !== expectedValues) {
                conditionsMet = false;
                break;
              }
            }
          }
          
          if (conditionsMet) {
            triggeredWorkflows.push(workflow.id);
          }
        }
      }
    }

    return triggeredWorkflows;
  }
}

export default WorkflowOrchestrationService;
