
// Document Status Enum
export enum DocumentStatus {
  Draft = 'Draft',
  Pending_Approval = 'Pending_Approval',
  Pending_Review = 'Pending_Review',
  Approved = 'Approved',
  Published = 'Published',
  Archived = 'Archived',
  Expired = 'Expired',
  Active = 'Active',
  In_Review = 'In_Review',
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
  Checked_Out = 'Checked_Out',
  Locked = 'Locked'
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
  Internal_Report = 'Internal_Report',
  Non_Conformance = 'Non_Conformance',
  Management_Review = 'Management_Review',
  Complaint = 'Complaint',
  Supplier_Issue = 'Supplier_Issue',
  Other = 'Other'
}

// CAPA Status Enum
export enum CAPAStatus {
  Open = 'Open',
  In_Progress = 'In_Progress',
  Under_Review = 'Under_Review',
  Pending_Review = 'Pending_Review',
  Pending_Verification = 'Pending_Verification',
  Completed = 'Completed',
  Closed = 'Closed',
  Cancelled = 'Cancelled'
}

// CAPA Effectiveness Rating Enum
export enum CAPAEffectivenessRating {
  Effective = 'Effective',
  Partially_Effective = 'Partially_Effective',
  Ineffective = 'Ineffective',
  Not_Effective = 'Not_Effective',
  Under_Review = 'Under_Review',
  Pending = 'Pending'
}

// Alias for backward compatibility
export const EffectivenessRating = CAPAEffectivenessRating;

// Non-Conformance Status Enum
export enum NCStatus {
  Open = 'Open',
  On_Hold = 'On_Hold',
  Under_Investigation = 'Under_Investigation',
  Under_Review = 'Under_Review',
  Pending_Review = 'Pending_Review',
  In_Progress = 'In_Progress',
  Released = 'Released',
  Disposed = 'Disposed',
  Resolved = 'Resolved',
  Closed = 'Closed',
  Cancelled = 'Cancelled'
}

// Non-Conformance Item Category Enum
export enum NCItemCategory {
  Raw_Material = 'Raw_Material',
  Finished_Product = 'Finished_Product',
  Packaging = 'Packaging',
  Equipment = 'Equipment',
  Process = 'Process',
  Documentation = 'Documentation',
  Personnel = 'Personnel',
  Environment = 'Environment',
  Other = 'Other'
}

// Non-Conformance Reason Category Enum
export enum NCReasonCategory {
  Quality_Defect = 'Quality_Defect',
  Specification_Deviation = 'Specification_Deviation',
  Contamination = 'Contamination',
  Labeling_Error = 'Labeling_Error',
  Packaging_Defect = 'Packaging_Defect',
  Process_Failure = 'Process_Failure',
  Equipment_Malfunction = 'Equipment_Malfunction',
  Human_Error = 'Human_Error',
  Documentation_Error = 'Documentation_Error',
  Supplier_Issue = 'Supplier_Issue',
  Other = 'Other'
}

// Complaint Status Enum
export enum ComplaintStatus {
  New = 'New',
  Under_Investigation = 'Under_Investigation',
  Pending_Response = 'Pending_Response',
  Resolved = 'Resolved',
  Closed = 'Closed',
  Escalated = 'Escalated'
}

// Complaint Category Enum
export enum ComplaintCategory {
  Product_Quality = 'Product_Quality',
  Food_Safety = 'Food_Safety',
  Service_Issue = 'Service_Issue',
  Service = 'Service',
  Delivery_Problem = 'Delivery_Problem',
  Delivery = 'Delivery',
  Packaging_Issue = 'Packaging_Issue',
  Packaging = 'Packaging',
  Labeling = 'Labeling',
  Safety_Concern = 'Safety_Concern',
  Documentation = 'Documentation',
  Foreign_Material = 'Foreign_Material',
  Other = 'Other'
}

// Complaint Priority Enum
export enum ComplaintPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

// Training Status Enum
export enum TrainingStatus {
  Not_Started = 'Not_Started',
  In_Progress = 'In_Progress',
  Completed = 'Completed',
  Expired = 'Expired',
  Cancelled = 'Cancelled'
}

// Training Type Enum
export enum TrainingType {
  Mandatory = 'Mandatory',
  Optional = 'Optional',
  Refresher = 'Refresher',
  Certification = 'Certification'
}

// Training Category Enum
export enum TrainingCategory {
  Food_Safety = 'Food_Safety',
  HACCP = 'HACCP',
  GMP = 'GMP',
  Quality_Management = 'Quality_Management',
  Regulatory_Compliance = 'Regulatory_Compliance',
  Equipment_Operation = 'Equipment_Operation',
  Safety_Procedures = 'Safety_Procedures',
  Documentation = 'Documentation',
  Other = 'Other'
}
