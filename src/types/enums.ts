
// Document Status Enum
export enum DocumentStatus {
  Draft = 'Draft',
  Pending_Approval = 'Pending_Approval',
  Approved = 'Approved',
  Published = 'Published',
  Archived = 'Archived',
  Expired = 'Expired',
  Active = 'Active',
  In_Review = 'In_Review',
  Pending_Review = 'Pending_Review',
  Rejected = 'Rejected',
  Obsolete = 'Obsolete'
}

// Document Category Enum
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

// Checkout Status Enum
export enum CheckoutStatus {
  Available = 'Available',
  Checked_Out = 'Checked_Out'
}

// CAPA Priority Enum
export enum CAPAPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

// CAPA Source Enum
export enum CAPASource {
  Audit = 'Audit',
  Customer_Complaint = 'Customer_Complaint',
  Internal_Review = 'Internal_Review',
  Non_Conformance = 'Non_Conformance',
  Management_Review = 'Management_Review',
  Other = 'Other'
}

// CAPA Effectiveness Rating Enum
export enum CAPAEffectivenessRating {
  Effective = 'Effective',
  Partially_Effective = 'Partially_Effective',
  Ineffective = 'Ineffective',
  Under_Review = 'Under_Review'
}
