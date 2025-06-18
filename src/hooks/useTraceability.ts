
import { useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  Component, 
  Recall, 
  RecallSchedule,
  ProductGenealogy,
  GraphData,
  TraceabilityNotification,
  TreeNode,
  RecallSimulation,
  SupplyChainPartner
} from '@/types/traceability';
import traceabilityService from '@/services/traceability/traceabilityService';

export const useTraceability = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [recalls, setRecalls] = useState<Recall[]>([]);
  const [recallSchedules, setRecallSchedules] = useState<RecallSchedule[]>([]);
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
  const [error, setError] = useState<any>(null);

  // Load all products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await traceabilityService.fetchProducts();
      setProducts(data || []);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading products:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all components
  const loadComponents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await traceabilityService.fetchComponents();
      setComponents(data || []);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading components:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all recalls
  const loadRecalls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await traceabilityService.fetchRecalls();
      setRecalls(data || []);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading recalls:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load components for a product (by batch/lot number)
  const loadProductComponents = useCallback(async (batchLotNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await traceabilityService.fetchProductComponents(batchLotNumber);
      setProductComponents(data || []);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading product components:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load affected products for a component (by batch/lot number)
  const loadAffectedProducts = useCallback(async (batchLotNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await traceabilityService.fetchAffectedProducts(batchLotNumber);
      setAffectedProducts(data || []);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading affected products:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new product
  const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await traceabilityService.createProduct(productData);
      if (data) {
        setProducts(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError(err);
      console.error("Error adding product:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new component
  const addComponent = useCallback(async (componentData: Omit<Component, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await traceabilityService.createComponent(componentData);
      if (data) {
        setComponents(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError(err);
      console.error("Error adding component:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a genealogy link
  const addGenealogyLink = useCallback(async (genealogyData: Omit<ProductGenealogy, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await traceabilityService.createGenealogyLink(genealogyData);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error adding genealogy link:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new recall
  const addRecall = useCallback(async (recallData: Omit<Recall, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await traceabilityService.createRecall(recallData);
      if (data) {
        setRecalls(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError(err);
      console.error("Error adding recall:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a recall simulation
  const addRecallSimulation = useCallback(async (simulationData: Omit<RecallSimulation, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await traceabilityService.createRecallSimulation(simulationData);
      if (data) {
        setRecallSimulations(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError(err);
      console.error("Error adding recall simulation:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load supply chain visualization data
  const loadSupplyChainVisualization = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await traceabilityService.fetchSupplyChainData();
      if (data) {
        const graphData: GraphData = {
          nodes: Array.isArray(data.nodes) ? data.nodes : [],
          edges: Array.isArray(data.links) ? data.links.map((link: any) => ({
            source: link.source,
            target: link.target,
            type: link.type,
            id: `${link.source}-${link.target}`,
            label: link.type || 'connects to'
          })) : []
        };
        setSupplyChainData(graphData);
        return graphData;
      }
      return null;
    } catch (err) {
      setError(err);
      console.error("Error loading supply chain data:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadProducts();
    loadComponents();
    loadRecalls();
  }, [loadProducts, loadComponents, loadRecalls]);

  return {
    products,
    components,
    recalls,
    recallSchedules,
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
    
    loadProducts,
    loadComponents,
    loadRecalls,
    loadProductComponents,
    loadAffectedProducts,
    loadSupplyChainVisualization,
    
    addProduct,
    addComponent,
    addGenealogyLink,
    addRecall,
    addRecallSimulation,
    
    setSelectedProduct,
    setSelectedComponent,
    setSelectedRecall
  };
};
