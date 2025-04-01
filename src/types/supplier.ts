
export interface Supplier {
  id: string;
  name: string;
  category: string;
  country: string;
  riskScore: number;
  complianceStatus: string;
  lastAuditDate: string | null;
  fsmsStandards: FsmsStandard[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  products: string[];
  status: 'Active' | 'Pending' | 'Suspended' | 'Inactive';
  documents: SupplierDocument[];
  monitoringData?: MonitoringData;
}

export interface FsmsStandard {
  name: 'SQF' | 'BRC GS2' | 'ISO 22000' | 'FSSC 22000' | 'HACCP';
  certified: boolean;
  certificationNumber?: string | null;
  expiryDate?: string | null;
  level?: string | null;
  scope?: string | null;
}

export interface SupplierDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  expiryDate: string | null;
  status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Pending Review';
  fileName: string;
  supplier: string; // Either supplier ID or name depending on context
  standard?: StandardName;
}

export interface MonitoringData {
  deviceId: string;
  temperature: number;
  humidity: number;
  timestamp: string;
  status: 'Normal' | 'Warning' | 'Critical';
  locationName: string;
}

export type StandardName = 'SQF' | 'BRC GS2' | 'ISO 22000' | 'FSSC 22000' | 'HACCP' | 'all';

export interface StandardRequirement {
  standard: StandardName;
  name: string;
  description: string;
  category: string;
}
