
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      suppliers: {
        Row: {
          id: string
          name: string
          category: string
          country: string
          risk_score: number
          compliance_status: string
          last_audit_date: string | null
          contact_name: string
          contact_email: string
          contact_phone: string
          products: string[] | null
          status: 'Active' | 'Pending' | 'Suspended' | 'Inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          country: string
          risk_score?: number
          compliance_status?: string
          last_audit_date?: string | null
          contact_name: string
          contact_email: string
          contact_phone: string
          products?: string[] | null
          status?: 'Active' | 'Pending' | 'Suspended' | 'Inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          country?: string
          risk_score?: number
          compliance_status?: string
          last_audit_date?: string | null
          contact_name?: string
          contact_email?: string
          contact_phone?: string
          products?: string[] | null
          status?: 'Active' | 'Pending' | 'Suspended' | 'Inactive'
          updated_at?: string
        }
      }
      supplier_standards: {
        Row: {
          id: string
          supplier_id: string
          name: 'SQF' | 'BRC GS2' | 'ISO 22000' | 'FSSC 22000' | 'HACCP'
          certified: boolean
          certification_number: string | null
          expiry_date: string | null
          level: string | null
          scope: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier_id: string
          name: 'SQF' | 'BRC GS2' | 'ISO 22000' | 'FSSC 22000' | 'HACCP'
          certified: boolean
          certification_number?: string | null
          expiry_date?: string | null
          level?: string | null
          scope?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string
          name?: 'SQF' | 'BRC GS2' | 'ISO 22000' | 'FSSC 22000' | 'HACCP'
          certified?: boolean
          certification_number?: string | null
          expiry_date?: string | null
          level?: string | null
          scope?: string | null
          updated_at?: string
        }
      }
      supplier_documents: {
        Row: {
          id: string
          supplier_id: string
          name: string
          type: string
          upload_date: string
          expiry_date: string | null
          status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Pending Review'
          file_name: string
          file_path: string
          file_size: number | null
          standard: 'SQF' | 'BRC GS2' | 'ISO 22000' | 'FSSC 22000' | 'HACCP' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier_id: string
          name: string
          type: string
          upload_date?: string
          expiry_date?: string | null
          status?: 'Valid' | 'Expiring Soon' | 'Expired' | 'Pending Review'
          file_name: string
          file_path: string
          file_size?: number | null
          standard?: 'SQF' | 'BRC GS2' | 'ISO 22000' | 'FSSC 22000' | 'HACCP' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string
          name?: string
          type?: string
          upload_date?: string
          expiry_date?: string | null
          status?: 'Valid' | 'Expiring Soon' | 'Expired' | 'Pending Review'
          file_name?: string
          file_path?: string
          file_size?: number | null
          standard?: 'SQF' | 'BRC GS2' | 'ISO 22000' | 'FSSC 22000' | 'HACCP' | null
          updated_at?: string
        }
      }
      supplier_risk_assessments: {
        Row: {
          id: string
          supplier_id: string
          assessment_date: string
          assessed_by: string
          overall_score: number
          food_safety_score: number | null
          quality_system_score: number | null
          regulatory_score: number | null
          delivery_score: number | null
          traceability_score: number | null
          risk_factors: Json | null
          risk_level: 'Low' | 'Medium' | 'High'
          next_assessment_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier_id: string
          assessment_date?: string
          assessed_by: string
          overall_score: number
          food_safety_score?: number | null
          quality_system_score?: number | null
          regulatory_score?: number | null
          delivery_score?: number | null
          traceability_score?: number | null
          risk_factors?: Json | null
          risk_level: 'Low' | 'Medium' | 'High'
          next_assessment_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string
          assessment_date?: string
          assessed_by?: string
          overall_score?: number
          food_safety_score?: number | null
          quality_system_score?: number | null
          regulatory_score?: number | null
          delivery_score?: number | null
          traceability_score?: number | null
          risk_factors?: Json | null
          risk_level?: 'Low' | 'Medium' | 'High'
          next_assessment_date?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      supplier_approval_workflows: {
        Row: {
          id: string
          supplier_id: string
          status: 'Initiated' | 'Document Review' | 'Risk Assessment' | 'Audit Scheduled' | 'Audit Completed' | 'Pending Approval' | 'Approved' | 'Rejected'
          initiated_by: string
          initiated_at: string
          current_step: number
          approvers: string[] | null
          approval_history: Json | null
          due_date: string | null
          completed_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier_id: string
          status?: 'Initiated' | 'Document Review' | 'Risk Assessment' | 'Audit Scheduled' | 'Audit Completed' | 'Pending Approval' | 'Approved' | 'Rejected'
          initiated_by: string
          initiated_at?: string
          current_step?: number
          approvers?: string[] | null
          approval_history?: Json | null
          due_date?: string | null
          completed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string
          status?: 'Initiated' | 'Document Review' | 'Risk Assessment' | 'Audit Scheduled' | 'Audit Completed' | 'Pending Approval' | 'Approved' | 'Rejected'
          initiated_by?: string
          initiated_at?: string
          current_step?: number
          approvers?: string[] | null
          approval_history?: Json | null
          due_date?: string | null
          completed_at?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      supplier_monitoring_data: {
        Row: {
          id: string
          supplier_id: string
          device_id: string
          temperature: number | null
          humidity: number | null
          timestamp: string
          status: 'Normal' | 'Warning' | 'Critical'
          location_name: string
          additional_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          supplier_id: string
          device_id: string
          temperature?: number | null
          humidity?: number | null
          timestamp?: string
          status?: 'Normal' | 'Warning' | 'Critical'
          location_name: string
          additional_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string
          device_id?: string
          temperature?: number | null
          humidity?: number | null
          timestamp?: string
          status?: 'Normal' | 'Warning' | 'Critical'
          location_name?: string
          additional_data?: Json | null
        }
      }
      standard_requirements: {
        Row: {
          id: string
          standard: 'SQF' | 'BRC GS2' | 'ISO 22000' | 'FSSC 22000' | 'HACCP' | 'all'
          name: string
          description: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          standard: 'SQF' | 'BRC GS2' | 'ISO 22000' | 'FSSC 22000' | 'HACCP' | 'all'
          name: string
          description: string
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          standard?: 'SQF' | 'BRC GS2' | 'ISO 22000' | 'FSSC 22000' | 'HACCP' | 'all'
          name?: string
          description?: string
          category?: string
          updated_at?: string
        }
      }
    }
  }
}
