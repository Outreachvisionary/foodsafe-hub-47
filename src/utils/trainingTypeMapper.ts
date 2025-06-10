
import { TrainingType, TrainingCategory, TrainingStatus } from '@/types/enums';

export const stringToTrainingType = (type: string): TrainingType => {
  switch (type) {
    case 'Mandatory':
      return TrainingType.Mandatory;
    case 'Optional':
      return TrainingType.Optional;
    case 'Refresher':
      return TrainingType.Refresher;
    case 'Certification':
      return TrainingType.Certification;
    default:
      return TrainingType.Mandatory;
  }
};

export const trainingTypeToString = (type: TrainingType): string => {
  return type;
};

export const stringToTrainingCategory = (category: string): TrainingCategory => {
  switch (category) {
    case 'Food Safety':
      return TrainingCategory.Food_Safety;
    case 'HACCP':
      return TrainingCategory.HACCP;
    case 'GMP':
      return TrainingCategory.GMP;
    case 'Quality Management':
      return TrainingCategory.Quality_Management;
    case 'Regulatory Compliance':
      return TrainingCategory.Regulatory_Compliance;
    case 'Equipment Operation':
      return TrainingCategory.Equipment_Operation;
    case 'Safety Procedures':
      return TrainingCategory.Safety_Procedures;
    case 'Documentation':
      return TrainingCategory.Documentation;
    case 'Other':
      return TrainingCategory.Other;
    default:
      return TrainingCategory.Other;
  }
};

export const trainingCategoryToString = (category: TrainingCategory): string => {
  return category;
};

export const stringToTrainingStatus = (status: string): TrainingStatus => {
  switch (status) {
    case 'Not Started':
      return TrainingStatus.Not_Started;
    case 'In Progress':
      return TrainingStatus.In_Progress;
    case 'Completed':
      return TrainingStatus.Completed;
    case 'Expired':
      return TrainingStatus.Expired;
    case 'Cancelled':
      return TrainingStatus.Cancelled;
    default:
      return TrainingStatus.Not_Started;
  }
};

export const trainingStatusToString = (status: TrainingStatus): string => {
  return status;
};
