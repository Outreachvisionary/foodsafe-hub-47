
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
  status: string; // Required field
  facility_type?: string;
}

export interface FacilityFormProps {
  onSubmit?: (data: Partial<Facility>) => void;
  initialData?: Partial<Facility>;
  isLoading?: boolean;
  defaultValues?: Partial<Facility>; // Added to match usage in CreateFacilityDialog
  onSubmitSuccess?: (facility: Facility) => void;
  isNewFacility?: boolean;
  onCancel?: () => void;
}
