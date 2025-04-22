
/**
 * Facility interface
 */
export interface Facility {
  id: string;
  name: string;
  description?: string;
  address?: string;
  organization_id?: string;
  contact_email?: string;
  contact_phone?: string;
  status: string;
  location_data?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
}
