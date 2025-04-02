
import { 
  Employee, 
  Course, 
  TrainingRecord, 
  TrainingPlan, 
  AutoAssignRule,
  TrainingAutomationConfig,
  DocumentControlIntegration
} from '@/types/training';

import trainingAssignmentService from './trainingAssignmentService';
import documentTrainingService from './documentTrainingService';
import certificationTrainingService from './certificationTrainingService';
import trainingConfigService from './trainingConfigService';

/**
 * Service for automating training assignments and workflows
 * Acts as a facade for the specialized training services
 */
export const trainingAutomationService = {
  // Assignment service methods
  assignTrainingPlan: trainingAssignmentService.assignTrainingPlan,
  evaluateAutoAssignRules: trainingAssignmentService.evaluateAutoAssignRules,
  
  // Document training service methods
  handleDocumentUpdate: documentTrainingService.handleDocumentUpdate,
  getDocumentTrainingNotifications: documentTrainingService.getDocumentTrainingNotifications,
  
  // Certification training service methods
  processExpiringCertifications: certificationTrainingService.processExpiringCertifications,
  createRemediationTraining: certificationTrainingService.createRemediationTraining,
  
  // Config service methods
  getAutomationConfig: trainingConfigService.getAutomationConfig,
  updateAutomationConfig: trainingConfigService.updateAutomationConfig
};

export default trainingAutomationService;
