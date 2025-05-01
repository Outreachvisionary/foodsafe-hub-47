
export interface Facility {
  id: string;
  name: string;
  organization_id: string;
  status: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  zipcode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  primary_contact?: string;
  description?: string;
  type?: string;
  facility_type?: string;
  created_at?: string;
  updated_at?: string;
  capacity?: number;
  contact_email?: string;
  contact_phone?: string;
  location_coordinates?: {
    latitude: number;
    longitude: number;
  };
  certifications?: string[];
}

export interface FacilityFormProps {
  onSubmit: (data: Partial<Facility>) => void;
  initialData?: Partial<Facility>;
  isLoading?: boolean;
  defaultValues?: Partial<Facility>;
  onSubmitSuccess?: (facility: Facility) => void;
  isNewFacility?: boolean;
  onCancel?: () => void;
}
