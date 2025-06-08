
// Document Status Enum
export enum DocumentStatus {
  Draft = "Draft",
  UnderReview = "Under Review", 
  Approved = "Approved",
  Rejected = "Rejected",
  Archived = "Archived",
  Expired = "Expired",
  PendingReview = "Pending Review",
  PendingApproval = "Pending Approval", 
  Published = "Published",
  Active = "Active",
  Obsolete = "Obsolete",
  InReview = "In Review"
}

// Checkout Status Enum
export enum CheckoutStatus {
  Available = "Available",
  CheckedOut = "Checked Out", 
  Locked = "Locked"
}

// Document Category Enum
export enum DocumentCategory {
  SOP = "SOP",
  Policy = "Policy",
  Form = "Form", 
  Certificate = "Certificate",
  AuditReport = "Audit Report",
  HACCPPlan = "HACCP Plan",
  TrainingMaterial = "Training Material",
  SupplierDocumentation = "Supplier Documentation",
  RiskAssessment = "Risk Assessment",
  Other = "Other"
}

// CAPA Status Enum
export enum CAPAStatus {
  Open = "Open",
  InProgress = "In Progress",
  Closed = "Closed", 
  Overdue = "Overdue",
  PendingVerification = "Pending Verification",
  Completed = "Completed",
  Verified = "Verified",
  Rejected = "Rejected",
  OnHold = "On Hold",
  UnderReview = "Under Review"
}

// CAPA Priority Enum
export enum CAPAPriority {
  Low = "Low",
  Medium = "Medium", 
  High = "High",
  Critical = "Critical"
}

// CAPA Source Enum
export enum CAPASource {
  Audit = "Audit",
  Complaint = "Complaint",
  NonConformance = "Non-Conformance",
  ManagementReview = "Management Review",
  SupplierIssue = "Supplier Issue", 
  CustomerComplaint = "Customer Complaint",
  InternalReport = "Internal Report",
  RegulatoryInspection = "Regulatory Inspection",
  Other = "Other"
}

// CAPA Effectiveness Rating Enum
export enum CAPAEffectivenessRating {
  Effective = "Effective",
  PartiallyEffective = "Partially Effective",
  NotEffective = "Not Effective", 
  HighlyEffective = "Highly Effective"
}

// Complaint Status Enum
export enum ComplaintStatus {
  New = "New",
  InProgress = "In Progress", 
  Resolved = "Resolved",
  Closed = "Closed",
  Escalated = "Escalated"
}

// Complaint Category Enum
export enum ComplaintCategory {
  Quality = "Quality",
  Safety = "Safety",
  Service = "Service",
  Delivery = "Delivery",
  Other = "Other"
}

// Complaint Priority Enum
export enum ComplaintPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High", 
  Critical = "Critical"
}

// Non-Conformance Status Enum
export enum NCStatus {
  OnHold = "On Hold",
  UnderReview = "Under Review",
  Closed = "Closed",
  Open = "Open", 
  InProgress = "In Progress",
  Resolved = "Resolved",
  Completed = "Completed",
  Overdue = "Overdue",
  PendingVerification = "Pending Verification",
  Verified = "Verified",
  Rejected = "Rejected"
}

// Training Status Enum
export enum TrainingStatus {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Completed = "Completed",
  Overdue = "Overdue",
  Expired = "Expired"
}

// Training Type Enum
export enum TrainingType {
  Online = "Online", 
  InPerson = "In Person",
  Hybrid = "Hybrid",
  SelfPaced = "Self Paced"
}

// Training Category Enum
export enum TrainingCategory {
  FoodSafety = "Food Safety",
  QualityControl = "Quality Control",
  HACCP = "HACCP",
  Allergen = "Allergen",
  Sanitation = "Sanitation",
  Safety = "Safety", 
  Other = "Other"
}
