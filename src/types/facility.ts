
export interface Facility {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  facility_type?: string | null;
  organization_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
  contact_email?: string | null;
  contact_phone?: string | null;
  location_data?: Record<string, any> | null;
}
