
/**
 * Mock Training Service
 * This is a placeholder to support testing.
 */

export const fetchTrainingSessions = async () => {
  // In a real implementation, this would interact with the database
  return [];
};

export const createTrainingSession = async (session: any) => {
  // In a real implementation, this would interact with the database
  return { id: 'mock-training-id', ...session };
};

export const fetchTrainingSessionById = async (id: string) => {
  // In a real implementation, this would interact with the database
  return { id };
};

export const updateTrainingSession = async (id: string, updates: any) => {
  // In a real implementation, this would interact with the database
  return { id, ...updates };
};

export const deleteTrainingSession = async (id: string) => {
  // In a real implementation, this would interact with the database
  return true;
};

export default {
  fetchTrainingSessions,
  createTrainingSession,
  fetchTrainingSessionById,
  updateTrainingSession,
  deleteTrainingSession
};
