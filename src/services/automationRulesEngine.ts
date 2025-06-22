
import { supabase } from '@/integrations/supabase/client';
import WorkflowOrchestrationService from './workflowOrchestrationService';
import { toast } from 'sonner';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggerModule: string;
  triggerEvent: string;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  priority: number;
  createdBy: string;
  createdAt: string;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in_array';
  value: any;
}

export interface AutomationAction {
  type: 'create_record' | 'update_record' | 'send_notification' | 'trigger_workflow' | 'assign_user';
  targetModule: string;
  parameters: Record<string, any>;
}

export class AutomationRulesEngine {
  private static rules: AutomationRule[] = [
    {
      id: 'auto-nc-from-critical-audit',
      name: 'Auto-create NC from Critical Audit Findings',
      description: 'Automatically create non-conformance when critical audit findings are identified',
      enabled: true,
      triggerModule: 'audit',
      triggerEvent: 'finding_created',
      conditions: [
        { field: 'severity', operator: 'in_array', value: ['critical', 'major'] }
      ],
      actions: [
        {
          type: 'trigger_workflow',
          targetModule: 'workflow',
          parameters: { workflowId: 'audit-finding-resolution' }
        },
        {
          type: 'send_notification',
          targetModule: 'notification',
          parameters: { 
            type: 'urgent',
            message: 'Critical audit finding requires immediate attention',
            recipients: ['Quality Manager', 'Department Head']
          }
        }
      ],
      priority: 1,
      createdBy: 'system',
      createdAt: new Date().toISOString()
    },
    {
      id: 'auto-escalate-overdue-capa',
      name: 'Auto-escalate Overdue CAPAs',
      description: 'Automatically escalate CAPAs that are past due date',
      enabled: true,
      triggerModule: 'capa',
      triggerEvent: 'status_check',
      conditions: [
        { field: 'status', operator: 'not_equals', value: 'Closed' },
        { field: 'due_date', operator: 'less_than', value: 'current_date' }
      ],
      actions: [
        {
          type: 'update_record',
          targetModule: 'capa',
          parameters: { status: 'Overdue', priority: 'Critical' }
        },
        {
          type: 'send_notification',
          targetModule: 'notification',
          parameters: {
            type: 'escalation',
            message: 'CAPA is overdue and requires immediate attention',
            recipients: ['assigned_to', 'Quality Director']
          }
        }
      ],
      priority: 2,
      createdBy: 'system',
      createdAt: new Date().toISOString()
    }
  ];

  static async processEvent(module: string, event: string, data: any): Promise<void> {
    console.log(`Processing automation event: ${module}.${event}`, data);

    const applicableRules = this.rules.filter(rule => 
      rule.enabled && 
      rule.triggerModule === module && 
      rule.triggerEvent === event
    );

    for (const rule of applicableRules) {
      if (await this.evaluateConditions(rule.conditions, data)) {
        console.log(`Executing rule: ${rule.name}`);
        await this.executeActions(rule.actions, data);
      }
    }
  }

  private static async evaluateConditions(conditions: AutomationCondition[], data: any): Promise<boolean> {
    for (const condition of conditions) {
      const fieldValue = this.getNestedValue(data, condition.field);
      
      switch (condition.operator) {
        case 'equals':
          if (fieldValue !== condition.value) return false;
          break;
        case 'not_equals':
          if (fieldValue === condition.value) return false;
          break;
        case 'contains':
          if (!String(fieldValue).includes(condition.value)) return false;
          break;
        case 'greater_than':
          if (fieldValue <= condition.value) return false;
          break;
        case 'less_than':
          if (condition.value === 'current_date') {
            if (new Date(fieldValue) >= new Date()) return false;
          } else if (fieldValue >= condition.value) return false;
          break;
        case 'in_array':
          if (!condition.value.includes(fieldValue)) return false;
          break;
      }
    }
    return true;
  }

  private static async executeActions(actions: AutomationAction[], data: any): Promise<void> {
    for (const action of actions) {
      try {
        switch (action.type) {
          case 'trigger_workflow':
            await WorkflowOrchestrationService.executeWorkflow(
              action.parameters.workflowId,
              data.id,
              data
            );
            break;
          
          case 'create_record':
            await this.createRecord(action.targetModule, action.parameters, data);
            break;
          
          case 'update_record':
            await this.updateRecord(action.targetModule, action.parameters, data);
            break;
          
          case 'send_notification':
            await this.sendNotification(action.parameters, data);
            break;
          
          case 'assign_user':
            await this.assignUser(action.targetModule, action.parameters, data);
            break;
        }
      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error);
      }
    }
  }

  private static async createRecord(module: string, parameters: any, data: any): Promise<void> {
    // Implementation would depend on the target module
    console.log(`Creating record in ${module}:`, parameters);
  }

  private static async updateRecord(module: string, parameters: any, data: any): Promise<void> {
    const tableName = this.getTableName(module);
    if (tableName) {
      await supabase
        .from(tableName)
        .update(parameters)
        .eq('id', data.id);
    }
  }

  private static async sendNotification(parameters: any, data: any): Promise<void> {
    console.log('Sending notification:', parameters);
    toast.info(parameters.message);
  }

  private static async assignUser(module: string, parameters: any, data: any): Promise<void> {
    const tableName = this.getTableName(module);
    if (tableName) {
      await supabase
        .from(tableName)
        .update({ assigned_to: parameters.userId })
        .eq('id', data.id);
    }
  }

  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private static getTableName(module: string): string | null {
    const mapping: Record<string, string> = {
      'capa': 'capa_actions',
      'non-conformance': 'non_conformances',
      'audit': 'audits',
      'complaint': 'complaints'
    };
    return mapping[module] || null;
  }

  static getRules(): AutomationRule[] {
    return this.rules;
  }

  static async addRule(rule: Omit<AutomationRule, 'id' | 'createdAt'>): Promise<string> {
    const newRule: AutomationRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    this.rules.push(newRule);
    return newRule.id;
  }

  static async updateRule(ruleId: string, updates: Partial<AutomationRule>): Promise<boolean> {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index >= 0) {
      this.rules[index] = { ...this.rules[index], ...updates };
      return true;
    }
    return false;
  }

  static async deleteRule(ruleId: string): Promise<boolean> {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index >= 0) {
      this.rules.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default AutomationRulesEngine;
