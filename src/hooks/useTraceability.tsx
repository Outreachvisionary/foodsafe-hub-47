import { useState, useEffect, useCallback } from 'react';
import { 
  fetchProducts, 
  fetchProductById, 
  fetchProductByBatchLot,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchComponents,
  fetchComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
  fetchProductGenealogy,
  createProductGenealogy,
  deleteProductGenealogy,
  buildGenealogyTree,
  fetchRecalls,
  fetchRecallById,
  createRecall,
  updateRecall,
  deleteRecall,
  createRecallSimulation,
  fetchRecallSimulations,
  fetchRecallSchedules,
  createRecallSchedule,
  updateRecallSchedule,
  deleteRecallSchedule,
  sendNotification,
  fetchNotifications,
  fetchSupplyChainPartners,
  createSupplyChainPartner,
  fetchSupplyChainLinks,
  createSupplyChainLink,
  buildSupplyChainVisualization,
  findAffectedProductsByComponent,
  findProductComponents,
  sendBulkNotifications
} from '@/services/traceabilityService';

import {
  Product,
  Component,
  ProductGenealogy,
  Recall,
  RecallSimulation,
  RecallSchedule,
  TraceabilityNotification,
  SupplyChainPartner,
  SupplyChainLink,
  TreeNode,
  GraphData
} from '@/types/traceability';

export const useTraceability = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [recalls, setRecalls] = useState<Recall[]>([]);
  const [recallSchedules, setRecallSchedules] = useState<RecallSchedule[]>([]);
  const [supplyChainPartners, setSupplyChainPartners] = useState<SupplyChainPartner[]>([]);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [selectedRecall, setSelectedRecall] = useState<Recall | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<RecallSchedule | null>(null);
  
  const [genealogyTree, setGenealogyTree] = useState<TreeNode | null>(null);
  const [supplyChainData, setSupplyChainData] = useState<GraphData | null>(null);
  const [recallSimulations, setRecallSimulations] = useState<RecallSimulation[]>([]);
  const [notifications, setNotifications] = useState<TraceabilityNotification[]>([]);
  
  const [productComponents, setProductComponents] = useState<Component[]>([]);
  const [affectedProducts, setAffectedProducts] = useState<Product[]>([]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load components
  const loadComponents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComponents();
      setComponents(data);
    } catch (err) {
      setError('Failed to load components');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load recalls
  const loadRecalls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecalls();
      setRecalls(data);
    } catch (err) {
      setError('Failed to load recalls');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load recall schedules
  const loadRecallSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecallSchedules();
      setRecallSchedules(data);
    } catch (err) {
      setError('Failed to load recall schedules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load supply chain partners
  const loadSupplyChainPartners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSupplyChainPartners();
      setSupplyChainPartners(data);
    } catch (err) {
      setError('Failed to load supply chain partners');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a product by ID
  const loadProduct = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductById(productId);
      setSelectedProduct(data);
      return data;
    } catch (err) {
      setError('Failed to load product details');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a product by batch/lot number
  const loadProductByBatchLot = useCallback(async (batchLotNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductByBatchLot(batchLotNumber);
      setSelectedProduct(data);
      return data;
    } catch (err) {
      setError('Failed to load product details');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a component by ID
  const loadComponent = useCallback(async (componentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComponentById(componentId);
      setSelectedComponent(data);
      return data;
    } catch (err) {
      setError('Failed to load component details');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a recall by ID
  const loadRecall = useCallback(async (recallId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecallById(recallId);
      setSelectedRecall(data);
      return data;
    } catch (err) {
      setError('Failed to load recall details');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Build genealogy tree for a product
  const loadGenealogyTree = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await buildGenealogyTree(productId);
      setGenealogyTree(data);
      return data;
    } catch (err) {
      setError('Failed to build genealogy tree');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Build supply chain visualization
  const loadSupplyChainVisualization = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await buildSupplyChainVisualization(productId);
      setSupplyChainData(data);
      return data;
    } catch (err) {
      setError('Failed to build supply chain visualization');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load recall simulations
  const loadRecallSimulations = useCallback(async (recallId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecallSimulations(recallId);
      setRecallSimulations(data);
      return data;
    } catch (err) {
      setError('Failed to load recall simulations');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load notifications
  const loadNotifications = useCallback(async (recallId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(recallId);
      setNotifications(data);
      return data;
    } catch (err) {
      setError('Failed to load notifications');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Find components of a product
  const loadProductComponents = useCallback(async (productBatchLot: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await findProductComponents(productBatchLot);
      setProductComponents(data);
      return data;
    } catch (err) {
      setError('Failed to find product components');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Find affected products by component
  const loadAffectedProducts = useCallback(async (componentBatchLot: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await findAffectedProductsByComponent(componentBatchLot);
      setAffectedProducts(data);
      return data;
    } catch (err) {
      setError('Failed to find affected products');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new product
  const addProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createProduct(productData);
      if (data) {
        setProducts(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError('Failed to create product');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing product
  const editProduct = useCallback(async (productId: string, productData: Partial<Product>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateProduct(productId, productData);
      if (data) {
        setProducts(prev => prev.map(product => 
          product.id === productId ? data : product
        ));
        if (selectedProduct && selectedProduct.id === productId) {
          setSelectedProduct(data);
        }
      }
      return data;
    } catch (err) {
      setError('Failed to update product');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedProduct]);

  // Remove a product
  const removeProduct = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await deleteProduct(productId);
      if (success) {
        setProducts(prev => prev.filter(product => product.id !== productId));
        if (selectedProduct && selectedProduct.id === productId) {
          setSelectedProduct(null);
        }
      }
      return success;
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedProduct]);

  // Add a new component
  const addComponent = useCallback(async (componentData: Omit<Component, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createComponent(componentData);
      if (data) {
        setComponents(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError('Failed to create component');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing component
  const editComponent = useCallback(async (componentId: string, componentData: Partial<Component>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateComponent(componentId, componentData);
      if (data) {
        setComponents(prev => prev.map(component => 
          component.id === componentId ? data : component
        ));
        if (selectedComponent && selectedComponent.id === componentId) {
          setSelectedComponent(data);
        }
      }
      return data;
    } catch (err) {
      setError('Failed to update component');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedComponent]);

  // Remove a component
  const removeComponent = useCallback(async (componentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await deleteComponent(componentId);
      if (success) {
        setComponents(prev => prev.filter(component => component.id !== componentId));
        if (selectedComponent && selectedComponent.id === componentId) {
          setSelectedComponent(null);
        }
      }
      return success;
    } catch (err) {
      setError('Failed to delete component');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedComponent]);

  // Add a genealogy link
  const addGenealogyLink = useCallback(async (genealogyData: Omit<ProductGenealogy, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createProductGenealogy(genealogyData);
      return data;
    } catch (err) {
      setError('Failed to create genealogy link');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove a genealogy link
  const removeGenealogyLink = useCallback(async (genealogyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await deleteProductGenealogy(genealogyId);
      return success;
    } catch (err) {
      setError('Failed to delete genealogy link');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new recall
  const addRecall = useCallback(async (recallData: Omit<Recall, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createRecall(recallData);
      if (data) {
        setRecalls(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError('Failed to create recall');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing recall
  const editRecall = useCallback(async (recallId: string, recallData: Partial<Recall>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateRecall(recallId, recallData);
      if (data) {
        setRecalls(prev => prev.map(recall => 
          recall.id === recallId ? data : recall
        ));
        if (selectedRecall && selectedRecall.id === recallId) {
          setSelectedRecall(data);
        }
      }
      return data;
    } catch (err) {
      setError('Failed to update recall');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedRecall]);

  // Remove a recall
  const removeRecall = useCallback(async (recallId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await deleteRecall(recallId);
      if (success) {
        setRecalls(prev => prev.filter(recall => recall.id !== recallId));
        if (selectedRecall && selectedRecall.id === recallId) {
          setSelectedRecall(null);
        }
      }
      return success;
    } catch (err) {
      setError('Failed to delete recall');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedRecall]);

  // Add a new recall simulation
  const addRecallSimulation = useCallback(async (simulationData: Omit<RecallSimulation, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createRecallSimulation(simulationData);
      if (data) {
        setRecallSimulations(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError('Failed to create recall simulation');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new recall schedule
  const addRecallSchedule = useCallback(async (scheduleData: Omit<RecallSchedule, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createRecallSchedule(scheduleData);
      if (data) {
        setRecallSchedules(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError('Failed to create recall schedule');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing recall schedule
  const editRecallSchedule = useCallback(async (scheduleId: string, scheduleData: Partial<RecallSchedule>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateRecallSchedule(scheduleId, scheduleData);
      if (data) {
        setRecallSchedules(prev => prev.map(schedule => 
          schedule.id === scheduleId ? data : schedule
        ));
        if (selectedSchedule && selectedSchedule.id === scheduleId) {
          setSelectedSchedule(data);
        }
      }
      return data;
    } catch (err) {
      setError('Failed to update recall schedule');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedSchedule]);

  // Remove a recall schedule
  const removeRecallSchedule = useCallback(async (scheduleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await deleteRecallSchedule(scheduleId);
      if (success) {
        setRecallSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
        if (selectedSchedule && selectedSchedule.id === scheduleId) {
          setSelectedSchedule(null);
        }
      }
      return success;
    } catch (err) {
      setError('Failed to delete recall schedule');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedSchedule]);

  // Send a notification
  const addNotification = useCallback(async (notificationData: Omit<TraceabilityNotification, 'id' | 'status' | 'sent_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sendNotification(notificationData);
      if (data) {
        setNotifications(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError('Failed to send notification');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send bulk notifications to all stakeholders
  const sendAllNotifications = useCallback(async (recallId: string, subject: string, message: string, createdBy: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await sendBulkNotifications(recallId, subject, message, createdBy);
      if (success) {
        // Reload notifications to get the newly created ones
        await loadNotifications(recallId);
      }
      return success;
    } catch (err) {
      setError('Failed to send bulk notifications');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadNotifications]);

  // Add a new supply chain partner
  const addSupplyChainPartner = useCallback(async (partnerData: Omit<SupplyChainPartner, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createSupplyChainPartner(partnerData);
      if (data) {
        setSupplyChainPartners(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError('Failed to create supply chain partner');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new supply chain link
  const addSupplyChainLink = useCallback(async (linkData: Omit<SupplyChainLink, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createSupplyChainLink(linkData);
      return data;
    } catch (err) {
      setError('Failed to create supply chain link');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    products,
    components,
    recalls,
    recallSchedules,
    supplyChainPartners,
    selectedProduct,
    selectedComponent,
    selectedRecall,
    selectedSchedule,
    genealogyTree,
    supplyChainData,
    recallSimulations,
    notifications,
    productComponents,
    affectedProducts,
    loading,
    error,
    
    // Data loading methods
    loadProducts,
    loadComponents,
    loadRecalls,
    loadRecallSchedules,
    loadSupplyChainPartners,
    loadProduct,
    loadProductByBatchLot,
    loadComponent,
    loadRecall,
    loadGenealogyTree,
    loadSupplyChainVisualization,
    loadRecallSimulations,
    loadNotifications,
    loadProductComponents,
    loadAffectedProducts,
    
    // CRUD operations
    addProduct,
    editProduct,
    removeProduct,
    addComponent,
    editComponent,
    removeComponent,
    addGenealogyLink,
    removeGenealogyLink,
    addRecall,
    editRecall,
    removeRecall,
    addRecallSimulation,
    addRecallSchedule,
    editRecallSchedule,
    removeRecallSchedule,
    addNotification,
    sendAllNotifications,
    addSupplyChainPartner,
    addSupplyChainLink,
    
    // Set state methods
    setSelectedProduct,
    setSelectedComponent,
    setSelectedRecall,
    setSelectedSchedule
  };
};

export default useTraceability;
