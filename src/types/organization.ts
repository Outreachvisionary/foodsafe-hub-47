
export interface Organization {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  contact_email?: string;
  contact_phone?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at?: string;
  updated_at?: string;
  logo_url?: string;
  industry_type?: string;
  registration_number?: string;
  tax_id?: string;
  website?: string;
}

export interface OrganizationInput {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  contact_email?: string;
  contact_phone?: string;
  status?: 'active' | 'inactive' | 'pending';
  industry_type?: string;
  registration_number?: string;
  tax_id?: string;
  website?: string;
}
