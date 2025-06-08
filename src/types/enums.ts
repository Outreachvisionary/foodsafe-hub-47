
// CAPA Status Enum
export enum CAPAStatus {
  Open = 'Open',
  In_Progress = 'In Progress', 
  Under_Review = 'Under Review',
  Pending_Verification = 'Pending Verification',
  Closed = 'Closed',
  Cancelled = 'Cancelled'
}

// CAPA Source Enum
export enum CAPASource {
  Audit = 'Audit',
  Customer_Complaint = 'Customer Complaint',
  Non_Conformance = 'Non Conformance',
  Internal_Review = 'Internal Review',
  Internal_Report = 'Internal Report',
  Management_Review = 'Management Review',
  Complaint = 'Complaint',
  Supplier_Issue = 'Supplier Issue',
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
  Ineffective = 'Not Effective',
  Pending = 'Pending'
}

// NC Status Enum
export enum NCStatus {
  On_Hold = 'On Hold',
  Under_Review = 'Under Review',
  Released = 'Released',
  Disposed = 'Disposed',
  Resolved = 'Resolved',
  Closed = 'Closed'
}

// Document Status Enum
export enum DocumentStatus {
  Draft = 'Draft',
  Pending_Approval = 'Pending Approval',
  PendingApproval = 'Pending Approval',
  PendingReview = 'Pending Review',
  Approved = 'Approved',
  Published = 'Published',
  Active = 'Published',
  Archived = 'Archived',
  Expired = 'Expired',
  Rejected = 'Rejected'
}

// Checkout Status Enum
export enum CheckoutStatus {
  Available = 'Available',
  Checked_Out = 'Checked Out',
  CheckedOut = 'Checked Out',
  Locked = 'Locked'
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
  Overdue = 'Overdue',
  Cancelled = 'Cancelled'
}

// Training Type Enum
export enum TrainingType {
  Onboarding = 'Onboarding',
  Compliance = 'Compliance',
  Technical = 'Technical',
  Safety = 'Safety',
  Quality = 'Quality',
  Management = 'Management',
  Other = 'Other'
}

// Training Category Enum
export enum TrainingCategory {
  FoodSafety = 'Food Safety',
  HACCP = 'HACCP',
  SQF = 'SQF',
  GMP = 'GMP',
  Sanitation = 'Sanitation',
  Allergen = 'Allergen',
  RegulatoryCompliance = 'Regulatory Compliance',
  EquipmentOperation = 'Equipment Operation',
  Other = 'Other'
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
  Product_Quality = 'Product Quality',
  Food_Safety = 'Food Safety',
  Foreign_Material = 'Foreign Material',
  Packaging = 'Packaging',
  Delivery = 'Delivery',
  Service = 'Service',
  Labeling = 'Labeling',
  Other = 'Other'
}

// Complaint Priority Enum
export enum ComplaintPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}
