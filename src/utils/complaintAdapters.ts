
import { ComplaintCategory, ComplaintStatus, ComplaintPriority } from '@/types/enums';

// Complaint Category conversions
export const complaintCategoryToDbString = (category: ComplaintCategory): string => {
  switch (category) {
    case ComplaintCategory.Product_Quality:
      return 'Product Quality';
    case ComplaintCategory.Food_Safety:
      return 'Food Safety';
    case ComplaintCategory.Foreign_Material:
      return 'Foreign Material';
    case ComplaintCategory.Packaging:
      return 'Packaging';
    case ComplaintCategory.Delivery:
      return 'Delivery';
    case ComplaintCategory.Service:
      return 'Customer Service';
    case ComplaintCategory.Labeling:
      return 'Labeling';
    case ComplaintCategory.Other:
      return 'Other';
    default:
      return 'Other';
  }
};

export const stringToComplaintCategory = (category: string): ComplaintCategory => {
  switch (category) {
    case 'Product Quality':
      return ComplaintCategory.Product_Quality;
    case 'Food Safety':
      return ComplaintCategory.Food_Safety;
    case 'Foreign Material':
      return ComplaintCategory.Foreign_Material;
    case 'Packaging':
      return ComplaintCategory.Packaging;
    case 'Delivery':
      return ComplaintCategory.Delivery;
    case 'Customer Service':
    case 'Service':
      return ComplaintCategory.Service;
    case 'Labeling':
      return ComplaintCategory.Labeling;
    case 'Other':
      return ComplaintCategory.Other;
    default:
      return ComplaintCategory.Other;
  }
};

// Complaint Status conversions
export const complaintStatusToDbString = (status: ComplaintStatus): string => {
  switch (status) {
    case ComplaintStatus.New:
      return 'New';
    case ComplaintStatus.Under_Investigation:
      return 'Under Investigation';
    case ComplaintStatus.Resolved:
      return 'Resolved';
    case ComplaintStatus.Closed:
      return 'Closed';
    default:
      return 'New';
  }
};

export const stringToComplaintStatus = (status: string): ComplaintStatus => {
  switch (status) {
    case 'New':
      return ComplaintStatus.New;
    case 'Under Investigation':
      return ComplaintStatus.Under_Investigation;
    case 'Resolved':
      return ComplaintStatus.Resolved;
    case 'Closed':
      return ComplaintStatus.Closed;
    default:
      return ComplaintStatus.New;
  }
};

// Complaint Priority conversions
export const complaintPriorityToDbString = (priority: ComplaintPriority): string => {
  switch (priority) {
    case ComplaintPriority.Low:
      return 'Low';
    case ComplaintPriority.Medium:
      return 'Medium';
    case ComplaintPriority.High:
      return 'High';
    case ComplaintPriority.Critical:
      return 'Critical';
    default:
      return 'Medium';
  }
};

export const stringToComplaintPriority = (priority: string): ComplaintPriority => {
  switch (priority) {
    case 'Low':
      return ComplaintPriority.Low;
    case 'Medium':
      return ComplaintPriority.Medium;
    case 'High':
      return ComplaintPriority.High;
    case 'Critical':
      return ComplaintPriority.Critical;
    default:
      return ComplaintPriority.Medium;
  }
};
