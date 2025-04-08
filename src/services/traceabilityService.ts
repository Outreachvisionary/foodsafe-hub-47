
/**
 * Mock Traceability Service
 * This is a placeholder to support testing and hooks functionality.
 */

// Basic CRUD operations for products
export const fetchProducts = async () => {
  // In a real implementation, this would interact with the database
  return [];
};

export const createProduct = async (product: any) => {
  // In a real implementation, this would interact with the database
  return { id: 'mock-product-id', ...product };
};

export const fetchProductById = async (id: string) => {
  // In a real implementation, this would interact with the database
  return { id };
};

export const updateProduct = async (id: string, updates: any) => {
  // In a real implementation, this would interact with the database
  return { id, ...updates };
};

export const deleteProduct = async (id: string) => {
  // In a real implementation, this would interact with the database
  return true;
};

// Additional traceability functions
export const fetchComponents = async () => {
  return [];
};

export const fetchRecalls = async () => {
  return [];
};

export const fetchRecallSchedules = async () => {
  return [];
};

export const fetchComponentById = async (id: string) => {
  return { id };
};

export const fetchRecallById = async (id: string) => {
  return { id };
};

export const fetchProductGenealogy = async (productId: string) => {
  return [];
};

export const fetchSupplyChainData = async () => {
  return { nodes: [], links: [] };
};

export const fetchRecallSimulations = async () => {
  return [];
};

export const fetchNotifications = async () => {
  return [];
};

export const fetchProductComponents = async (productId: string) => {
  return [];
};

export const fetchAffectedProducts = async (componentId: string) => {
  return [];
};

export const fetchProductByBatchLot = async (batchLot: string) => {
  return [];
};

export const createComponent = async (component: any) => {
  return { id: 'mock-component-id', ...component };
};

export const createGenealogyLink = async (link: any) => {
  return { id: 'mock-link-id', ...link };
};

export const createRecall = async (recall: any) => {
  return { id: 'mock-recall-id', ...recall };
};

export const createRecallSimulation = async (simulation: any) => {
  return { id: 'mock-simulation-id', ...simulation };
};

export const createRecallSchedule = async (schedule: any) => {
  return { id: 'mock-schedule-id', ...schedule };
};

export const createNotification = async (notification: any) => {
  return { id: 'mock-notification-id', ...notification };
};

export const sendBulkNotifications = async (notifications: any[]) => {
  return notifications.map(n => ({ id: `mock-notification-${Math.random()}`, ...n }));
};

export default {
  fetchProducts,
  createProduct,
  fetchProductById,
  updateProduct,
  deleteProduct,
  fetchComponents,
  fetchRecalls,
  fetchRecallSchedules,
  fetchComponentById, 
  fetchRecallById,
  fetchProductGenealogy,
  fetchSupplyChainData,
  fetchRecallSimulations,
  fetchNotifications,
  fetchProductComponents,
  fetchAffectedProducts,
  fetchProductByBatchLot,
  createComponent,
  createGenealogyLink,
  createRecall,
  createRecallSimulation,
  createRecallSchedule,
  createNotification,
  sendBulkNotifications
};
