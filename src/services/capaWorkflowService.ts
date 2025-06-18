// This file now imports from the refactored workflow modules
// The functionality remains exactly the same but is now better organized

export {
  initiateWorkflow,
  getWorkflowConfig,
  generateWorkflowSteps,
  advanceWorkflow,
  updateCAPAStatusBasedOnWorkflow,
  checkOverdueCAPAs,
  autoAssignCAPA,
  type WorkflowConfig,
  type WorkflowStep
} from './workflow/workflowService';
