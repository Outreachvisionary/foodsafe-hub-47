import { supabase } from '@/integrations/supabase/client';
import { RegulatoryStandard, FacilityStandard, StandardRequirement, StandardCompliance, ComplianceStatus } from '@/types/standards';
import { toast } from 'sonner';

/**
 * Comprehensive Standards Service
 * Handles regulatory standards, facility compliance, requirements tracking, and integrations
 */
export class StandardsService {
  
  // ============= REGULATORY STANDARDS =============
  
  /**
   * Get all regulatory standards
   */
  static async getRegulatoryStandards(): Promise<RegulatoryStandard[]> {
    try {
      const { data, error } = await supabase.rpc('get_regulatory_standards');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching regulatory standards:', error);
      toast.error('Failed to load regulatory standards');
      return [];
    }
  }

  /**
   * Get regulatory standard by ID
   */
  static async getRegulatoryStandardById(id: string): Promise<RegulatoryStandard | null> {
    try {
      const { data, error } = await supabase
        .from('regulatory_standards')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching regulatory standard:', error);
      toast.error('Failed to load standard details');
      return null;
    }
  }

  /**
   * Create new regulatory standard
   */
  static async createRegulatoryStandard(standard: Omit<RegulatoryStandard, 'id' | 'created_at' | 'updated_at'>): Promise<RegulatoryStandard | null> {
    try {
      const { data, error } = await supabase
        .from('regulatory_standards')
        .insert([standard])
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Regulatory standard created successfully');
      return data;
    } catch (error) {
      console.error('Error creating regulatory standard:', error);
      toast.error('Failed to create standard');
      return null;
    }
  }

  /**
   * Update regulatory standard
   */
  static async updateRegulatoryStandard(id: string, updates: Partial<RegulatoryStandard>): Promise<RegulatoryStandard | null> {
    try {
      const { data, error } = await supabase
        .from('regulatory_standards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Standard updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating regulatory standard:', error);
      toast.error('Failed to update standard');
      return null;
    }
  }

  // ============= FACILITY STANDARDS =============

  /**
   * Get facility standards for a specific facility
   */
  static async getFacilityStandards(facilityId: string): Promise<FacilityStandard[]> {
    try {
      const { data, error } = await supabase.rpc('get_facility_standards', {
        p_facility_id: facilityId
      });
      
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        compliance_status: item.compliance_status as ComplianceStatus
      }));
    } catch (error) {
      console.error('Error fetching facility standards:', error);
      toast.error('Failed to load facility standards');
      return [];
    }
  }

  /**
   * Get all facility standards across all facilities
   */
  static async getAllFacilityStandards(): Promise<FacilityStandard[]> {
    try {
      const { data, error } = await supabase
        .from('facility_standards')
        .select(`
          *,
          regulatory_standards:standard_id (
            name,
            code,
            description,
            version,
            authority
          ),
          facilities:facility_id (
            name,
            address
          )
        `);
      
      if (error) throw error;
      return data?.map(item => ({
        ...item,
        compliance_status: item.compliance_status as ComplianceStatus,
        standard_name: item.regulatory_standards?.name,
        standard_code: item.regulatory_standards?.code,
        standard_description: item.regulatory_standards?.description,
        standard_version: item.regulatory_standards?.version,
        standard_authority: item.regulatory_standards?.authority,
        facility_name: item.facilities?.name,
        facility_address: item.facilities?.address,
        regulatory_standards: undefined, // Remove the raw join data
        facilities: undefined // Remove the raw join data
      })) || [];
    } catch (error) {
      console.error('Error fetching all facility standards:', error);
      toast.error('Failed to load facility standards');
      return [];
    }
  }

  /**
   * Assign standard to facility
   */
  static async assignStandardToFacility(
    facilityId: string, 
    standardId: string, 
    compliance_status: ComplianceStatus = 'Not Started'
  ): Promise<FacilityStandard | null> {
    try {
      const { data, error } = await supabase.from('facility_standards').insert([{
        facility_id: facilityId,
        standard_id: standardId,
        compliance_status
      }]).select().single();
      
      if (error) throw error;
      toast.success('Standard assigned to facility');
      return {
        ...data,
        compliance_status: data.compliance_status as ComplianceStatus
      };
    } catch (error) {
      console.error('Error assigning standard to facility:', error);
      toast.error('Failed to assign standard');
      return null;
    }
  }

  /**
   * Update facility standard compliance
   */
  static async updateFacilityStandardCompliance(
    id: string, 
    updates: Partial<FacilityStandard>
  ): Promise<FacilityStandard | null> {
    try {
      const { data, error } = await supabase
        .from('facility_standards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Compliance status updated');
      return {
        ...data,
        compliance_status: data.compliance_status as ComplianceStatus
      };
    } catch (error) {
      console.error('Error updating facility standard:', error);
      toast.error('Failed to update compliance');
      return null;
    }
  }

  // ============= COMPLIANCE ANALYTICS =============

  /**
   * Get compliance overview statistics
   */
  static async getComplianceOverview(): Promise<StandardCompliance> {
    try {
      const { data: facilityStandards, error } = await supabase
        .from('facility_standards')
        .select('compliance_status, expiry_date');
      
      if (error) throw error;

      const total = facilityStandards?.length || 0;
      const certified = facilityStandards?.filter(fs => fs.compliance_status === 'Certified').length || 0;
      const compliant = facilityStandards?.filter(fs => fs.compliance_status === 'Compliant').length || 0;
      const inProgress = facilityStandards?.filter(fs => fs.compliance_status === 'In Progress').length || 0;
      const expired = facilityStandards?.filter(fs => {
        if (!fs.expiry_date) return false;
        return new Date(fs.expiry_date) < new Date();
      }).length || 0;

      const expiringSoon = facilityStandards?.filter(fs => {
        if (!fs.expiry_date) return false;
        const expiryDate = new Date(fs.expiry_date);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
      }).length || 0;

      return {
        totalStandards: total,
        certified,
        compliant,
        inProgress,
        expired,
        expiringSoon,
        averageCompliance: total > 0 ? Math.round(((certified + compliant) / total) * 100) : 0
      };
    } catch (error) {
      console.error('Error getting compliance overview:', error);
      return {
        totalStandards: 0,
        certified: 0,
        compliant: 0,
        inProgress: 0,
        expired: 0,
        expiringSoon: 0,
        averageCompliance: 0
      };
    }
  }

  /**
   * Get compliance trends over time
   */
  static async getComplianceTrends(months: number = 12): Promise<any[]> {
    try {
      // This would typically query historical compliance data
      // For now, returning mock trend data
      const trends = [];
      const currentDate = new Date();
      
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        trends.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          compliance: Math.floor(Math.random() * 20) + 75, // Mock data 75-95%
          certified: Math.floor(Math.random() * 10) + 5,
          issues: Math.floor(Math.random() * 5) + 1
        });
      }
      
      return trends;
    } catch (error) {
      console.error('Error getting compliance trends:', error);
      return [];
    }
  }

  // ============= INTEGRATIONS =============

  /**
   * Get audits related to specific standard
   */
  static async getStandardAudits(standardId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('related_standard', standardId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching standard audits:', error);
      return [];
    }
  }

  /**
   * Get CAPAs related to standard compliance
   */
  static async getStandardCAPAs(standardId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('capa_actions')
        .select('*')
        .ilike('description', `%${standardId}%`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching standard CAPAs:', error);
      return [];
    }
  }

  /**
   * Get documents related to specific standard
   */
  static async getStandardDocuments(standardId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('linked_item_id', standardId)
        .eq('linked_module', 'standards')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching standard documents:', error);
      return [];
    }
  }

  /**
   * Link document to standard
   */
  static async linkDocumentToStandard(documentId: string, standardId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          linked_item_id: standardId,
          linked_module: 'standards'
        })
        .eq('id', documentId);
      
      if (error) throw error;
      toast.success('Document linked to standard');
      return true;
    } catch (error) {
      console.error('Error linking document to standard:', error);
      toast.error('Failed to link document');
      return false;
    }
  }

  /**
   * Generate CAPA from standard non-compliance
   */
  static async generateCAPAFromStandard(
    facilityStandardId: string, 
    userId: string, 
    description: string
  ): Promise<any | null> {
    try {
      // Set due date to 30 days from now
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      
      const { data, error } = await supabase.from('capa_actions').insert({
        title: `Standards Compliance CAPA`,
        description,
        source: 'Standards Compliance',
        source_id: facilityStandardId,
        created_by: userId,
        assigned_to: userId,
        priority: 'High',
        status: 'Open',
        due_date: dueDate.toISOString()
      }).select().single();
      
      if (error) throw error;
      toast.success('CAPA generated from standards compliance issue');
      return data;
    } catch (error) {
      console.error('Error generating CAPA from standard:', error);
      toast.error('Failed to generate CAPA');
      return null;
    }
  }

  // ============= REPORTING =============

  /**
   * Generate compliance report
   */
  static async generateComplianceReport(facilityId?: string): Promise<any> {
    try {
      let query = supabase
        .from('facility_standards')
        .select(`
          *,
          regulatory_standards:standard_id (name, code, authority),
          facilities:facility_id (name, address)
        `);
      
      if (facilityId) {
        query = query.eq('facility_id', facilityId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return {
        generated_at: new Date().toISOString(),
        facility_id: facilityId || 'all',
        standards_count: data?.length || 0,
        compliance_data: data || []
      };
    } catch (error) {
      console.error('Error generating compliance report:', error);
      toast.error('Failed to generate report');
      return null;
    }
  }
}

export default StandardsService;