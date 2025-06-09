
// Document related enums
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

export enum DocumentStatus {
  Draft = 'Draft',
  Pending_Approval = 'Pending Approval',
  PendingReview = 'Pending Review',
  Approved = 'Approved',
  Published = 'Published',
  Active = 'Published', // Alias for Published
  Archived = 'Archived',
  Expired = 'Expired',
  Rejected = 'Rejected'
}

export enum CheckoutStatus {
  Available = 'Available',
  Checked_Out = 'Checked_Out',
  Locked = 'Locked'
}

// CAPA related enums
export enum CAPAStatus {
  Open = 'Open',
  In_Progress = 'In Progress',
  Under_Review = 'Under Review',
  Approved = 'Approved',
  Closed = 'Closed',
  Cancelled = 'Cancelled'
}

export enum CAPAPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum CAPASource {
  Internal_Audit = 'Internal Audit',
  External_Audit = 'External Audit',
  Customer_Complaint = 'Customer Complaint',
  Non_Conformance = 'Non Conformance',
  Management_Review = 'Management Review',
  Other = 'Other'
}

export enum CAPAEffectivenessRating {
  Not_Assessed = 'Not Assessed',
  Ineffective = 'Ineffective',
  Partially_Effective = 'Partially Effective',
  Effective = 'Effective'
}

// Training related enums
export enum TrainingStatus {
  Not_Started = 'Not Started',
  In_Progress = 'In Progress',
  Completed = 'Completed',
  Expired = 'Expired',
  Failed = 'Failed'
}

// Non-conformance related enums
export enum NCStatus {
  Open = 'Open',
  Under_Investigation = 'Under Investigation',
  Under_Review = 'Under Review',
  Resolved = 'Resolved',
  Closed = 'Closed'
}
