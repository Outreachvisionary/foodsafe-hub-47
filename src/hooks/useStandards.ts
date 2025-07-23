import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StandardsService } from '@/services/standardsService';
import { 
  RegulatoryStandard, 
  FacilityStandard, 
  StandardCompliance,
  StandardsFilter,
  ComplianceStatus
} from '@/types/standards';
import { toast } from 'sonner';

// ============= REGULATORY STANDARDS HOOKS =============

export const useRegulatoryStandards = () => {
  return useQuery({
    queryKey: ['regulatory-standards'],
    queryFn: StandardsService.getRegulatoryStandards,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRegulatoryStandard = (id: string) => {
  return useQuery({
    queryKey: ['regulatory-standard', id],
    queryFn: () => StandardsService.getRegulatoryStandardById(id),
    enabled: !!id,
  });
};

export const useCreateRegulatoryStandard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: StandardsService.createRegulatoryStandard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regulatory-standards'] });
      toast.success('Regulatory standard created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create standard: ${error.message}`);
    },
  });
};

export const useUpdateRegulatoryStandard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<RegulatoryStandard> }) =>
      StandardsService.updateRegulatoryStandard(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['regulatory-standards'] });
      queryClient.invalidateQueries({ queryKey: ['regulatory-standard', variables.id] });
      toast.success('Standard updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update standard: ${error.message}`);
    },
  });
};

// ============= FACILITY STANDARDS HOOKS =============

export const useFacilityStandards = (facilityId?: string) => {
  return useQuery({
    queryKey: ['facility-standards', facilityId],
    queryFn: facilityId 
      ? () => StandardsService.getFacilityStandards(facilityId)
      : StandardsService.getAllFacilityStandards,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAssignStandardToFacility = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      facilityId, 
      standardId, 
      complianceStatus 
    }: { 
      facilityId: string; 
      standardId: string; 
      complianceStatus?: ComplianceStatus;
    }) => StandardsService.assignStandardToFacility(facilityId, standardId, complianceStatus),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['facility-standards'] });
      queryClient.invalidateQueries({ queryKey: ['facility-standards', variables.facilityId] });
      queryClient.invalidateQueries({ queryKey: ['compliance-overview'] });
      toast.success('Standard assigned to facility');
    },
    onError: (error: any) => {
      toast.error(`Failed to assign standard: ${error.message}`);
    },
  });
};

export const useUpdateFacilityStandardCompliance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FacilityStandard> }) =>
      StandardsService.updateFacilityStandardCompliance(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-standards'] });
      queryClient.invalidateQueries({ queryKey: ['compliance-overview'] });
      toast.success('Compliance status updated');
    },
    onError: (error: any) => {
      toast.error(`Failed to update compliance: ${error.message}`);
    },
  });
};

// ============= COMPLIANCE ANALYTICS HOOKS =============

export const useComplianceOverview = () => {
  return useQuery({
    queryKey: ['compliance-overview'],
    queryFn: StandardsService.getComplianceOverview,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useComplianceTrends = (months: number = 12) => {
  return useQuery({
    queryKey: ['compliance-trends', months],
    queryFn: () => StandardsService.getComplianceTrends(months),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ============= INTEGRATION HOOKS =============

export const useStandardAudits = (standardId: string) => {
  return useQuery({
    queryKey: ['standard-audits', standardId],
    queryFn: () => StandardsService.getStandardAudits(standardId),
    enabled: !!standardId,
  });
};

export const useStandardCAPAs = (standardId: string) => {
  return useQuery({
    queryKey: ['standard-capas', standardId],
    queryFn: () => StandardsService.getStandardCAPAs(standardId),
    enabled: !!standardId,
  });
};

export const useStandardDocuments = (standardId: string) => {
  return useQuery({
    queryKey: ['standard-documents', standardId],
    queryFn: () => StandardsService.getStandardDocuments(standardId),
    enabled: !!standardId,
  });
};

export const useLinkDocumentToStandard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ documentId, standardId }: { documentId: string; standardId: string }) =>
      StandardsService.linkDocumentToStandard(documentId, standardId),
    onSuccess: (success, variables) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['standard-documents', variables.standardId] });
        toast.success('Document linked to standard');
      }
    },
    onError: (error: any) => {
      toast.error(`Failed to link document: ${error.message}`);
    },
  });
};

export const useGenerateCAPAFromStandard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      facilityStandardId, 
      userId, 
      description 
    }: { 
      facilityStandardId: string; 
      userId: string; 
      description: string;
    }) => StandardsService.generateCAPAFromStandard(facilityStandardId, userId, description),
    onSuccess: (data, variables) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['capas'] });
        queryClient.invalidateQueries({ queryKey: ['standard-capas'] });
        toast.success('CAPA generated from standards compliance issue');
      }
    },
    onError: (error: any) => {
      toast.error(`Failed to generate CAPA: ${error.message}`);
    },
  });
};

// ============= REPORTING HOOKS =============

export const useGenerateComplianceReport = () => {
  return useMutation({
    mutationFn: (facilityId?: string) => StandardsService.generateComplianceReport(facilityId),
    onSuccess: (data) => {
      if (data) {
        toast.success('Compliance report generated successfully');
      }
    },
    onError: (error: any) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });
};

// ============= CUSTOM HOOKS FOR FILTERING AND SEARCH =============

export const useFilteredStandards = (
  standards: FacilityStandard[] = [], 
  filters: StandardsFilter = {}
) => {
  const filteredStandards = standards.filter(standard => {
    // Status filter
    if (filters.status && Array.isArray(filters.status)) {
      if (!filters.status.includes(standard.compliance_status)) return false;
    } else if (filters.status && filters.status !== standard.compliance_status) {
      return false;
    }

    // Authority filter
    if (filters.authority && Array.isArray(filters.authority)) {
      if (!filters.authority.includes(standard.standard_authority || '')) return false;
    } else if (filters.authority && filters.authority !== standard.standard_authority) {
      return false;
    }

    // Facility filter
    if (filters.facility_id && filters.facility_id !== standard.facility_id) {
      return false;
    }

    // Search term filter
    if (filters.search_term) {
      const searchTerm = filters.search_term.toLowerCase();
      const searchableFields = [
        standard.standard_name,
        standard.standard_code,
        standard.standard_description,
        standard.facility_name
      ];
      
      const matchesSearch = searchableFields.some(field => 
        field?.toLowerCase().includes(searchTerm)
      );
      
      if (!matchesSearch) return false;
    }

    // Expiry date range filter
    if (filters.expiry_date_range && standard.expiry_date) {
      const expiryDate = new Date(standard.expiry_date);
      const startDate = new Date(filters.expiry_date_range.start);
      const endDate = new Date(filters.expiry_date_range.end);
      
      if (expiryDate < startDate || expiryDate > endDate) return false;
    }

    return true;
  });

  return filteredStandards;
};

export const useStandardsStatistics = (standards: FacilityStandard[] = []) => {
  const statistics = {
    total_standards: standards.length,
    by_status: standards.reduce((acc, standard) => {
      acc[standard.compliance_status] = (acc[standard.compliance_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    by_authority: standards.reduce((acc, standard) => {
      const authority = standard.standard_authority || 'Unknown';
      acc[authority] = (acc[authority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    expiring_this_month: standards.filter(standard => {
      if (!standard.expiry_date) return false;
      const expiryDate = new Date(standard.expiry_date);
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return expiryDate <= nextMonth && expiryDate >= now;
    }).length,
    expired: standards.filter(standard => {
      if (!standard.expiry_date) return false;
      return new Date(standard.expiry_date) < new Date();
    }).length,
    average_compliance_score: standards.reduce((sum, standard) => 
      sum + (standard.compliance_score || 0), 0) / Math.max(standards.length, 1)
  };

  return statistics;
};