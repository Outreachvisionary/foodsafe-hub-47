
export interface Facility {
  id: string;
  name: string;
  organization_id: string;
  status: string; // Make status required
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  primary_contact?: string;
  description?: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
  capacity?: number;
  location_coordinates?: {
    latitude: number;
    longitude: number;
  };
  certifications?: string[];
}

export interface FacilityFormProps {
  defaultValues?: Partial<Facility>; // Add defaultValues property
  onSubmitSuccess: (facility: Facility) => void;
  isNewFacility: boolean;
  onCancel: () => void;
}
