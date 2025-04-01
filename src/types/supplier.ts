
export interface Supplier {
  id: string;
  name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  country: string;
  category: string;
  compliance_status: string;
  status: string;
  risk_score: number;
  last_audit_date?: string;
  products?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SupplierDocument {
  id: string;
  supplier_id: string;
  name: string;
  type: string;
  fileName: string;  // Changed from file_path
  file_size: number;
  uploadDate?: string;  // Changed from upload_date
  expiry_date?: string;
  status: string;
  standard?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupplierStandard {
  id: string;
  supplier_id: string;
  name: string;
  certified: boolean;
  certification_number?: string;
  level?: string;
  scope?: string;
  expiry_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupplierRiskAssessment {
  id: string;
  supplier_id: string;
  overall_score: number;
  risk_level: string;
  food_safety_score?: number;
  quality_system_score?: number;
  regulatory_score?: number;
  delivery_score?: number;
  traceability_score?: number;
  risk_factors?: Record<string, any>;
  notes?: string;
  assessed_by: string;
  assessment_date: string;
  next_assessment_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupplierApprovalWorkflow {
  id: string;
  supplier_id: string;
  status: string;
  current_step: number;
  approvers?: string[];
  initiated_by: string;
  initiated_at: string;
  completed_at?: string;
  notes?: string;
  due_date?: string;
  approval_history?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}
