
// Document related enums
export enum DocumentStatus {
  Draft = 'Draft',
  InReview = 'In_Review',
  PendingReview = 'Pending_Review',
  PendingApproval = 'Pending_Approval',
  Approved = 'Approved',
  Published = 'Published',
  Archived = 'Archived',
  Rejected = 'Rejected',
  Obsolete = 'Obsolete',
  Active = 'Active',
  Expired = 'Expired'
}

export enum CheckoutStatus {
  Available = 'Available',
  CheckedOut = 'Checked_Out'
}

// CAPA related enums
export enum CAPAStatus {
  Open = 'Open',
  InProgress = 'In_Progress',
  Completed = 'Completed',
  Closed = 'Closed',
  Rejected = 'Rejected',
  OnHold = 'On_Hold',
  Overdue = 'Overdue',
  PendingVerification = 'Pending_Verification',
  Verified = 'Verified',
  UnderReview = 'Under_Review'
}

export enum CAPAPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum CAPASource {
  Audit = 'Audit',
  CustomerComplaint = 'Customer_Complaint',
  InternalReport = 'Internal_Report',
  NonConformance = 'Non_Conformance',
  RegulatoryInspection = 'Regulatory_Inspection',
  SupplierIssue = 'Supplier_Issue',
  Other = 'Other'
}

export enum CAPAEffectivenessRating {
  NotEffective = 'Not_Effective',
  PartiallyEffective = 'Partially_Effective',
  Effective = 'Effective',
  HighlyEffective = 'Highly_Effective'
}

// Training related enums
export enum TrainingStatus {
  NotStarted = 'Not_Started',
  InProgress = 'In_Progress',
  Completed = 'Completed',
  Overdue = 'Overdue',
  Cancelled = 'Cancelled'
}

export enum TrainingType {
  Onboarding = 'Onboarding',
  Compliance = 'Compliance',
  Technical = 'Technical',
  Safety = 'Safety',
  Quality = 'Quality',
  Management = 'Management',
  Other = 'Other'
}

export enum TrainingCategory {
  FoodSafety = 'Food_Safety',
  HACCP = 'HACCP',
  SQF = 'SQF',
  GMP = 'GMP',
  Sanitation = 'Sanitation',
  Allergen = 'Allergen',
  RegulatoryCompliance = 'Regulatory_Compliance',
  EquipmentOperation = 'Equipment_Operation',
  Other = 'Other'
}

// Complaint related enums
export enum ComplaintStatus {
  New = 'New',
  UnderInvestigation = 'Under_Investigation',
  Resolved = 'Resolved',
  Closed = 'Closed',
  Escalated = 'Escalated',
  OnHold = 'On_Hold'
}

export enum ComplaintCategory {
  ProductQuality = 'Product_Quality',
  ForeignMaterial = 'Foreign_Material',
  Packaging = 'Packaging',
  Labeling = 'Labeling',
  Allergen = 'Allergen',
  Taste = 'Taste',
  Appearance = 'Appearance',
  ServiceIssue = 'Service_Issue',
  Other = 'Other'
}

export enum ComplaintPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}
