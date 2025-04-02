export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_findings: {
        Row: {
          assigned_to: string | null
          audit_id: string
          capa_id: string | null
          created_at: string | null
          description: string
          due_date: string | null
          evidence: string | null
          id: string
          severity: Database["public"]["Enums"]["finding_severity"]
          status: Database["public"]["Enums"]["finding_status"]
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          audit_id: string
          capa_id?: string | null
          created_at?: string | null
          description: string
          due_date?: string | null
          evidence?: string | null
          id?: string
          severity: Database["public"]["Enums"]["finding_severity"]
          status?: Database["public"]["Enums"]["finding_status"]
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          audit_id?: string
          capa_id?: string | null
          created_at?: string | null
          description?: string
          due_date?: string | null
          evidence?: string | null
          id?: string
          severity?: Database["public"]["Enums"]["finding_severity"]
          status?: Database["public"]["Enums"]["finding_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_findings_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          assigned_to: string
          audit_type: string
          completion_date: string | null
          created_at: string | null
          created_by: string
          department: string | null
          description: string | null
          due_date: string
          findings_count: number | null
          id: string
          location: string | null
          related_standard: string | null
          start_date: string
          status: Database["public"]["Enums"]["audit_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to: string
          audit_type: string
          completion_date?: string | null
          created_at?: string | null
          created_by: string
          department?: string | null
          description?: string | null
          due_date: string
          findings_count?: number | null
          id?: string
          location?: string | null
          related_standard?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["audit_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string
          audit_type?: string
          completion_date?: string | null
          created_at?: string | null
          created_by?: string
          department?: string | null
          description?: string | null
          due_date?: string
          findings_count?: number | null
          id?: string
          location?: string | null
          related_standard?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["audit_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      capa_actions: {
        Row: {
          assigned_to: string
          completion_date: string | null
          corrective_action: string | null
          created_at: string | null
          created_by: string
          department: string | null
          description: string
          due_date: string
          effectiveness_criteria: string | null
          effectiveness_rating:
            | Database["public"]["Enums"]["capa_effectiveness_rating"]
            | null
          effectiveness_verified: boolean | null
          fsma204_compliant: boolean | null
          id: string
          preventive_action: string | null
          priority: string
          root_cause: string | null
          source: string
          source_id: string | null
          status: Database["public"]["Enums"]["capa_status"] | null
          title: string
          updated_at: string | null
          verification_date: string | null
          verification_method: string | null
          verified_by: string | null
        }
        Insert: {
          assigned_to: string
          completion_date?: string | null
          corrective_action?: string | null
          created_at?: string | null
          created_by: string
          department?: string | null
          description: string
          due_date: string
          effectiveness_criteria?: string | null
          effectiveness_rating?:
            | Database["public"]["Enums"]["capa_effectiveness_rating"]
            | null
          effectiveness_verified?: boolean | null
          fsma204_compliant?: boolean | null
          id?: string
          preventive_action?: string | null
          priority: string
          root_cause?: string | null
          source: string
          source_id?: string | null
          status?: Database["public"]["Enums"]["capa_status"] | null
          title: string
          updated_at?: string | null
          verification_date?: string | null
          verification_method?: string | null
          verified_by?: string | null
        }
        Update: {
          assigned_to?: string
          completion_date?: string | null
          corrective_action?: string | null
          created_at?: string | null
          created_by?: string
          department?: string | null
          description?: string
          due_date?: string
          effectiveness_criteria?: string | null
          effectiveness_rating?:
            | Database["public"]["Enums"]["capa_effectiveness_rating"]
            | null
          effectiveness_verified?: boolean | null
          fsma204_compliant?: boolean | null
          id?: string
          preventive_action?: string | null
          priority?: string
          root_cause?: string | null
          source?: string
          source_id?: string | null
          status?: Database["public"]["Enums"]["capa_status"] | null
          title?: string
          updated_at?: string | null
          verification_date?: string | null
          verification_method?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      capa_activities: {
        Row: {
          action_description: string
          action_type: string
          capa_id: string | null
          id: string
          metadata: Json | null
          new_status: Database["public"]["Enums"]["capa_status"] | null
          old_status: Database["public"]["Enums"]["capa_status"] | null
          performed_at: string | null
          performed_by: string
        }
        Insert: {
          action_description: string
          action_type: string
          capa_id?: string | null
          id?: string
          metadata?: Json | null
          new_status?: Database["public"]["Enums"]["capa_status"] | null
          old_status?: Database["public"]["Enums"]["capa_status"] | null
          performed_at?: string | null
          performed_by: string
        }
        Update: {
          action_description?: string
          action_type?: string
          capa_id?: string | null
          id?: string
          metadata?: Json | null
          new_status?: Database["public"]["Enums"]["capa_status"] | null
          old_status?: Database["public"]["Enums"]["capa_status"] | null
          performed_at?: string | null
          performed_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "capa_activities_capa_id_fkey"
            columns: ["capa_id"]
            isOneToOne: false
            referencedRelation: "capa_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      capa_effectiveness_assessments: {
        Row: {
          assessment_date: string | null
          capa_id: string | null
          created_by: string
          documentation_complete: boolean | null
          id: string
          notes: string | null
          preventive_measures_implemented: boolean | null
          rating:
            | Database["public"]["Enums"]["capa_effectiveness_rating"]
            | null
          recurrence_check: string | null
          root_cause_eliminated: boolean | null
          score: number | null
        }
        Insert: {
          assessment_date?: string | null
          capa_id?: string | null
          created_by: string
          documentation_complete?: boolean | null
          id?: string
          notes?: string | null
          preventive_measures_implemented?: boolean | null
          rating?:
            | Database["public"]["Enums"]["capa_effectiveness_rating"]
            | null
          recurrence_check?: string | null
          root_cause_eliminated?: boolean | null
          score?: number | null
        }
        Update: {
          assessment_date?: string | null
          capa_id?: string | null
          created_by?: string
          documentation_complete?: boolean | null
          id?: string
          notes?: string | null
          preventive_measures_implemented?: boolean | null
          rating?:
            | Database["public"]["Enums"]["capa_effectiveness_rating"]
            | null
          recurrence_check?: string | null
          root_cause_eliminated?: boolean | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "capa_effectiveness_assessments_capa_id_fkey"
            columns: ["capa_id"]
            isOneToOne: false
            referencedRelation: "capa_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      capa_related_documents: {
        Row: {
          added_at: string | null
          added_by: string
          capa_id: string | null
          document_id: string | null
          document_type: string | null
          id: string
        }
        Insert: {
          added_at?: string | null
          added_by: string
          capa_id?: string | null
          document_id?: string | null
          document_type?: string | null
          id?: string
        }
        Update: {
          added_at?: string | null
          added_by?: string
          capa_id?: string | null
          document_id?: string | null
          document_type?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "capa_related_documents_capa_id_fkey"
            columns: ["capa_id"]
            isOneToOne: false
            referencedRelation: "capa_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capa_related_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      capa_related_training: {
        Row: {
          added_at: string | null
          added_by: string
          capa_id: string | null
          id: string
          training_id: string | null
        }
        Insert: {
          added_at?: string | null
          added_by: string
          capa_id?: string | null
          id?: string
          training_id?: string | null
        }
        Update: {
          added_at?: string | null
          added_by?: string
          capa_id?: string | null
          id?: string
          training_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "capa_related_training_capa_id_fkey"
            columns: ["capa_id"]
            isOneToOne: false
            referencedRelation: "capa_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capa_related_training_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ccps: {
        Row: {
          corrective_actions: string
          created_at: string | null
          critical_limits: string
          haccp_plan_id: string
          hazard_description: string
          id: string
          monitoring_procedure: string
          record_keeping: string
          step_description: string
          step_number: number
          updated_at: string | null
          verification_activities: string
        }
        Insert: {
          corrective_actions: string
          created_at?: string | null
          critical_limits: string
          haccp_plan_id: string
          hazard_description: string
          id?: string
          monitoring_procedure: string
          record_keeping: string
          step_description: string
          step_number: number
          updated_at?: string | null
          verification_activities: string
        }
        Update: {
          corrective_actions?: string
          created_at?: string | null
          critical_limits?: string
          haccp_plan_id?: string
          hazard_description?: string
          id?: string
          monitoring_procedure?: string
          record_keeping?: string
          step_description?: string
          step_number?: number
          updated_at?: string | null
          verification_activities?: string
        }
        Relationships: [
          {
            foreignKeyName: "ccps_haccp_plan_id_fkey"
            columns: ["haccp_plan_id"]
            isOneToOne: false
            referencedRelation: "haccp_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          assigned_to: string | null
          capa_id: string | null
          category: Database["public"]["Enums"]["complaint_category"]
          created_at: string | null
          created_by: string
          customer_contact: string | null
          customer_name: string | null
          description: string
          id: string
          lot_number: string | null
          product_involved: string | null
          reported_date: string
          resolution_date: string | null
          status: Database["public"]["Enums"]["complaint_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          capa_id?: string | null
          category: Database["public"]["Enums"]["complaint_category"]
          created_at?: string | null
          created_by: string
          customer_contact?: string | null
          customer_name?: string | null
          description: string
          id?: string
          lot_number?: string | null
          product_involved?: string | null
          reported_date?: string
          resolution_date?: string | null
          status?: Database["public"]["Enums"]["complaint_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          capa_id?: string | null
          category?: Database["public"]["Enums"]["complaint_category"]
          created_at?: string | null
          created_by?: string
          customer_contact?: string | null
          customer_name?: string | null
          description?: string
          id?: string
          lot_number?: string | null
          product_involved?: string | null
          reported_date?: string
          resolution_date?: string | null
          status?: Database["public"]["Enums"]["complaint_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          facility_id: string | null
          id: string
          name: string
          organization_id: string | null
          parent_department_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          facility_id?: string | null
          id?: string
          name: string
          organization_id?: string | null
          parent_department_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          facility_id?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          parent_department_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      document_access: {
        Row: {
          document_id: string
          folder_id: string | null
          granted_at: string | null
          granted_by: string
          id: string
          permission_level: string
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          document_id: string
          folder_id?: string | null
          granted_at?: string | null
          granted_by: string
          id?: string
          permission_level: string
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          document_id?: string
          folder_id?: string | null
          granted_at?: string | null
          granted_by?: string
          id?: string
          permission_level?: string
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_access_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_access_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      document_activities: {
        Row: {
          action: string
          comments: string | null
          document_id: string
          id: string
          timestamp: string | null
          user_id: string
          user_name: string
          user_role: string
        }
        Insert: {
          action: string
          comments?: string | null
          document_id: string
          id?: string
          timestamp?: string | null
          user_id: string
          user_name: string
          user_role: string
        }
        Update: {
          action?: string
          comments?: string | null
          document_id?: string
          id?: string
          timestamp?: string | null
          user_id?: string
          user_name?: string
          user_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_activities_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_category_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      document_comments: {
        Row: {
          content: string
          created_at: string
          document_id: string
          id: string
          updated_at: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          content: string
          created_at?: string
          document_id: string
          id?: string
          updated_at?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          content?: string
          created_at?: string
          document_id?: string
          id?: string
          updated_at?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_editor_sessions: {
        Row: {
          document_id: string | null
          id: string
          is_active: boolean | null
          last_activity: string | null
          session_data: Json | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          document_id?: string | null
          id?: string
          is_active?: boolean | null
          last_activity?: string | null
          session_data?: Json | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          document_id?: string | null
          id?: string
          is_active?: boolean | null
          last_activity?: string | null
          session_data?: Json | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_editor_sessions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_permission_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      document_previews: {
        Row: {
          content: string | null
          created_at: string | null
          document_id: string
          id: string
          preview_type: string
          thumbnail_path: string | null
          version_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          document_id: string
          id?: string
          preview_type: string
          thumbnail_path?: string | null
          version_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          document_id?: string
          id?: string
          preview_type?: string
          thumbnail_path?: string | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_previews_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_previews_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      document_status_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      document_versions: {
        Row: {
          change_notes: string | null
          created_at: string | null
          created_by: string
          document_id: string
          editor_metadata: Json | null
          file_name: string
          file_size: number
          id: string
          is_binary_file: boolean | null
          version: number
        }
        Insert: {
          change_notes?: string | null
          created_at?: string | null
          created_by: string
          document_id: string
          editor_metadata?: Json | null
          file_name: string
          file_size: number
          id?: string
          is_binary_file?: boolean | null
          version: number
        }
        Update: {
          change_notes?: string | null
          created_at?: string | null
          created_by?: string
          document_id?: string
          editor_metadata?: Json | null
          file_name?: string
          file_size?: number
          id?: string
          is_binary_file?: boolean | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_workflow_instances: {
        Row: {
          created_at: string | null
          created_by: string
          current_step: number
          document_id: string
          id: string
          status: string
          updated_at: string | null
          workflow_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          current_step?: number
          document_id: string
          id?: string
          status?: string
          updated_at?: string | null
          workflow_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          current_step?: number
          document_id?: string
          id?: string
          status?: string
          updated_at?: string | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_workflow_instances_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_workflow_instances_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "document_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      document_workflows: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          steps: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          steps: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          steps?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          approvers: string[] | null
          category: Database["public"]["Enums"]["document_category"]
          checkout_timestamp: string | null
          checkout_user_id: string | null
          created_at: string | null
          created_by: string
          current_version_id: string | null
          custom_notification_days: number[] | null
          description: string | null
          expiry_date: string | null
          file_name: string
          file_size: number
          file_type: string
          folder_id: string | null
          id: string
          is_locked: boolean | null
          is_template: boolean | null
          last_action: string | null
          last_review_date: string | null
          linked_item_id: string | null
          linked_module: string | null
          next_review_date: string | null
          pending_since: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["document_status"]
          tags: string[] | null
          title: string
          updated_at: string | null
          version: number
          workflow_status: string | null
        }
        Insert: {
          approvers?: string[] | null
          category: Database["public"]["Enums"]["document_category"]
          checkout_timestamp?: string | null
          checkout_user_id?: string | null
          created_at?: string | null
          created_by: string
          current_version_id?: string | null
          custom_notification_days?: number[] | null
          description?: string | null
          expiry_date?: string | null
          file_name: string
          file_size: number
          file_type: string
          folder_id?: string | null
          id?: string
          is_locked?: boolean | null
          is_template?: boolean | null
          last_action?: string | null
          last_review_date?: string | null
          linked_item_id?: string | null
          linked_module?: string | null
          next_review_date?: string | null
          pending_since?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          tags?: string[] | null
          title: string
          updated_at?: string | null
          version?: number
          workflow_status?: string | null
        }
        Update: {
          approvers?: string[] | null
          category?: Database["public"]["Enums"]["document_category"]
          checkout_timestamp?: string | null
          checkout_user_id?: string | null
          created_at?: string | null
          created_by?: string
          current_version_id?: string | null
          custom_notification_days?: number[] | null
          description?: string | null
          expiry_date?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          folder_id?: string | null
          id?: string
          is_locked?: boolean | null
          is_template?: boolean | null
          last_action?: string | null
          last_review_date?: string | null
          linked_item_id?: string | null
          linked_module?: string | null
          next_review_date?: string | null
          pending_since?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          version?: number
          workflow_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_current_version_id_fkey"
            columns: ["current_version_id"]
            isOneToOne: false
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          address: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          location_data: Json | null
          name: string
          organization_id: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location_data?: Json | null
          name: string
          organization_id?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location_data?: Json | null
          name?: string
          organization_id?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facilities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_standards: {
        Row: {
          certification_date: string | null
          compliance_status: string | null
          created_at: string | null
          expiry_date: string | null
          facility_id: string | null
          id: string
          notes: string | null
          standard_id: string | null
          updated_at: string | null
        }
        Insert: {
          certification_date?: string | null
          compliance_status?: string | null
          created_at?: string | null
          expiry_date?: string | null
          facility_id?: string | null
          id?: string
          notes?: string | null
          standard_id?: string | null
          updated_at?: string | null
        }
        Update: {
          certification_date?: string | null
          compliance_status?: string | null
          created_at?: string | null
          expiry_date?: string | null
          facility_id?: string | null
          id?: string
          notes?: string | null
          standard_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facility_standards_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facility_standards_standard_id_fkey"
            columns: ["standard_id"]
            isOneToOne: false
            referencedRelation: "regulatory_standards"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          created_at: string | null
          created_by: string
          document_count: number | null
          id: string
          name: string
          parent_id: string | null
          path: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          document_count?: number | null
          id?: string
          name: string
          parent_id?: string | null
          path: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          document_count?: number | null
          id?: string
          name?: string
          parent_id?: string | null
          path?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      haccp_plans: {
        Row: {
          approved_by: string | null
          approved_date: string | null
          ccp_count: number | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          last_review_date: string | null
          next_review_date: string | null
          product_scope: string
          review_frequency: string | null
          status: string | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          approved_by?: string | null
          approved_date?: string | null
          ccp_count?: number | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          last_review_date?: string | null
          next_review_date?: string | null
          product_scope: string
          review_frequency?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          approved_by?: string | null
          approved_date?: string | null
          ccp_count?: number | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          last_review_date?: string | null
          next_review_date?: string | null
          product_scope?: string
          review_frequency?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      module_relationships: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          relationship_type: string
          source_id: string
          source_type: string
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          relationship_type: string
          source_id: string
          source_type: string
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          relationship_type?: string
          source_id?: string
          source_type?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      nc_activities: {
        Row: {
          action: string
          comments: string | null
          id: string
          new_status: Database["public"]["Enums"]["nc_status"] | null
          non_conformance_id: string
          performed_at: string | null
          performed_by: string
          previous_status: Database["public"]["Enums"]["nc_status"] | null
        }
        Insert: {
          action: string
          comments?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["nc_status"] | null
          non_conformance_id: string
          performed_at?: string | null
          performed_by: string
          previous_status?: Database["public"]["Enums"]["nc_status"] | null
        }
        Update: {
          action?: string
          comments?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["nc_status"] | null
          non_conformance_id?: string
          performed_at?: string | null
          performed_by?: string
          previous_status?: Database["public"]["Enums"]["nc_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "nc_activities_non_conformance_id_fkey"
            columns: ["non_conformance_id"]
            isOneToOne: false
            referencedRelation: "non_conformances"
            referencedColumns: ["id"]
          },
        ]
      }
      nc_attachments: {
        Row: {
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          non_conformance_id: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          non_conformance_id: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          non_conformance_id?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "nc_attachments_non_conformance_id_fkey"
            columns: ["non_conformance_id"]
            isOneToOne: false
            referencedRelation: "non_conformances"
            referencedColumns: ["id"]
          },
        ]
      }
      nc_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          non_conformance_id: string
          notification_type: string
          target_users: string[] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          non_conformance_id: string
          notification_type: string
          target_users?: string[] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          non_conformance_id?: string
          notification_type?: string
          target_users?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "nc_notifications_non_conformance_id_fkey"
            columns: ["non_conformance_id"]
            isOneToOne: false
            referencedRelation: "non_conformances"
            referencedColumns: ["id"]
          },
        ]
      }
      non_conformances: {
        Row: {
          assigned_to: string | null
          capa_id: string | null
          created_at: string | null
          created_by: string
          department: string | null
          description: string | null
          id: string
          item_category: Database["public"]["Enums"]["nc_item_category"]
          item_id: string | null
          item_name: string
          location: string | null
          priority: string | null
          quantity: number | null
          quantity_on_hold: number | null
          reason_category: Database["public"]["Enums"]["nc_reason_category"]
          reason_details: string | null
          reported_date: string
          resolution_date: string | null
          resolution_details: string | null
          review_date: string | null
          reviewer: string | null
          risk_level: string | null
          status: Database["public"]["Enums"]["nc_status"]
          tags: string[] | null
          title: string
          units: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          capa_id?: string | null
          created_at?: string | null
          created_by: string
          department?: string | null
          description?: string | null
          id?: string
          item_category: Database["public"]["Enums"]["nc_item_category"]
          item_id?: string | null
          item_name: string
          location?: string | null
          priority?: string | null
          quantity?: number | null
          quantity_on_hold?: number | null
          reason_category: Database["public"]["Enums"]["nc_reason_category"]
          reason_details?: string | null
          reported_date?: string
          resolution_date?: string | null
          resolution_details?: string | null
          review_date?: string | null
          reviewer?: string | null
          risk_level?: string | null
          status?: Database["public"]["Enums"]["nc_status"]
          tags?: string[] | null
          title: string
          units?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          capa_id?: string | null
          created_at?: string | null
          created_by?: string
          department?: string | null
          description?: string | null
          id?: string
          item_category?: Database["public"]["Enums"]["nc_item_category"]
          item_id?: string | null
          item_name?: string
          location?: string | null
          priority?: string | null
          quantity?: number | null
          quantity_on_hold?: number | null
          reason_category?: Database["public"]["Enums"]["nc_reason_category"]
          reason_details?: string | null
          reported_date?: string
          resolution_date?: string | null
          resolution_details?: string | null
          review_date?: string | null
          reviewer?: string | null
          risk_level?: string | null
          status?: Database["public"]["Enums"]["nc_status"]
          tags?: string[] | null
          title?: string
          units?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      onboarding_invites: {
        Row: {
          department_id: string | null
          email: string
          expires_at: string
          facility_id: string | null
          id: string
          invited_at: string | null
          invited_by: string
          organization_id: string | null
          role_id: string | null
          token: string
          used: boolean | null
        }
        Insert: {
          department_id?: string | null
          email: string
          expires_at: string
          facility_id?: string | null
          id?: string
          invited_at?: string | null
          invited_by: string
          organization_id?: string | null
          role_id?: string | null
          token: string
          used?: boolean | null
        }
        Update: {
          department_id?: string | null
          email?: string
          expires_at?: string
          facility_id?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string
          organization_id?: string | null
          role_id?: string | null
          token?: string
          used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_invites_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_invites_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_invites_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          state: string | null
          status: string | null
          updated_at: string | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          assigned_facility_ids: string[] | null
          avatar_url: string | null
          created_at: string | null
          department: string | null
          department_id: string | null
          full_name: string | null
          id: string
          organization_id: string | null
          preferences: Json | null
          preferred_language: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_facility_ids?: string[] | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          department_id?: string | null
          full_name?: string | null
          id: string
          organization_id?: string | null
          preferences?: Json | null
          preferred_language?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_facility_ids?: string[] | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          department_id?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          preferences?: Json | null
          preferred_language?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      regulatory_standards: {
        Row: {
          authority: string | null
          code: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          authority?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          authority?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          level: Database["public"]["Enums"]["role_level"]
          name: string
          permissions: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          level: Database["public"]["Enums"]["role_level"]
          name: string
          permissions?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          level?: Database["public"]["Enums"]["role_level"]
          name?: string
          permissions?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      standard_requirements: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          name: string
          standard: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          name: string
          standard: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          standard?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      supplier_approval_workflows: {
        Row: {
          approval_history: Json | null
          approvers: string[] | null
          completed_at: string | null
          created_at: string | null
          current_step: number
          due_date: string | null
          id: string
          initiated_at: string | null
          initiated_by: string
          notes: string | null
          status: string
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          approval_history?: Json | null
          approvers?: string[] | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number
          due_date?: string | null
          id?: string
          initiated_at?: string | null
          initiated_by: string
          notes?: string | null
          status: string
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          approval_history?: Json | null
          approvers?: string[] | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number
          due_date?: string | null
          id?: string
          initiated_at?: string | null
          initiated_by?: string
          notes?: string | null
          status?: string
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_approval_workflows_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_documents: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          file_name: string
          file_path: string | null
          file_size: number
          id: string
          name: string
          standard: string | null
          status: string
          supplier_id: string
          type: string
          updated_at: string | null
          upload_date: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          file_name: string
          file_path?: string | null
          file_size: number
          id?: string
          name: string
          standard?: string | null
          status: string
          supplier_id: string
          type: string
          updated_at?: string | null
          upload_date?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          file_name?: string
          file_path?: string | null
          file_size?: number
          id?: string
          name?: string
          standard?: string | null
          status?: string
          supplier_id?: string
          type?: string
          updated_at?: string | null
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_documents_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_risk_assessments: {
        Row: {
          assessed_by: string
          assessment_date: string | null
          created_at: string | null
          delivery_score: number | null
          food_safety_score: number | null
          id: string
          next_assessment_date: string | null
          notes: string | null
          overall_score: number
          quality_system_score: number | null
          regulatory_score: number | null
          risk_factors: Json | null
          risk_level: string
          supplier_id: string
          traceability_score: number | null
          updated_at: string | null
        }
        Insert: {
          assessed_by: string
          assessment_date?: string | null
          created_at?: string | null
          delivery_score?: number | null
          food_safety_score?: number | null
          id?: string
          next_assessment_date?: string | null
          notes?: string | null
          overall_score: number
          quality_system_score?: number | null
          regulatory_score?: number | null
          risk_factors?: Json | null
          risk_level: string
          supplier_id: string
          traceability_score?: number | null
          updated_at?: string | null
        }
        Update: {
          assessed_by?: string
          assessment_date?: string | null
          created_at?: string | null
          delivery_score?: number | null
          food_safety_score?: number | null
          id?: string
          next_assessment_date?: string | null
          notes?: string | null
          overall_score?: number
          quality_system_score?: number | null
          regulatory_score?: number | null
          risk_factors?: Json | null
          risk_level?: string
          supplier_id?: string
          traceability_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_risk_assessments_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_standards: {
        Row: {
          certification_number: string | null
          certified: boolean
          created_at: string | null
          expiry_date: string | null
          id: string
          level: string | null
          name: string
          scope: string | null
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          certification_number?: string | null
          certified?: boolean
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          level?: string | null
          name: string
          scope?: string | null
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          certification_number?: string | null
          certified?: boolean
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          level?: string | null
          name?: string
          scope?: string | null
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_standards_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          category: string
          compliance_status: string
          contact_email: string
          contact_name: string
          contact_phone: string
          country: string
          created_at: string | null
          id: string
          last_audit_date: string | null
          name: string
          products: string[] | null
          risk_score: number
          status: string
          updated_at: string | null
        }
        Insert: {
          category: string
          compliance_status?: string
          contact_email: string
          contact_name: string
          contact_phone: string
          country: string
          created_at?: string | null
          id?: string
          last_audit_date?: string | null
          name: string
          products?: string[] | null
          risk_score?: number
          status: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          compliance_status?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          country?: string
          created_at?: string | null
          id?: string
          last_audit_date?: string | null
          name?: string
          products?: string[] | null
          risk_score?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      training_courses: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string
          description: string | null
          duration_hours: number | null
          id: string
          is_active: boolean | null
          prerequisite_courses: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_active?: boolean | null
          prerequisite_courses?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_active?: boolean | null
          prerequisite_courses?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      training_plans: {
        Row: {
          automation_trigger: string | null
          courses: string[] | null
          created_at: string | null
          created_by: string
          description: string | null
          duration_days: number | null
          end_date: string | null
          id: string
          is_automated: boolean | null
          is_required: boolean | null
          name: string
          priority: string | null
          related_standards: string[] | null
          start_date: string | null
          status: string | null
          target_departments: string[] | null
          target_roles: string[] | null
          updated_at: string | null
        }
        Insert: {
          automation_trigger?: string | null
          courses?: string[] | null
          created_at?: string | null
          created_by: string
          description?: string | null
          duration_days?: number | null
          end_date?: string | null
          id?: string
          is_automated?: boolean | null
          is_required?: boolean | null
          name: string
          priority?: string | null
          related_standards?: string[] | null
          start_date?: string | null
          status?: string | null
          target_departments?: string[] | null
          target_roles?: string[] | null
          updated_at?: string | null
        }
        Update: {
          automation_trigger?: string | null
          courses?: string[] | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          duration_days?: number | null
          end_date?: string | null
          id?: string
          is_automated?: boolean | null
          is_required?: boolean | null
          name?: string
          priority?: string | null
          related_standards?: string[] | null
          start_date?: string | null
          status?: string | null
          target_departments?: string[] | null
          target_roles?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      training_records: {
        Row: {
          assigned_date: string | null
          completion_date: string | null
          due_date: string
          employee_id: string
          employee_name: string
          id: string
          last_recurrence: string | null
          next_recurrence: string | null
          notes: string | null
          pass_threshold: number | null
          score: number | null
          session_id: string
          status: Database["public"]["Enums"]["training_status"] | null
        }
        Insert: {
          assigned_date?: string | null
          completion_date?: string | null
          due_date: string
          employee_id: string
          employee_name: string
          id?: string
          last_recurrence?: string | null
          next_recurrence?: string | null
          notes?: string | null
          pass_threshold?: number | null
          score?: number | null
          session_id: string
          status?: Database["public"]["Enums"]["training_status"] | null
        }
        Update: {
          assigned_date?: string | null
          completion_date?: string | null
          due_date?: string
          employee_id?: string
          employee_name?: string
          id?: string
          last_recurrence?: string | null
          next_recurrence?: string | null
          notes?: string | null
          pass_threshold?: number | null
          score?: number | null
          session_id?: string
          status?: Database["public"]["Enums"]["training_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "training_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      training_sessions: {
        Row: {
          assigned_to: string[]
          completion_status:
            | Database["public"]["Enums"]["training_status"]
            | null
          created_at: string | null
          created_by: string
          department: string | null
          description: string | null
          due_date: string | null
          id: string
          is_recurring: boolean | null
          materials_id: string[] | null
          recurring_interval: number | null
          required_roles: string[] | null
          start_date: string | null
          title: string
          training_category: string | null
          training_type: string
          updated_at: string | null
        }
        Insert: {
          assigned_to: string[]
          completion_status?:
            | Database["public"]["Enums"]["training_status"]
            | null
          created_at?: string | null
          created_by: string
          department?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          materials_id?: string[] | null
          recurring_interval?: number | null
          required_roles?: string[] | null
          start_date?: string | null
          title: string
          training_category?: string | null
          training_type: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string[]
          completion_status?:
            | Database["public"]["Enums"]["training_status"]
            | null
          created_at?: string | null
          created_by?: string
          department?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          materials_id?: string[] | null
          recurring_interval?: number | null
          required_roles?: string[] | null
          start_date?: string | null
          title?: string
          training_category?: string | null
          training_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          department_id: string | null
          facility_id: string | null
          id: string
          organization_id: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          department_id?: string | null
          facility_id?: string | null
          id?: string
          organization_id?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          department_id?: string | null
          facility_id?: string | null
          id?: string
          organization_id?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_facilities: {
        Args: {
          p_organization_id?: string
          p_only_assigned?: boolean
        }
        Returns: {
          address: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          location_data: Json | null
          name: string
          organization_id: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          zipcode: string | null
        }[]
      }
      get_facility_standards: {
        Args: {
          p_facility_id: string
        }
        Returns: {
          id: string
          facility_id: string
          standard_id: string
          compliance_status: string
          certification_date: string
          expiry_date: string
          notes: string
          created_at: string
          updated_at: string
          standard_name: string
          standard_code: string
          standard_description: string
          standard_version: string
          standard_authority: string
        }[]
      }
      get_organizations: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          state: string | null
          status: string | null
          updated_at: string | null
          zipcode: string | null
        }[]
      }
      get_regulatory_standards: {
        Args: Record<PropertyKey, never>
        Returns: {
          authority: string | null
          code: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
          version: string | null
        }[]
      }
      get_related_items: {
        Args: {
          p_source_id: string
          p_source_type: string
          p_target_type: string
        }
        Returns: {
          target_id: string
          relationship_type: string
          created_at: string
          created_by: string
        }[]
      }
      get_user_roles: {
        Args: {
          _user_id: string
        }
        Returns: {
          role_id: string
          role_name: string
          role_level: Database["public"]["Enums"]["role_level"]
          permissions: Json
          organization_id: string
          organization_name: string
          facility_id: string
          facility_name: string
          department_id: string
          department_name: string
        }[]
      }
      has_permission: {
        Args: {
          _user_id: string
          _permission: string
          _org_id?: string
          _facility_id?: string
          _department_id?: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role_name: string
          _org_id?: string
          _facility_id?: string
          _department_id?: string
        }
        Returns: boolean
      }
      supabase_realtime: {
        Args: {
          table_name: string
          action: string
        }
        Returns: undefined
      }
      update_nc_status: {
        Args: {
          nc_id: string
          new_status: string
          user_id: string
          comment?: string
          prev_status?: string
        }
        Returns: Json
      }
    }
    Enums: {
      audit_status:
        | "Scheduled"
        | "In Progress"
        | "Completed"
        | "Cancelled"
        | "Overdue"
      capa_effectiveness_rating:
        | "Effective"
        | "Partially Effective"
        | "Not Effective"
      capa_priority: "critical" | "high" | "medium" | "low"
      capa_source:
        | "audit"
        | "haccp"
        | "supplier"
        | "complaint"
        | "traceability"
        | "nonconformance"
      capa_status:
        | "Open"
        | "In Progress"
        | "Pending Verification"
        | "Closed"
        | "Overdue"
      complaint_category:
        | "Product Quality"
        | "Foreign Material"
        | "Packaging"
        | "Labeling"
        | "Customer Service"
        | "Other"
      complaint_status:
        | "New"
        | "Under Investigation"
        | "Resolved"
        | "Closed"
        | "Escalated"
      document_category:
        | "SOP"
        | "Policy"
        | "Form"
        | "Certificate"
        | "Audit Report"
        | "HACCP Plan"
        | "Training Material"
        | "Supplier Documentation"
        | "Risk Assessment"
        | "Other"
      document_status:
        | "Draft"
        | "Pending Approval"
        | "Approved"
        | "Published"
        | "Archived"
        | "Expired"
      finding_severity: "Critical" | "Major" | "Minor" | "Observation"
      finding_status: "Open" | "In Progress" | "Closed" | "Verified"
      nc_item_category:
        | "Processing Equipment"
        | "Product Storage Tanks"
        | "Finished Products"
        | "Raw Products"
        | "Packaging Materials"
        | "Other"
      nc_reason_category:
        | "Contamination"
        | "Quality Issues"
        | "Regulatory Non-Compliance"
        | "Equipment Malfunction"
        | "Documentation Error"
        | "Process Deviation"
        | "Other"
      nc_status:
        | "On Hold"
        | "Under Review"
        | "Released"
        | "Disposed"
        | "Approved"
        | "Rejected"
        | "Resolved"
        | "Closed"
      role_level: "organization" | "facility" | "department"
      training_status:
        | "Not Started"
        | "In Progress"
        | "Completed"
        | "Overdue"
        | "Cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
