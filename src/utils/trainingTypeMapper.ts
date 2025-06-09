
import { TrainingType, TrainingCategory, TrainingStatus } from '@/types/enums';

export const stringToTrainingType = (type: string): TrainingType => {
  switch (type) {
    case 'Online':
      return TrainingType.Online;
    case 'Classroom':
      return TrainingType.Classroom;
    case 'On the Job':
      return TrainingType.On_the_Job;
    case 'Certification':
      return TrainingType.Certification;
    case 'Refresher':
      return TrainingType.Refresher;
    case 'Mandatory':
      return TrainingType.Mandatory;
    default:
      return TrainingType.Online;
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
    case 'Allergen Management':
      return TrainingCategory.Allergen_Management;
    case 'Personal Hygiene':
      return TrainingCategory.Personal_Hygiene;
    case 'Equipment Operation':
      return TrainingCategory.Equipment_Operation;
    case 'Quality Control':
      return TrainingCategory.Quality_Control;
    case 'Documentation':
      return TrainingCategory.Documentation;
    case 'Leadership':
      return TrainingCategory.Leadership;
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
    case 'Failed':
      return TrainingStatus.Failed;
    default:
      return TrainingStatus.Not_Started;
  }
};

export const trainingStatusToString = (status: TrainingStatus): string => {
  return status;
};
