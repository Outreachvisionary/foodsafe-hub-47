
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
  Cancelled = 'Cancelled',
  Pending_Verification = 'Pending Verification',
  Completed = 'Completed',
  Rejected = 'Rejected',
  On_Hold = 'On Hold',
  Overdue = 'Overdue',
  Verified = 'Verified'
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
  Other = 'Other',
  Audit = 'Audit',
  Complaint = 'Complaint',
  Internal_Report = 'Internal Report',
  Supplier_Issue = 'Supplier Issue',
  Regulatory = 'Regulatory'
}

export enum CAPAEffectivenessRating {
  Not_Assessed = 'Not Assessed',
  Ineffective = 'Ineffective',
  Not_Effective = 'Not Effective',
  Partially_Effective = 'Partially Effective',
  Effective = 'Effective',
  Pending = 'Pending'
}

// Export alias for backward compatibility
export const EffectivenessRating = CAPAEffectivenessRating;

// Training related enums
export enum TrainingStatus {
  Not_Started = 'Not Started',
  In_Progress = 'In Progress',
  Completed = 'Completed',
  Expired = 'Expired',
  Failed = 'Failed'
}

export enum TrainingType {
  Online = 'Online',
  Classroom = 'Classroom',
  On_the_Job = 'On the Job',
  Certification = 'Certification',
  Refresher = 'Refresher',
  Mandatory = 'Mandatory'
}

export enum TrainingCategory {
  Food_Safety = 'Food Safety',
  HACCP = 'HACCP',
  GMP = 'GMP',
  Allergen_Management = 'Allergen Management',
  Personal_Hygiene = 'Personal Hygiene',
  Equipment_Operation = 'Equipment Operation',
  Quality_Control = 'Quality Control',
  Documentation = 'Documentation',
  Leadership = 'Leadership',
  Other = 'Other'
}

// Non-conformance related enums
export enum NCStatus {
  Open = 'Open',
  Under_Investigation = 'Under Investigation',
  Under_Review = 'Under Review',
  Resolved = 'Resolved',
  Closed = 'Closed',
  On_Hold = 'On Hold',
  InProgress = 'In Progress',
  Released = 'Released',
  Disposed = 'Disposed',
  Approved = 'Approved'
}

export enum NCItemCategory {
  Equipment = 'Equipment',
  Facility = 'Facility',
  Finished_Product = 'Finished Product',
  Raw_Material = 'Raw Material',
  Packaging_Materials = 'Packaging Materials',
  Packaging = 'Packaging',
  Other = 'Other'
}

export enum NCReasonCategory {
  Quality_Issue = 'Quality Issue',
  Food_Safety = 'Food Safety',
  Damaged = 'Damaged',
  Process_Deviation = 'Process Deviation',
  Foreign_Material = 'Foreign Material',
  Expired = 'Expired',
  Other = 'Other'
}

// Complaint related enums
export enum ComplaintStatus {
  Open = 'Open',
  In_Progress = 'In Progress',
  Under_Investigation = 'Under Investigation',
  Resolved = 'Resolved',
  Closed = 'Closed',
  Rejected = 'Rejected',
  Pending_Review = 'Pending Review'
}

export enum ComplaintCategory {
  Product_Quality = 'Product Quality',
  Food_Safety = 'Food Safety',
  Packaging = 'Packaging',
  Delivery = 'Delivery',
  Customer_Service = 'Customer Service',
  Allergen = 'Allergen',
  Foreign_Object = 'Foreign Object',
  Contamination = 'Contamination',
  Other = 'Other'
}

export enum ComplaintPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
  Urgent = 'Urgent'
}
