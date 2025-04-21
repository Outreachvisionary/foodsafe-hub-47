
export interface Facility {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  status: 'active' | 'inactive' | 'pending';
  organization_id: string;
  contact_email?: string;
  contact_phone?: string;
  location_data?: {
    countryCode?: string;
    stateCode?: string;
    [key: string]: any;
  };
  created_at?: string;
  updated_at?: string;
  facility_type?: string;
}

// This is the interface used for components
export interface FacilityProps {
  id: string;
  name: string;
  description?: string;
  location?: string;
  status: 'active' | 'inactive' | 'pending';
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  organizationId?: string;
  facility_type?: string;
}
