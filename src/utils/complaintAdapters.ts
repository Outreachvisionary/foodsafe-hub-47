
import { ComplaintCategory, ComplaintStatus, ComplaintPriority } from '@/types/enums';

// Complaint Category conversions - matching database enum values
export const complaintCategoryToDbString = (category: ComplaintCategory): string => {
  switch (category) {
    case ComplaintCategory.Product_Quality:
      return 'Product_Quality';
    case ComplaintCategory.Food_Safety:
      return 'Food_Safety';
    case ComplaintCategory.Foreign_Material:
      return 'Foreign_Matter';
    case ComplaintCategory.Packaging:
      return 'Packaging';
    case ComplaintCategory.Delivery:
      return 'Delivery';
    case ComplaintCategory.Service:
      return 'Customer_Service';
    case ComplaintCategory.Labeling:
      return 'Documentation';
    case ComplaintCategory.Other:
      return 'Other';
    default:
      return 'Other';
  }
};

export const stringToComplaintCategory = (category: string): ComplaintCategory => {
  switch (category) {
    case 'Product_Quality':
      return ComplaintCategory.Product_Quality;
    case 'Food_Safety':
      return ComplaintCategory.Food_Safety;
    case 'Foreign_Matter':
      return ComplaintCategory.Foreign_Material;
    case 'Packaging':
      return ComplaintCategory.Packaging;
    case 'Delivery':
      return ComplaintCategory.Delivery;
    case 'Customer_Service':
      return ComplaintCategory.Service;
    case 'Documentation':
      return ComplaintCategory.Labeling;
    case 'Allergen':
      return ComplaintCategory.Food_Safety; // Map allergen to food safety
    case 'Other':
      return ComplaintCategory.Other;
    default:
      return ComplaintCategory.Other;
  }
};

// Complaint Status conversions - matching database enum values
export const complaintStatusToDbString = (status: ComplaintStatus): string => {
  switch (status) {
    case ComplaintStatus.New:
      return 'New';
    case ComplaintStatus.Under_Investigation:
      return 'Under Investigation';
    case ComplaintStatus.Pending_Response:
      return 'Pending Response';
    case ComplaintStatus.Resolved:
      return 'Resolved';
    case ComplaintStatus.Closed:
      return 'Closed';
    case ComplaintStatus.Escalated:
      return 'Escalated';
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
    case 'Pending Response':
      return ComplaintStatus.Pending_Response;
    case 'Resolved':
      return ComplaintStatus.Resolved;
    case 'Closed':
      return ComplaintStatus.Closed;
    case 'Escalated':
      return ComplaintStatus.Escalated;
    default:
      return ComplaintStatus.New;
  }
};

// Complaint Priority conversions (frontend only - not in database)
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
