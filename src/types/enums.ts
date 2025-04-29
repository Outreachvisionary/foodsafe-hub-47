
// Standard enums for the entire application
// These align with backend values used in Supabase

export enum CheckoutStatus {
  Available = "Available",
  CheckedOut = "Checked_Out"
}

export enum DocumentStatus {
  Draft = "Draft",
  InReview = "In_Review",
  PendingReview = "Pending_Review",
  PendingApproval = "Pending_Approval",
  Approved = "Approved",
  Published = "Published",
  Archived = "Archived",
  Rejected = "Rejected",
  Obsolete = "Obsolete",
  Active = "Active",
  Expired = "Expired"
}

export type DocumentVersionType = "major" | "minor";

export enum CAPAStatus {
  Open = "Open",
  InProgress = "In_Progress",
  UnderReview = "Under_Review",
  Completed = "Completed",
  Closed = "Closed",
  Rejected = "Rejected",
  OnHold = "On_Hold",
  Overdue = "Overdue",
  PendingVerification = "Pending_Verification",
  Verified = "Verified"
}

export enum CAPAEffectivenessRating {
  NotEffective = "Not_Effective",
  PartiallyEffective = "Partially_Effective",
  Effective = "Effective",
  HighlyEffective = "Highly_Effective"
}

// Type guards for comparing enum values with strings
export const isCheckoutStatus = (value: string, status: CheckoutStatus): boolean => {
  return value?.replace(/ /g, '_').toLowerCase() === status.toLowerCase();
};

export const isDocumentStatus = (value: string, status: DocumentStatus): boolean => {
  return value?.replace(/ /g, '_').toLowerCase() === status.toLowerCase();
};

export const isCAPAStatus = (value: string, status: CAPAStatus): boolean => {
  return value?.replace(/ /g, '_').toLowerCase() === status.toLowerCase();
};

export const isEffectivenessRating = (value: string, rating: CAPAEffectivenessRating): boolean => {
  return value?.replace(/ /g, '_').toLowerCase() === rating.toLowerCase();
};

// Add training-related enums
export enum TrainingStatus {
  NotStarted = "Not_Started",
  InProgress = "In_Progress",
  Completed = "Completed",
  Expired = "Expired",
  Overdue = "Overdue"
}

export enum TrainingType {
  OnBoarding = "On_Boarding",
  Compliance = "Compliance",
  Skills = "Skills",
  Leadership = "Leadership",
  Safety = "Safety",
  Technical = "Technical"
}

export enum TrainingCategory {
  Required = "Required",
  Optional = "Optional",
  Certification = "Certification",
  Regulatory = "Regulatory"
}
