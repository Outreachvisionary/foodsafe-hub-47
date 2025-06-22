
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ModuleEvent {
  id: string;
  sourceModule: string;
  targetModule: string;
  eventType: string;
  sourceId: string;
  targetId?: string;
  data: any;
  timestamp: string;
  userId: string;
}

export interface ModuleRelationship {
  id: string;
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  relationshipType: string;
  metadata?: any;
  createdAt: string;
  createdBy: string;
}

export class ModuleIntegrationService {
  // Create relationships between modules
  static async createRelationship(relationship: Omit<ModuleRelationship, 'id' | 'createdAt'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('module_relationships')
        .insert([{
          source_type: relationship.sourceType,
          source_id: relationship.sourceId,
          target_type: relationship.targetType,
          target_id: relationship.targetId,
          relationship_type: relationship.relationshipType,
          created_by: relationship.createdBy
        }])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating module relationship:', error);
      toast.error('Failed to create module relationship');
      return null;
    }
  }

  // Get related items for a specific module and entity
  static async getRelatedItems(sourceId: string, sourceType: string, targetType?: string): Promise<ModuleRelationship[]> {
    try {
      let query = supabase
        .from('module_relationships')
        .select('*')
        .eq('source_id', sourceId)
        .eq('source_type', sourceType);

      if (targetType) {
        query = query.eq('target_type', targetType);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        sourceType: item.source_type,
        sourceId: item.source_id,
        targetType: item.target_type,
        targetId: item.target_id,
        relationshipType: item.relationship_type,
        createdAt: item.created_at,
        createdBy: item.created_by
      }));
    } catch (error) {
      console.error('Error fetching related items:', error);
      return [];
    }
  }

  // Trigger workflow across modules
  static async triggerWorkflow(sourceModule: string, sourceId: string, workflowType: string, data: any): Promise<boolean> {
    try {
      const workflows = {
        'audit-finding-to-nc': async () => {
          // Create non-conformance from audit finding - using correct field names
          const { data: ncData, error } = await supabase
            .from('non_conformances')
            .insert({
              title: data.findingTitle || 'Audit Finding Item',
              item_name: data.findingTitle || 'Audit Finding Item',
              description: data.findingDescription,
              item_category: 'Other',
              reason_category: 'Quality Issues',
              status: 'On Hold',
              created_by: data.userId,
              assigned_to: data.assignedTo,
              priority: data.severity === 'critical' ? 'High' : 'Medium'
            })
            .select('id')
            .single();

          if (error) throw error;

          // Create relationship
          await this.createRelationship({
            sourceType: 'audit-finding',
            sourceId: sourceId,
            targetType: 'non-conformance',
            targetId: ncData.id,
            relationshipType: 'generated-from',
            createdBy: data.userId
          });

          return ncData.id;
        },
        'nc-to-capa': async () => {
          // Create CAPA from non-conformance
          const { data: capaData, error } = await supabase
            .from('capa_actions')
            .insert({
              title: `CAPA for NC - ${data.ncTitle}`,
              description: data.ncDescription,
              source: 'Non-Conformance',
              priority: data.priority || 'Medium',
              assigned_to: data.assignedTo,
              created_by: data.userId,
              due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            })
            .select('id')
            .single();

          if (error) throw error;

          // Update NC with CAPA reference
          await supabase
            .from('non_conformances')
            .update({ capa_id: capaData.id })
            .eq('id', sourceId);

          // Create relationship
          await this.createRelationship({
            sourceType: 'non-conformance',
            sourceId: sourceId,
            targetType: 'capa',
            targetId: capaData.id,
            relationshipType: 'requires',
            createdBy: data.userId
          });

          return capaData.id;
        },
        'capa-to-training': async () => {
          // Create training assignment from CAPA - using correct field names
          const { data: trainingData, error } = await supabase
            .from('training_sessions')
            .insert({
              title: `Training for CAPA - ${data.capaTitle}`,
              description: `Remedial training based on CAPA requirements`,
              training_type: 'Mandatory',
              assigned_to: data.assignedUsers || [],
              created_by: data.userId,
              due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
            })
            .select('id')
            .single();

          if (error) throw error;

          // Create relationship
          await this.createRelationship({
            sourceType: 'capa',
            sourceId: sourceId,
            targetType: 'training',
            targetId: trainingData.id,
            relationshipType: 'requires',
            createdBy: data.userId
          });

          return trainingData.id;
        }
      };

      const workflow = workflows[workflowType as keyof typeof workflows];
      if (workflow) {
        await workflow();
        toast.success(`${workflowType.replace('-', ' ')} workflow completed successfully`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error triggering workflow:', error);
      toast.error('Failed to trigger workflow');
      return false;
    }
  }

  // Get workflow suggestions based on current context
  static getWorkflowSuggestions(moduleType: string, status: string, data: any): string[] {
    const suggestions: string[] = [];

    switch (moduleType) {
      case 'audit-finding':
        if (data.severity === 'major' || data.severity === 'critical') {
          suggestions.push('Create Non-Conformance');
        }
        break;
      case 'non-conformance':
        if (status === 'Under Review' && !data.capaId) {
          suggestions.push('Generate CAPA');
        }
        break;
      case 'capa':
        if (status === 'In Progress' && data.requiresTraining) {
          suggestions.push('Assign Training');
        }
        break;
    }

    return suggestions;
  }
}

export default ModuleIntegrationService;
