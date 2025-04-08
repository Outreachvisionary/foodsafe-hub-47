
/**
 * Mock HACCP Service
 * This is a placeholder to support testing.
 */

export const fetchHACCPPlans = async () => {
  // In a real implementation, this would interact with the database
  return [];
};

export const createHACCPPlan = async (plan: any) => {
  // In a real implementation, this would interact with the database
  return { id: 'mock-haccp-id', ...plan };
};

export const fetchHACCPPlanById = async (id: string) => {
  // In a real implementation, this would interact with the database
  return { id };
};

export const updateHACCPPlan = async (id: string, updates: any) => {
  // In a real implementation, this would interact with the database
  return { id, ...updates };
};

export const deleteHACCPPlan = async (id: string) => {
  // In a real implementation, this would interact with the database
  return true;
};

// Additional function for tests
export const linkToTraining = async (haccpId: string, trainingId: string) => {
  return true;
};

export default {
  fetchHACCPPlans,
  createHACCPPlan,
  fetchHACCPPlanById,
  updateHACCPPlan,
  deleteHACCPPlan,
  linkToTraining
};
