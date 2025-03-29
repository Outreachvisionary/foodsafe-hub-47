
export interface Role {
  id: string;
  name: string;
  description?: string;
  level?: "organization" | "facility" | "department";
  permissions?: Record<string, boolean>;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}
