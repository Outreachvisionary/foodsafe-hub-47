
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
}
