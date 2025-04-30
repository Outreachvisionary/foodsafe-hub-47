
export interface Facility {
  id: string;
  name: string;
  description?: string;
  organization_id?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  contact_email?: string;
  contact_phone?: string;
  location_data?: any;
  created_at?: string;
  updated_at?: string;
  status: string;
  facility_type?: string;
}

export interface FacilityFilter {
  status?: string;
  country?: string;
  search?: string;
}
