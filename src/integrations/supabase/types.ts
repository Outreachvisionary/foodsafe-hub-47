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
      document_activities: {
        Row: {
          action: string
          comments: string | null
          document_id: string | null
          id: string
          timestamp: string
          user_id: string
          user_name: string
          user_role: string
        }
        Insert: {
          action: string
          comments?: string | null
          document_id?: string | null
          id?: string
          timestamp?: string
          user_id: string
          user_name: string
          user_role: string
        }
        Update: {
          action?: string
          comments?: string | null
          document_id?: string | null
          id?: string
          timestamp?: string
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
      document_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_notifications: {
        Row: {
          created_at: string
          document_id: string | null
          document_title: string
          id: string
          is_read: boolean
          message: string
          target_user_ids: string[] | null
          type: string
        }
        Insert: {
          created_at?: string
          document_id?: string | null
          document_title: string
          id?: string
          is_read?: boolean
          message: string
          target_user_ids?: string[] | null
          type: string
        }
        Update: {
          created_at?: string
          document_id?: string | null
          document_title?: string
          id?: string
          is_read?: boolean
          message?: string
          target_user_ids?: string[] | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_notifications_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          change_notes: string | null
          created_at: string
          created_by: string
          document_id: string | null
          file_name: string
          file_size: number
          id: string
          version: number
        }
        Insert: {
          change_notes?: string | null
          created_at?: string
          created_by: string
          document_id?: string | null
          file_name: string
          file_size: number
          id?: string
          version: number
        }
        Update: {
          change_notes?: string | null
          created_at?: string
          created_by?: string
          document_id?: string | null
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
      documents: {
        Row: {
          approvers: string[] | null
          category_id: string | null
          created_at: string
          created_by: string
          description: string | null
          expiry_date: string | null
          file_name: string
          file_size: number
          file_type: string
          folder_id: string | null
          id: string
          is_locked: boolean | null
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
          updated_at: string
          version: number
        }
        Insert: {
          approvers?: string[] | null
          category_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          expiry_date?: string | null
          file_name: string
          file_size: number
          file_type: string
          folder_id?: string | null
          id?: string
          is_locked?: boolean | null
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
          updated_at?: string
          version?: number
        }
        Update: {
          approvers?: string[] | null
          category_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          expiry_date?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          folder_id?: string | null
          id?: string
          is_locked?: boolean | null
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
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
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
          created_at: string
          created_by: string
          document_count: number
          id: string
          name: string
          parent_id: string | null
          path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          document_count?: number
          id?: string
          name: string
          parent_id?: string | null
          path?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          document_count?: number
          id?: string
          name?: string
          parent_id?: string | null
          path?: string
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_category_id: {
        Args: {
          category_name: string
        }
        Returns: string
      }
      get_folder_id: {
        Args: {
          folder_name: string
        }
        Returns: string
      }
    }
    Enums: {
      document_status:
        | "Draft"
        | "Pending Approval"
        | "Approved"
        | "Published"
        | "Archived"
        | "Expired"
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
