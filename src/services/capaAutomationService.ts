
import { checkOverdueCAPAs } from './workflow/workflowAutomationService';
import { checkUpcomingDeadlines, processEffectivenessReviews, generatePerformanceReports } from './automation/automationTasksService';
import { autoEscalateStuckCAPAs } from './automation/automationEscalationService';
import { executeAutomationRules, type AutomationRule, type AutomationAction } from './automation/automationRulesService';

// Daily automation tasks
export const runDailyAutomation = async (): Promise<void> => {
  console.log('Running daily CAPA automation tasks...');
  
  try {
    await checkOverdueCAPAs();
    await checkUpcomingDeadlines();
    await processEffectivenessReviews();
    await generatePerformanceReports();
    
    console.log('Daily automation tasks completed successfully');
  } catch (error) {
    console.error('Error in daily automation:', error);
  }
};

// Re-export for backward compatibility
export {
  autoEscalateStuckCAPAs,
  executeAutomationRules,
  checkUpcomingDeadlines,
  processEffectivenessReviews,
  generatePerformanceReports,
  type AutomationRule,
  type AutomationAction
};
