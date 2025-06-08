
// Document related enums
export enum DocumentStatus {
  Draft = 'Draft',
  Under_Review = 'Under_Review',
  Approved = 'Approved',
  Published = 'Published',
  Archived = 'Archived',
  Rejected = 'Rejected'
}

export enum DocumentCategory {
  SOP = 'SOP',
  Policy = 'Policy',
  Form = 'Form',
  Manual = 'Manual',
  Training = 'Training',
  HACCP_Plan = 'HACCP_Plan',
  Certificate = 'Certificate',
  Report = 'Report',
  Other = 'Other'
}

export enum CheckoutStatus {
  Available = 'Available',
  Checked_Out = 'Checked_Out',
  Locked = 'Locked'
}

// CAPA related enums
export enum CAPAStatus {
  Open = 'Open',
  In_Progress = 'In_Progress',
  Pending_Verification = 'Pending_Verification',
  Closed = 'Closed',
  Cancelled = 'Cancelled'
}

export enum CAPASource {
  Audit = 'Audit',
  Customer_Complaint = 'Customer_Complaint',
  Internal_Report = 'Internal_Report',
  Non_Conformance = 'Non_Conformance',
  Supplier_Issue = 'Supplier_Issue'
}

export enum CAPAPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum EffectivenessRating {
  Ineffective = 'Ineffective',
  Partially_Effective = 'Partially_Effective',
  Effective = 'Effective'
}

// Non-conformance related enums
export enum NCStatus {
  On_Hold = 'On_Hold',
  Under_Review = 'Under_Review',
  Released = 'Released',
  Disposed = 'Disposed',
  Resolved = 'Resolved'
}

export enum NCItemCategory {
  Raw_Material = 'Raw_Material',
  Finished_Product = 'Finished_Product',
  Packaging = 'Packaging',
  Equipment = 'Equipment',
  Process = 'Process',
  Documentation = 'Documentation',
  Other = 'Other'
}

export enum NCReasonCategory {
  Quality_Defect = 'Quality_Defect',
  Safety_Issue = 'Safety_Issue',
  Regulatory_Non_Compliance = 'Regulatory_Non_Compliance',
  Process_Deviation = 'Process_Deviation',
  Equipment_Failure = 'Equipment_Failure',
  Documentation_Error = 'Documentation_Error',
  Training_Gap = 'Training_Gap',
  Supplier_Issue = 'Supplier_Issue',
  Other = 'Other'
}

// Complaint related enums
export enum ComplaintCategory {
  Product_Quality = 'Product_Quality',
  Food_Safety = 'Food_Safety',
  Service = 'Service',
  Delivery = 'Delivery',
  Packaging = 'Packaging',
  Labeling = 'Labeling',
  Other = 'Other'
}

export enum ComplaintStatus {
  New = 'New',
  Under_Investigation = 'Under_Investigation',
  Resolved = 'Resolved',
  Closed = 'Closed'
}

// Training related enums
export enum TrainingStatus {
  Not_Started = 'Not_Started',
  In_Progress = 'In_Progress',
  Completed = 'Completed',
  Failed = 'Failed',
  Expired = 'Expired'
}

// Audit related enums
export enum AuditStatus {
  Scheduled = 'Scheduled',
  In_Progress = 'In_Progress',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum FindingSeverity {
  Critical = 'Critical',
  Major = 'Major',
  Minor = 'Minor',
  Observation = 'Observation'
}

export enum FindingStatus {
  Open = 'Open',
  In_Progress = 'In_Progress',
  Closed = 'Closed'
}

// Recall related enums
export enum RecallType {
  Mock = 'Mock',
  Actual = 'Actual'
}

export enum NotificationStatus {
  Pending = 'Pending',
  Sent = 'Sent',
  Failed = 'Failed'
}

// Role related enums
export enum RoleLevel {
  Organization = 'Organization',
  Facility = 'Facility',
  Department = 'Department'
}
