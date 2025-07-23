// Enhanced types for the Standards module

export interface RegulatoryStandard {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  version?: string | null;
  authority?: string | null;
  documentation_url?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
  
  // Additional fields for enhanced functionality
  requirements_count?: number;
  category?: string; // 'Food Safety', 'Quality', 'Environmental', etc.
  scope?: string; // 'Manufacturing', 'Retail', 'Distribution', etc.
  certification_body?: string;
  annual_fee?: number;
  renewal_period_months?: number;
  is_mandatory?: boolean;
  geographical_scope?: string[];
  industry_sectors?: string[];
}

export interface FacilityStandard {
  id: string;
  facility_id: string;
  standard_id: string;
  compliance_status: ComplianceStatus;
  certification_date?: string | null;
  expiry_date?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  
  // Join data from regulatory_standards
  standard_name?: string;
  standard_code?: string;
  standard_description?: string;
  standard_version?: string;
  standard_authority?: string;
  
  // Join data from facilities
  facility_name?: string;
  facility_address?: string;
  
  // Enhanced compliance tracking
  compliance_score?: number; // 0-100
  last_audit_date?: string;
  next_audit_date?: string;
  auditor_name?: string;
  certification_number?: string;
  non_conformities_count?: number;
  capa_actions_count?: number;
  
  // Legacy support
  regulatory_standards?: RegulatoryStandard;
  facilities?: any;
}

export interface StandardRequirement {
  id: string;
  standard_id: string;
  requirement_number: string;
  title: string;
  description: string;
  category: RequirementCategory;
  criticality: RequirementCriticality;
  verification_method: VerificationMethod;
  evidence_required: string[];
  is_mandatory: boolean;
  parent_requirement_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FacilityRequirementCompliance {
  id: string;
  facility_standard_id: string;
  requirement_id: string;
  compliance_status: RequirementComplianceStatus;
  evidence_provided: string[];
  evidence_urls: string[];
  notes?: string;
  verified_by?: string;
  verified_at?: string;
  due_date?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StandardAudit {
  id: string;
  facility_standard_id: string;
  audit_type: AuditType;
  auditor_name: string;
  audit_date: string;
  findings: AuditFinding[];
  overall_score: number;
  certification_granted: boolean;
  certification_expiry?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  report_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuditFinding {
  id: string;
  requirement_id: string;
  finding_type: FindingType;
  description: string;
  severity: FindingSeverity;
  corrective_action_required: boolean;
  corrective_action_description?: string;
  corrective_action_due_date?: string;
  status: FindingStatus;
  evidence_urls: string[];
}

export interface StandardCompliance {
  totalStandards: number;
  certified: number;
  compliant: number;
  inProgress: number;
  expired: number;
  expiringSoon: number;
  averageCompliance: number;
}

export interface ComplianceTrend {
  month: string;
  compliance: number;
  certified: number;
  issues: number;
}

export interface StandardsFilter {
  status?: ComplianceStatus | ComplianceStatus[];
  authority?: string | string[];
  category?: string | string[];
  facility_id?: string;
  expiry_date_range?: {
    start: string;
    end: string;
  };
  search_term?: string;
}

export interface StandardsStatistics {
  total_standards: number;
  by_status: Record<ComplianceStatus, number>;
  by_authority: Record<string, number>;
  by_category: Record<string, number>;
  expiring_this_month: number;
  expired: number;
  average_compliance_score: number;
  recent_audits: number;
  pending_capas: number;
}

// Enums and Types
export type ComplianceStatus = 
  | 'Not Started'
  | 'In Progress' 
  | 'Compliant'
  | 'Certified'
  | 'Non-Compliant'
  | 'Expired'
  | 'Under Review'
  | 'Suspended';

export type RequirementCategory = 
  | 'Documentation'
  | 'Training'
  | 'Infrastructure'
  | 'Process Control'
  | 'Monitoring'
  | 'Verification'
  | 'Management System'
  | 'Legal Compliance';

export type RequirementCriticality = 
  | 'Critical'
  | 'Major'
  | 'Minor'
  | 'Informational';

export type VerificationMethod = 
  | 'Document Review'
  | 'Physical Inspection'
  | 'Testing'
  | 'Interview'
  | 'Record Review'
  | 'Observation'
  | 'Measurement';

export type RequirementComplianceStatus = 
  | 'Not Started'
  | 'In Progress'
  | 'Complete'
  | 'Non-Compliant'
  | 'Needs Review'
  | 'Approved';

export type AuditType = 
  | 'Internal'
  | 'External'
  | 'Certification'
  | 'Surveillance'
  | 'Follow-up';

export type FindingType = 
  | 'Non-Conformity'
  | 'Observation'
  | 'Opportunity for Improvement'
  | 'Positive Finding';

export type FindingSeverity = 
  | 'Critical'
  | 'Major'
  | 'Minor';

export type FindingStatus = 
  | 'Open'
  | 'In Progress'
  | 'Resolved'
  | 'Verified'
  | 'Closed';

// Standard Categories for common regulatory frameworks
export const STANDARD_CATEGORIES = {
  FOOD_SAFETY: 'Food Safety',
  QUALITY_MANAGEMENT: 'Quality Management',
  ENVIRONMENTAL: 'Environmental',
  OCCUPATIONAL_HEALTH: 'Occupational Health & Safety',
  INFORMATION_SECURITY: 'Information Security',
  REGULATORY_COMPLIANCE: 'Regulatory Compliance',
  INDUSTRY_SPECIFIC: 'Industry Specific'
} as const;

// Common regulatory authorities
export const REGULATORY_AUTHORITIES = {
  ISO: 'International Organization for Standardization',
  FDA: 'Food and Drug Administration',
  USDA: 'United States Department of Agriculture',
  GFSI: 'Global Food Safety Initiative',
  BRC: 'British Retail Consortium',
  SQF: 'Safe Quality Food Institute',
  FSSC: 'Food Safety System Certification',
  IFS: 'International Featured Standards',
  HACCP: 'Hazard Analysis Critical Control Points',
  OSHA: 'Occupational Safety and Health Administration',
  EPA: 'Environmental Protection Agency'
} as const;

// Standard compliance colors for UI
export const COMPLIANCE_COLORS = {
  'Not Started': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
  'In Progress': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  'Compliant': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  'Certified': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  'Non-Compliant': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  'Expired': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  'Under Review': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  'Suspended': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' }
} as const;