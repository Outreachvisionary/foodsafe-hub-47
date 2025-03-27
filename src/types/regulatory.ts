
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
}

export interface FacilityStandard {
  id: string;
  facility_id: string;
  standard_id: string;
  compliance_status: string;
  certification_date?: string | null;
  expiry_date?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  regulatory_standards?: RegulatoryStandard;
}
