
export interface Organization {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  status: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
}

export interface CreateFacilityInput {
  name: string;
  description?: string;
  address?: string;
  organization_id: string;
  contact_email?: string;
  contact_phone?: string;
  status?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  facility_type?: string;
  location_data?: Record<string, any>;
}
