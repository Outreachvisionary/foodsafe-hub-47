
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Creates a CAPA from a Non-Conformance
 * @param nonConformanceId The ID of the non-conformance to create the CAPA from
 * @param userId The ID of the user creating the CAPA
 * @returns The ID of the created CAPA
 */
export const createCAPAFromNC = async (nonConformanceId: string, userId: string) => {
  try {
    // First, get the non-conformance details
    const { data: nc, error: ncError } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('id', nonConformanceId)
      .single();
    
    if (ncError || !nc) {
      throw new Error(ncError?.message || 'Non-Conformance not found');
    }

    // Create a CAPA action with details from the non-conformance
    const { data: capa, error: capaError } = await supabase
      .from('capa_actions')
      .insert({
        title: `CAPA for NC: ${nc.title}`,
        description: `CAPA created from non-conformance: ${nc.description || nc.title}`,
        source: 'Non-Conformance',
        source_id: nc.id,
        priority: nc.priority || 'Medium',
        status: 'Open',
        assigned_to: nc.assigned_to || userId,
        created_by: userId,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Default to 14 days from now
        root_cause: nc.reason_details || '',
        department: nc.department,
        fsma204_compliant: false,
      })
      .select()
      .single();
    
    if (capaError || !capa) {
      throw new Error(capaError?.message || 'Failed to create CAPA');
    }

    // Update the non-conformance with the CAPA ID
    const { error: updateError } = await supabase
      .from('non_conformances')
      .update({
        capa_id: capa.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', nonConformanceId);
    
    if (updateError) {
      throw new Error(updateError.message);
    }

    // Create the relationship record in module_relationships
    await supabase
      .from('module_relationships')
      .insert({
        source_id: nonConformanceId,
        source_type: 'non_conformance',
        target_id: capa.id,
        target_type: 'capa',
        relationship_type: 'origin',
        created_by: userId
      });

    // Record activity for the non-conformance
    await supabase
      .from('nc_activities')
      .insert({
        non_conformance_id: nonConformanceId,
        action: `CAPA created (ID: ${capa.id})`,
        performed_by: userId
      });

    // Record activity for the CAPA
    await supabase
      .from('capa_activities')
      .insert({
        capa_id: capa.id,
        action_type: 'creation',
        action_description: `Created from Non-Conformance (ID: ${nonConformanceId})`,
        performed_by: userId
      });

    return capa.id;
  } catch (error) {
    console.error('Error creating CAPA from NC:', error);
    throw error;
  }
};

/**
 * Links an existing CAPA to a Non-Conformance
 * @param nonConformanceId The ID of the non-conformance
 * @param capaId The ID of the CAPA to link
 * @param userId The ID of the user creating the link
 */
export const linkCAPAToNC = async (nonConformanceId: string, capaId: string, userId: string) => {
  try {
    // First, check if the CAPA exists
    const { data: capa, error: capaError } = await supabase
      .from('capa_actions')
      .select('id, title')
      .eq('id', capaId)
      .single();
    
    if (capaError || !capa) {
      throw new Error(capaError?.message || 'CAPA not found');
    }

    // Update the non-conformance with the CAPA ID
    const { error: updateError } = await supabase
      .from('non_conformances')
      .update({
        capa_id: capaId,
        updated_at: new Date().toISOString()
      })
      .eq('id', nonConformanceId);
    
    if (updateError) {
      throw new Error(updateError.message);
    }

    // Create the relationship record in module_relationships
    await supabase
      .from('module_relationships')
      .insert({
        source_id: nonConformanceId,
        source_type: 'non_conformance',
        target_id: capaId,
        target_type: 'capa',
        relationship_type: 'linked',
        created_by: userId
      });

    // Record activity for the non-conformance
    await supabase
      .from('nc_activities')
      .insert({
        non_conformance_id: nonConformanceId,
        action: `Linked to existing CAPA (ID: ${capaId})`,
        performed_by: userId
      });

    // Record activity for the CAPA
    await supabase
      .from('capa_activities')
      .insert({
        capa_id: capaId,
        action_type: 'integration',
        action_description: `Linked to Non-Conformance (ID: ${nonConformanceId})`,
        performed_by: userId
      });

    return capa.id;
  } catch (error) {
    console.error('Error linking CAPA to NC:', error);
    throw error;
  }
};

/**
 * Gets all CAPAs related to a Non-Conformance
 * @param nonConformanceId The ID of the non-conformance
 * @returns Array of related CAPAs
 */
export const getRelatedCAPAs = async (nonConformanceId: string) => {
  try {
    // First, get the direct CAPA from the NC itself
    const { data: nc, error: ncError } = await supabase
      .from('non_conformances')
      .select('capa_id')
      .eq('id', nonConformanceId)
      .single();
    
    // Get additional CAPAs from the module_relationships table
    const { data: relationships, error: relError } = await supabase
      .from('module_relationships')
      .select('target_id')
      .eq('source_id', nonConformanceId)
      .eq('source_type', 'non_conformance')
      .eq('target_type', 'capa');
    
    if (relError) {
      throw new Error(relError.message);
    }

    // Collect all CAPA IDs (removing duplicates)
    const capaIds = new Set<string>();
    
    if (nc?.capa_id) {
      capaIds.add(nc.capa_id);
    }
    
    relationships?.forEach(rel => {
      if (rel.target_id) {
        capaIds.add(rel.target_id);
      }
    });

    if (capaIds.size === 0) {
      return [];
    }

    // Get the CAPA details
    const { data: capas, error: capaError } = await supabase
      .from('capa_actions')
      .select('*')
      .in('id', Array.from(capaIds));
    
    if (capaError) {
      throw new Error(capaError.message);
    }

    return capas || [];
  } catch (error) {
    console.error('Error getting related CAPAs:', error);
    throw error;
  }
};

/**
 * Gets all Non-Conformances related to a CAPA
 * @param capaId The ID of the CAPA
 * @returns Array of related Non-Conformances
 */
export const getRelatedNonConformances = async (capaId: string) => {
  try {
    // First, get NCs that directly reference this CAPA
    const { data: directNCs, error: directError } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('capa_id', capaId);
    
    if (directError) {
      throw new Error(directError.message);
    }

    // Get additional NCs from the module_relationships table
    const { data: relationships, error: relError } = await supabase
      .from('module_relationships')
      .select('source_id')
      .eq('target_id', capaId)
      .eq('target_type', 'capa')
      .eq('source_type', 'non_conformance');
    
    if (relError) {
      throw new Error(relError.message);
    }

    // Collect all NC IDs that came from relationships (excluding ones we already got)
    const directNcIds = new Set(directNCs?.map(nc => nc.id) || []);
    const additionalNcIds = relationships
      ?.map(rel => rel.source_id)
      .filter(id => id && !directNcIds.has(id)) || [];
    
    if (additionalNcIds.length === 0) {
      return directNCs || [];
    }

    // Get the additional NCs
    const { data: additionalNCs, error: ncError } = await supabase
      .from('non_conformances')
      .select('*')
      .in('id', additionalNcIds);
    
    if (ncError) {
      throw new Error(ncError.message);
    }

    // Combine both sets of NCs
    return [...(directNCs || []), ...(additionalNCs || [])];
  } catch (error) {
    console.error('Error getting related Non-Conformances:', error);
    throw error;
  }
};
