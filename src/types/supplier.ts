
export interface Supplier {
  id: string;
  name: string;
  category: string;
  country: string;
  riskScore: number;
  complianceStatus: string;
  lastAuditDate: string;
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
  certificationNumber?: string;
  expiryDate?: string;
  level?: string; // For SQF levels
  scope?: string;
}

export interface SupplierDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Pending Review';
  fileName: string;
  standard?: 'SQF' | 'BRC GS2' | 'ISO 22000' | 'FSSC 22000' | 'HACCP';
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
