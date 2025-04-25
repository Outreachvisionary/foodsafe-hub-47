
// Add this at the bottom of the file to ensure status is required
export interface Facility {
  id: string;
  name: string;
  description?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  organization_id?: string;
  location_data?: any;
  created_at?: string;
  updated_at?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  facility_type?: string;
  status: string; // Make sure status is required
}
