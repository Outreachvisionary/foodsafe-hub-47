
import { supabase } from '@/lib/supabase';
import { 
  Product, 
  Component, 
  Recall, 
  RecallSchedule, 
  RecallSimulation,
  ProductGenealogy,
  TraceabilityNotification,
  GraphData,
  TreeNode,
  SupplyChainPartner
} from '@/types/traceability';

/**
 * Fetch all products
 */
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch all components
 */
export const fetchComponents = async (): Promise<Component[]> => {
  const { data, error } = await supabase
    .from('components')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching components:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch all recalls
 */
export const fetchRecalls = async (): Promise<Recall[]> => {
  const { data, error } = await supabase
    .from('recalls')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recalls:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch all recall schedules
 */
export const fetchRecallSchedules = async (): Promise<RecallSchedule[]> => {
  const { data, error } = await supabase
    .from('recall_schedules')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recall schedules:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch a product by ID
 */
export const fetchProductById = async (productId: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    throw error;
  }

  return data;
};

/**
 * Fetch a product by batch/lot number
 */
export const fetchProductByBatchLot = async (batchLotNumber: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('batch_lot_number', batchLotNumber)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product by batch/lot:', error);
    throw error;
  }

  return data;
};

/**
 * Fetch a component by ID
 */
export const fetchComponentById = async (componentId: string): Promise<Component | null> => {
  const { data, error } = await supabase
    .from('components')
    .select('*')
    .eq('id', componentId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching component:', error);
    throw error;
  }

  return data;
};

/**
 * Fetch a recall by ID
 */
export const fetchRecallById = async (recallId: string): Promise<Recall | null> => {
  const { data, error } = await supabase
    .from('recalls')
    .select('*')
    .eq('id', recallId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching recall:', error);
    throw error;
  }

  return data;
};

/**
 * Build a genealogy tree for a product
 */
export const fetchProductGenealogy = async (productId: string): Promise<TreeNode | null> => {
  // First, get the product details
  const product = await fetchProductById(productId);
  if (!product) return null;
  
  // Then, get all genealogy links for this product
  const { data: links, error: linksError } = await supabase
    .from('product_genealogy')
    .select('*, component:components(*)')
    .eq('product_id', productId);
    
  if (linksError) {
    console.error('Error fetching genealogy:', linksError);
    throw linksError;
  }
  
  // Create the root node
  const rootNode: TreeNode = {
    id: product.id,
    name: product.name,
    type: 'product',
    data: product,
    children: []
  };
  
  // Add component children
  if (links && links.length > 0) {
    rootNode.children = links.map(link => ({
      id: link.component.id,
      name: link.component.name,
      type: 'component',
      data: link.component
    }));
  }
  
  return rootNode;
};

/**
 * Fetch supply chain data for visualization
 */
export const fetchSupplyChainData = async (productId: string): Promise<GraphData | null> => {
  try {
    // This would typically involve a complex query to build the supply chain graph
    // For now, we'll create mock data for demonstration
    
    // Get the partners from the database
    const { data: partners, error: partnersError } = await supabase
      .from('supply_chain_partners')
      .select('*');
      
    if (partnersError) throw partnersError;
    
    // Get the links between partners
    const { data: links, error: linksError } = await supabase
      .from('supply_chain_links')
      .select('*')
      .or(`product_id.eq.${productId},product_id.is.null`);
      
    if (linksError) throw linksError;
    
    // Build the graph data
    const nodes = partners ? partners.map(partner => ({
      id: partner.id,
      label: partner.name,
      type: partner.partner_type,
      data: partner
    })) : [];
    
    const edges = links ? links.map(link => ({
      id: link.id,
      source: link.source_id,
      target: link.target_id,
      label: link.link_type,
      data: link
    })) : [];
    
    return { nodes, edges };
  } catch (error) {
    console.error('Error fetching supply chain data:', error);
    throw error;
  }
};

/**
 * Fetch recall simulations for a recall
 */
export const fetchRecallSimulations = async (recallId: string): Promise<RecallSimulation[]> => {
  const { data, error } = await supabase
    .from('recall_simulations')
    .select('*')
    .eq('recall_id', recallId)
    .order('simulation_date', { ascending: false });

  if (error) {
    console.error('Error fetching recall simulations:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch notifications for a recall
 */
export const fetchNotifications = async (recallId: string): Promise<TraceabilityNotification[]> => {
  const { data, error } = await supabase
    .from('traceability_notifications')
    .select('*')
    .eq('recall_id', recallId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch components used in a product by batch/lot number
 */
export const fetchProductComponents = async (batchLotNumber: string): Promise<Component[]> => {
  try {
    // First, get the product ID
    const product = await fetchProductByBatchLot(batchLotNumber);
    if (!product) return [];
    
    // Then, get component IDs from genealogy
    const { data: links, error: linksError } = await supabase
      .from('product_genealogy')
      .select('component_id')
      .eq('product_id', product.id);
      
    if (linksError) throw linksError;
    if (!links || links.length === 0) return [];
    
    // Finally, get the actual components
    const componentIds = links.map(link => link.component_id);
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select('*')
      .in('id', componentIds);
      
    if (componentsError) throw componentsError;
    
    return components || [];
  } catch (error) {
    console.error('Error fetching product components:', error);
    throw error;
  }
};

/**
 * Fetch products affected by a component with a specific batch/lot number
 */
export const fetchAffectedProducts = async (batchLotNumber: string): Promise<Product[]> => {
  try {
    // First, get the component ID
    const { data: components, error: componentError } = await supabase
      .from('components')
      .select('id')
      .eq('batch_lot_number', batchLotNumber);
      
    if (componentError) throw componentError;
    if (!components || components.length === 0) return [];
    
    // Then, get product IDs from genealogy
    const componentIds = components.map(comp => comp.id);
    const { data: links, error: linksError } = await supabase
      .from('product_genealogy')
      .select('product_id')
      .in('component_id', componentIds);
      
    if (linksError) throw linksError;
    if (!links || links.length === 0) return [];
    
    // Finally, get the actual products
    const productIds = links.map(link => link.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
      
    if (productsError) throw productsError;
    
    return products || [];
  } catch (error) {
    console.error('Error fetching affected products:', error);
    throw error;
  }
};

/**
 * Create a new product
 */
export const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return data;
};

/**
 * Create a new component
 */
export const createComponent = async (componentData: Omit<Component, 'id' | 'created_at' | 'updated_at'>): Promise<Component | null> => {
  const { data, error } = await supabase
    .from('components')
    .insert([componentData])
    .select()
    .single();

  if (error) {
    console.error('Error creating component:', error);
    throw error;
  }

  return data;
};

/**
 * Create a new genealogy link
 */
export const createGenealogyLink = async (genealogyData: Omit<ProductGenealogy, 'id' | 'created_at' | 'updated_at'>): Promise<ProductGenealogy | null> => {
  const { data, error } = await supabase
    .from('product_genealogy')
    .insert([genealogyData])
    .select()
    .single();

  if (error) {
    console.error('Error creating genealogy link:', error);
    throw error;
  }

  return data;
};

/**
 * Create a new recall
 */
export const createRecall = async (recallData: Omit<Recall, 'id' | 'created_at' | 'updated_at'>): Promise<Recall | null> => {
  const { data, error } = await supabase
    .from('recalls')
    .insert([recallData])
    .select()
    .single();

  if (error) {
    console.error('Error creating recall:', error);
    throw error;
  }

  return data;
};

/**
 * Create a new recall simulation
 */
export const createRecallSimulation = async (simulationData: Omit<RecallSimulation, 'id' | 'created_at' | 'updated_at'>): Promise<RecallSimulation | null> => {
  const { data, error } = await supabase
    .from('recall_simulations')
    .insert([simulationData])
    .select()
    .single();

  if (error) {
    console.error('Error creating recall simulation:', error);
    throw error;
  }

  return data;
};

/**
 * Create a new recall schedule
 */
export const createRecallSchedule = async (scheduleData: Omit<RecallSchedule, 'id' | 'created_at' | 'updated_at'>): Promise<RecallSchedule | null> => {
  const { data, error } = await supabase
    .from('recall_schedules')
    .insert([scheduleData])
    .select()
    .single();

  if (error) {
    console.error('Error creating recall schedule:', error);
    throw error;
  }

  return data;
};

/**
 * Create a new notification
 */
export const createNotification = async (notificationData: Omit<TraceabilityNotification, 'id' | 'created_at' | 'sent_at' | 'status'>): Promise<TraceabilityNotification | null> => {
  const { data, error } = await supabase
    .from('traceability_notifications')
    .insert([{
      ...notificationData,
      status: 'Pending'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }

  return data;
};

/**
 * Send bulk notifications for a recall
 */
export const sendBulkNotifications = async (
  recallId: string, 
  subject: string, 
  message: string, 
  createdBy: string
): Promise<boolean> => {
  try {
    // In a real app, this would send notifications to all stakeholders
    // For now, we'll just create some mock notifications
    
    const stakeholders = [
      { type: 'Supplier', email: 'supplier@example.com' },
      { type: 'Manufacturer', email: 'manufacturer@example.com' },
      { type: 'Distributor', email: 'distributor@example.com' },
      { type: 'Retailer', email: 'retailer@example.com' },
      { type: 'Regulatory', email: 'regulatory@example.com' }
    ];
    
    const notifications = stakeholders.map(stakeholder => ({
      recall_id: recallId,
      recipient_type: stakeholder.type,
      recipient_email: stakeholder.email,
      subject,
      message,
      created_by: createdBy,
      status: 'Sent'
    }));
    
    const { error } = await supabase
      .from('traceability_notifications')
      .insert(notifications);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    throw error;
  }
};
