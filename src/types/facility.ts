
export interface Facility {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  contact_email?: string;
  contact_phone?: string;
  organization_id?: string;
  location_data?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  status: string; // Made required to match the expected type
  facility_type?: string; // Add facility_type but make it optional
}
