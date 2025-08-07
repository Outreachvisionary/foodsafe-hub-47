
export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  contact_person?: string;
  contact_email: string;
  contact_phone: string;
  country: string;
  category?: string;
  business_type?: string;
  compliance_status?: string;
  certification_status?: string;
  status: string;
  risk_score?: number;
  risk_level?: string;
  last_audit_date?: string;
  products?: string[];
  created_at?: string;
  updated_at?: string;
  fsmsStandards?: FsmsStandard[];
  documents?: SupplierDocument[];
  // Additional properties from database
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export type StandardName = 'SQF' | 'BRC GS2' | 'ISO 22000' | 'FSSC 22000' | 'HACCP' | 'all';

export interface StandardRequirement {
  standard: StandardName;
  name: string;
  description: string;
  category: string;
}

export interface FsmsStandard {
  name: string;
  certified: boolean;
  certificationNumber?: string;
  expiryDate?: string;
  level?: string;
  scope?: string;
}

export interface MonitoringData {
  id: string;
  timestamp: string;
  reading: number;
  parameter: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  sensor_id: string;
  location: string;
  // Add these properties to match what's used in the SensorData component
  temperature: number;
  humidity: number;
  locationName?: string; // Optional for backward compatibility
}

export interface SupplierDocument {
  id: string;
  supplier_id: string;
  name: string;
  type: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  expiry_date?: string;
  status: string;
  standard?: StandardName;
  created_at?: string;
  updated_at?: string;
  // For backward compatibility
  fileName?: string;
  uploadDate?: string;
  expiryDate?: string;
  supplier?: string;
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
