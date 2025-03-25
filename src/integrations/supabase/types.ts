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
          description: string
          due_date: string
          effectiveness_criteria: string | null
          effectiveness_verified: boolean | null
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
        }
        Insert: {
          assigned_to: string
          completion_date?: string | null
          corrective_action?: string | null
          created_at?: string | null
          created_by: string
          description: string
          due_date: string
          effectiveness_criteria?: string | null
          effectiveness_verified?: boolean | null
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
        }
        Update: {
          assigned_to?: string
          completion_date?: string | null
          corrective_action?: string | null
          created_at?: string | null
          created_by?: string
          description?: string
          due_date?: string
          effectiveness_criteria?: string | null
          effectiveness_verified?: boolean | null
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
        }
        Relationships: []
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
      document_versions: {
        Row: {
          change_notes: string | null
          created_at: string | null
          created_by: string
          document_id: string
          file_name: string
          file_size: number
          id: string
          version: number
        }
        Insert: {
          change_notes?: string | null
          created_at?: string | null
          created_by: string
          document_id: string
          file_name: string
          file_size: number
          id?: string
          version: number
        }
        Update: {
          change_notes?: string | null
          created_at?: string | null
          created_by?: string
          document_id?: string
          file_name?: string
          file_size?: number
          id?: string
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
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          full_name: string | null
          id: string
          preferences: Json | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          full_name?: string | null
          id: string
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          full_name?: string | null
          id?: string
          preferences?: Json | null
          role?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      audit_status:
        | "Scheduled"
        | "In Progress"
        | "Completed"
        | "Cancelled"
        | "Overdue"
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
      nc_status: "On Hold" | "Under Review" | "Released" | "Disposed"
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
