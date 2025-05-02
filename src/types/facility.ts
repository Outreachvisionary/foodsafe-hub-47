
export interface Facility {
  id: string;
  organization_id: string; // Making this required
  name: string;
  description?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  location_data?: Record<string, any>;
  facility_type?: string;
}

export interface FacilityStats {
  totalFacilities: number;
  activeFacilities: number;
  countryCounts: Record<string, number>;
  standardsCompliance: {
    compliant: number;
    pending: number;
    nonCompliant: number;
  };
  auditStats: {
    completed: number;
    scheduled: number;
    overdue: number;
  };
}

export interface FacilityFormProps {
  onSubmit: (data: Partial<Facility>) => void;
  initialData?: Partial<Facility>;
  isLoading?: boolean;
  isNewFacility?: boolean;
  onCancel?: () => void;
  onSubmitSuccess?: (facility: Facility) => void;
  defaultValues?: Partial<Facility>;
}
