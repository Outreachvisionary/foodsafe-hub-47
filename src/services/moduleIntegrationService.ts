
import { supabase } from '@/integrations/supabase/client';

export interface ModuleRelationship {
  id?: string;
  source_id: string;
  target_id: string;
  source_type: string;
  target_type: string;
  relationship_type: string;
  created_by: string;
  created_at?: string;
}

export const moduleIntegrationService = {
  // Create relationship between modules
  async createRelationship(relationship: Omit<ModuleRelationship, 'id'>): Promise<ModuleRelationship> {
    const { data, error } = await supabase
      .from('module_relationships')
      .insert(relationship)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all relationships for a specific item
  async getRelationships(sourceId: string, sourceType: string): Promise<ModuleRelationship[]> {
    const { data, error } = await supabase
      .from('module_relationships')
      .select('*')
      .eq('source_id', sourceId)
      .eq('source_type', sourceType);

    if (error) throw error;
    return data || [];
  },

  // Get related items with target type filtering
  async getRelatedItems(sourceId: string, sourceType: string, targetType?: string): Promise<ModuleRelationship[]> {
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
    return data || [];
  },

  // Link certification to training
  async linkCertificationToTraining(certificationId: string, trainingId: string, userId: string): Promise<void> {
    await this.createRelationship({
      source_id: certificationId,
      target_id: trainingId,
      source_type: 'certification',
      target_type: 'training',
      relationship_type: 'certification_training',
      created_by: userId
    });
  },

  // Link CAPA to training
  async linkCAPAToTraining(capaId: string, trainingId: string, userId: string): Promise<void> {
    await this.createRelationship({
      source_id: capaId,
      target_id: trainingId,
      source_type: 'capa',
      target_type: 'training',
      relationship_type: 'capa_training',
      created_by: userId
    });
  },

  // Link non-conformance to training
  async linkNCToTraining(ncId: string, trainingId: string, userId: string): Promise<void> {
    await this.createRelationship({
      source_id: ncId,
      target_id: trainingId,
      source_type: 'non_conformance',
      target_type: 'training',
      relationship_type: 'nc_training',
      created_by: userId
    });
  },

  // Get related training for CAPA
  async getRelatedTrainingForCAPA(capaId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('module_relationships')
      .select(`
        *,
        training_sessions:target_id (*)
      `)
      .eq('source_id', capaId)
      .eq('source_type', 'capa')
      .eq('target_type', 'training');

    if (error) throw error;
    return data || [];
  },

  // Get related certifications for training
  async getRelatedCertificationsForTraining(trainingId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('module_relationships')
      .select(`
        *,
        certifications:source_id (*)
      `)
      .eq('target_id', trainingId)
      .eq('source_type', 'certification')
      .eq('target_type', 'training');

    if (error) throw error;
    return data || [];
  },

  // Remove relationship
  async removeRelationship(relationshipId: string): Promise<void> {
    const { error } = await supabase
      .from('module_relationships')
      .delete()
      .eq('id', relationshipId);

    if (error) throw error;
  },

  // Trigger workflow
  async triggerWorkflow(sourceType: string, sourceId: string, workflowType: string, data: any): Promise<void> {
    console.log(`Triggering workflow: ${workflowType} for ${sourceType}:${sourceId}`, data);
    // Implementation would go here
  },

  // Get workflow suggestions
  getWorkflowSuggestions(sourceType: string, status: string, metadata: any): string[] {
    const suggestions: string[] = [];
    
    if (sourceType === 'audit-finding' && metadata.severity === 'major') {
      suggestions.push('Create Non-Conformance');
    }
    
    if (sourceType === 'non_conformance' && status === 'active') {
      suggestions.push('Generate CAPA');
    }
    
    if (sourceType === 'capa' && status === 'active') {
      suggestions.push('Assign Training');
    }
    
    return suggestions;
  }
};

// Export as default for backward compatibility
export default moduleIntegrationService;
