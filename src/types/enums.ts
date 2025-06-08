
// Document related enums matching database schema
export enum DocumentStatus {
  Draft = 'Draft',
  Under_Review = 'Under Review',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Active = 'Active',
  Archived = 'Archived',
  Expired = 'Expired'
}

export enum DocumentCategory {
  SOP = 'SOP',
  Policy = 'Policy',
  Form = 'Form',
  Certificate = 'Certificate',
  Audit_Report = 'Audit Report',
  HACCP_Plan = 'HACCP Plan',
  Training_Material = 'Training Material',
  Supplier_Documentation = 'Supplier Documentation',
  Risk_Assessment = 'Risk Assessment',
  Other = 'Other'
}

export enum CheckoutStatus {
  Available = 'Available',
  Checked_Out = 'Checked_Out'
}

// CAPA related enums matching database schema
export enum CAPAStatus {
  Open = 'Open',
  In_Progress = 'In Progress',
  Pending_Verification = 'Pending Verification',
  Closed = 'Closed',
  Cancelled = 'Cancelled'
}

export enum CAPASource {
  Audit = 'Audit',
  Non_Conformance = 'Non Conformance',
  Complaint = 'Complaint',
  Management_Review = 'Management Review',
  Risk_Assessment = 'Risk Assessment',
  Other = 'Other'
}

export enum CAPAPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum EffectivenessRating {
  Effective = 'Effective',
  Partially_Effective = 'Partially Effective',
  Ineffective = 'Ineffective',
  Under_Review = 'Under Review'
}

// Complaint related enums
export enum ComplaintCategory {
  Product_Quality = 'Product Quality',
  Packaging = 'Packaging',
  Labeling = 'Labeling',
  Foreign_Material = 'Foreign Material',
  Contamination = 'Contamination',
  Allergen = 'Allergen',
  Service = 'Service',
  Delivery = 'Delivery',
  Other = 'Other'
}

export enum ComplaintStatus {
  New = 'New',
  Under_Investigation = 'Under Investigation',
  In_Progress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed'
}

// Non-conformance related enums
export enum NCStatus {
  On_Hold = 'On Hold',
  Under_Review = 'Under Review',
  Released = 'Released',
  Disposed = 'Disposed',
  Resolved = 'Resolved',
  Closed = 'Closed'
}

export enum NCItemCategory {
  Raw_Material = 'Raw Material',
  Finished_Product = 'Finished Product',
  Packaging = 'Packaging',
  Equipment = 'Equipment',
  Process = 'Process',
  Documentation = 'Documentation',
  Other = 'Other'
}

export enum NCReasonCategory {
  Quality_Defect = 'Quality Defect',
  Contamination = 'Contamination',
  Foreign_Material = 'Foreign Material',
  Labeling_Error = 'Labeling Error',
  Temperature_Abuse = 'Temperature Abuse',
  Expired_Product = 'Expired Product',
  Specification_Deviation = 'Specification Deviation',
  Equipment_Failure = 'Equipment Failure',
  Process_Deviation = 'Process Deviation',
  Documentation_Error = 'Documentation Error',
  Other = 'Other'
}

// Training related enums
export enum TrainingStatus {
  Not_Started = 'Not Started',
  In_Progress = 'In Progress',
  Completed = 'Completed',
  Overdue = 'Overdue',
  Expired = 'Expired'
}

// Audit related enums
export enum AuditStatus {
  Scheduled = 'Scheduled',
  In_Progress = 'In Progress',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum FindingSeverity {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum FindingStatus {
  Open = 'Open',
  In_Progress = 'In Progress',
  Closed = 'Closed'
}

// Notification related enums
export enum NotificationStatus {
  Pending = 'Pending',
  Sent = 'Sent',
  Failed = 'Failed'
}

// Recall related enums
export enum RecallType {
  Simulation = 'Simulation',
  Actual = 'Actual'
}

// Role related enums
export enum RoleLevel {
  Global = 'Global',
  Organization = 'Organization',
  Facility = 'Facility',
  Department = 'Department'
}
