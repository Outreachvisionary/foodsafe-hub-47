
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

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  role_name?: string;
  permissions?: Record<string, boolean>;
  organization_id?: string;
  facility_id?: string;
  department_id?: string;
  assigned_by?: string;
  created_at?: string;
}
