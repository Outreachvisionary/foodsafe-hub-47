
// CAPA Status Enum
export enum CAPAStatus {
  Open = 'Open',
  In_Progress = 'In Progress', 
  Under_Review = 'Under Review',
  Closed = 'Closed',
  Cancelled = 'Cancelled'
}

// CAPA Source Enum
export enum CAPASource {
  Audit = 'Audit',
  Customer_Complaint = 'Customer Complaint',
  Non_Conformance = 'Non Conformance',
  Internal_Review = 'Internal Review',
  Management_Review = 'Management Review',
  Other = 'Other'
}

// CAPA Priority Enum
export enum CAPAPriority {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

// Effectiveness Rating Enum
export enum EffectivenessRating {
  Effective = 'Effective',
  Partially_Effective = 'Partially Effective',
  Not_Effective = 'Not Effective',
  Pending = 'Pending'
}

// NC Status Enum
export enum NCStatus {
  On_Hold = 'On Hold',
  Under_Review = 'Under Review',
  Resolved = 'Resolved',
  Closed = 'Closed'
}

// Document Status Enum
export enum DocumentStatus {
  Draft = 'Draft',
  Pending_Approval = 'Pending Approval',
  Approved = 'Approved',
  Published = 'Published',
  Archived = 'Archived',
  Expired = 'Expired'
}

// Checkout Status Enum
export enum CheckoutStatus {
  Available = 'Available',
  Checked_Out = 'Checked_Out'
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

// Training Status Enum
export enum TrainingStatus {
  Not_Started = 'Not Started',
  In_Progress = 'In Progress',
  Completed = 'Completed',
  Overdue = 'Overdue'
}

// Complaint Status Enum
export enum ComplaintStatus {
  New = 'New',
  Under_Investigation = 'Under Investigation',
  Resolved = 'Resolved',
  Closed = 'Closed'
}

// Complaint Category Enum
export enum ComplaintCategory {
  Product_Quality = 'Product_Quality',
  Food_Safety = 'Food_Safety',
  Foreign_Material = 'Foreign_Material',
  Packaging = 'Packaging',
  Delivery = 'Delivery',
  Service = 'Service',
  Other = 'Other'
}
