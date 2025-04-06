
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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

// Products CRUD operations
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.error('Failed to load products');
    return [];
  }
};

export const fetchProductById = async (productId: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) throw error;
    return data as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    toast.error('Failed to load product details');
    return null;
  }
};

export const fetchProductByBatchLot = async (batchLotNumber: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('batch_lot_number', batchLotNumber)
      .single();
    
    if (error) throw error;
    return data as Product;
  } catch (error) {
    console.error('Error fetching product by batch/lot:', error);
    toast.error('Failed to load product details');
    return null;
  }
};

export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Product created successfully');
    return data as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    toast.error('Failed to create product');
    return null;
  }
};

export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Product updated successfully');
    return data as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    toast.error('Failed to update product');
    return null;
  }
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) throw error;
    toast.success('Product deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    toast.error('Failed to delete product');
    return false;
  }
};

// Components CRUD operations
export const fetchComponents = async (): Promise<Component[]> => {
  try {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Component[];
  } catch (error) {
    console.error('Error fetching components:', error);
    toast.error('Failed to load components');
    return [];
  }
};

export const fetchComponentById = async (componentId: string): Promise<Component | null> => {
  try {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('id', componentId)
      .single();
    
    if (error) throw error;
    return data as Component;
  } catch (error) {
    console.error('Error fetching component:', error);
    toast.error('Failed to load component details');
    return null;
  }
};

export const createComponent = async (componentData: Omit<Component, 'id'>): Promise<Component | null> => {
  try {
    const { data, error } = await supabase
      .from('components')
      .insert(componentData)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Component created successfully');
    return data as Component;
  } catch (error) {
    console.error('Error creating component:', error);
    toast.error('Failed to create component');
    return null;
  }
};

export const updateComponent = async (componentId: string, componentData: Partial<Component>): Promise<Component | null> => {
  try {
    const { data, error } = await supabase
      .from('components')
      .update(componentData)
      .eq('id', componentId)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Component updated successfully');
    return data as Component;
  } catch (error) {
    console.error('Error updating component:', error);
    toast.error('Failed to update component');
    return null;
  }
};

export const deleteComponent = async (componentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', componentId);
    
    if (error) throw error;
    toast.success('Component deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting component:', error);
    toast.error('Failed to delete component');
    return false;
  }
};

// Product Genealogy operations
export const fetchProductGenealogy = async (productId: string): Promise<ProductGenealogy[]> => {
  try {
    const { data, error } = await supabase
      .from('product_genealogy')
      .select('*')
      .eq('product_id', productId);
    
    if (error) throw error;
    return data as ProductGenealogy[];
  } catch (error) {
    console.error('Error fetching product genealogy:', error);
    toast.error('Failed to load product genealogy');
    return [];
  }
};

export const createProductGenealogy = async (genealogyData: Omit<ProductGenealogy, 'id'>): Promise<ProductGenealogy | null> => {
  try {
    const { data, error } = await supabase
      .from('product_genealogy')
      .insert(genealogyData)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Product genealogy created successfully');
    return data as ProductGenealogy;
  } catch (error) {
    console.error('Error creating product genealogy:', error);
    toast.error('Failed to create product genealogy');
    return null;
  }
};

export const deleteProductGenealogy = async (genealogyId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('product_genealogy')
      .delete()
      .eq('id', genealogyId);
    
    if (error) throw error;
    toast.success('Product genealogy link deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting product genealogy:', error);
    toast.error('Failed to delete product genealogy link');
    return false;
  }
};

// Build genealogy tree
export const buildGenealogyTree = async (productId: string): Promise<TreeNode | null> => {
  try {
    // Get the product
    const product = await fetchProductById(productId);
    if (!product) return null;
    
    // Get all genealogy links for this product
    const genealogyLinks = await fetchProductGenealogy(productId);
    
    // Create the root node
    const rootNode: TreeNode = {
      id: product.id,
      name: `${product.name} (${product.batch_lot_number})`,
      type: 'product',
      data: product,
      children: []
    };
    
    // If there are no components, return just the product node
    if (genealogyLinks.length === 0) {
      return rootNode;
    }
    
    // Get all components for this product
    const componentIds = genealogyLinks.map(link => link.component_id);
    const { data: components, error } = await supabase
      .from('components')
      .select('*')
      .in('id', componentIds);
    
    if (error) throw error;
    
    // Add component nodes as children
    rootNode.children = components.map(component => ({
      id: component.id,
      name: `${component.name} (${component.batch_lot_number})`,
      type: 'component',
      data: component,
    }));
    
    return rootNode;
  } catch (error) {
    console.error('Error building genealogy tree:', error);
    toast.error('Failed to build genealogy tree');
    return null;
  }
};

// Recalls CRUD operations
export const fetchRecalls = async (): Promise<Recall[]> => {
  try {
    const { data, error } = await supabase
      .from('recalls')
      .select('*')
      .order('initiated_at', { ascending: false });
    
    if (error) throw error;
    return data as Recall[];
  } catch (error) {
    console.error('Error fetching recalls:', error);
    toast.error('Failed to load recalls');
    return [];
  }
};

export const fetchRecallById = async (recallId: string): Promise<Recall | null> => {
  try {
    const { data, error } = await supabase
      .from('recalls')
      .select('*')
      .eq('id', recallId)
      .single();
    
    if (error) throw error;
    return data as Recall;
  } catch (error) {
    console.error('Error fetching recall:', error);
    toast.error('Failed to load recall details');
    return null;
  }
};

export const createRecall = async (recallData: Omit<Recall, 'id'>): Promise<Recall | null> => {
  try {
    const { data, error } = await supabase
      .from('recalls')
      .insert(recallData)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Recall created successfully');
    return data as Recall;
  } catch (error) {
    console.error('Error creating recall:', error);
    toast.error('Failed to create recall');
    return null;
  }
};

export const updateRecall = async (recallId: string, recallData: Partial<Recall>): Promise<Recall | null> => {
  try {
    const { data, error } = await supabase
      .from('recalls')
      .update(recallData)
      .eq('id', recallId)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Recall updated successfully');
    return data as Recall;
  } catch (error) {
    console.error('Error updating recall:', error);
    toast.error('Failed to update recall');
    return null;
  }
};

export const deleteRecall = async (recallId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('recalls')
      .delete()
      .eq('id', recallId);
    
    if (error) throw error;
    toast.success('Recall deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting recall:', error);
    toast.error('Failed to delete recall');
    return false;
  }
};

// Recall Simulations operations
export const createRecallSimulation = async (simulationData: Omit<RecallSimulation, 'id'>): Promise<RecallSimulation | null> => {
  try {
    const { data, error } = await supabase
      .from('recall_simulations')
      .insert(simulationData)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Recall simulation created successfully');
    return data as RecallSimulation;
  } catch (error) {
    console.error('Error creating recall simulation:', error);
    toast.error('Failed to create recall simulation');
    return null;
  }
};

export const fetchRecallSimulations = async (recallId: string): Promise<RecallSimulation[]> => {
  try {
    const { data, error } = await supabase
      .from('recall_simulations')
      .select('*')
      .eq('recall_id', recallId)
      .order('simulation_date', { ascending: false });
    
    if (error) throw error;
    return data as RecallSimulation[];
  } catch (error) {
    console.error('Error fetching recall simulations:', error);
    toast.error('Failed to load recall simulations');
    return [];
  }
};

// Recall Schedules CRUD operations
export const fetchRecallSchedules = async (): Promise<RecallSchedule[]> => {
  try {
    const { data, error } = await supabase
      .from('recall_schedules')
      .select('*')
      .order('next_execution_at', { ascending: true });
    
    if (error) throw error;
    return data as RecallSchedule[];
  } catch (error) {
    console.error('Error fetching recall schedules:', error);
    toast.error('Failed to load recall schedules');
    return [];
  }
};

export const createRecallSchedule = async (scheduleData: Omit<RecallSchedule, 'id'>): Promise<RecallSchedule | null> => {
  try {
    const { data, error } = await supabase
      .from('recall_schedules')
      .insert(scheduleData)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Recall schedule created successfully');
    return data as RecallSchedule;
  } catch (error) {
    console.error('Error creating recall schedule:', error);
    toast.error('Failed to create recall schedule');
    return null;
  }
};

export const updateRecallSchedule = async (scheduleId: string, scheduleData: Partial<RecallSchedule>): Promise<RecallSchedule | null> => {
  try {
    const { data, error } = await supabase
      .from('recall_schedules')
      .update(scheduleData)
      .eq('id', scheduleId)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Recall schedule updated successfully');
    return data as RecallSchedule;
  } catch (error) {
    console.error('Error updating recall schedule:', error);
    toast.error('Failed to update recall schedule');
    return null;
  }
};

export const deleteRecallSchedule = async (scheduleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('recall_schedules')
      .delete()
      .eq('id', scheduleId);
    
    if (error) throw error;
    toast.success('Recall schedule deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting recall schedule:', error);
    toast.error('Failed to delete recall schedule');
    return false;
  }
};

// Notifications operations
export const sendNotification = async (notificationData: Omit<TraceabilityNotification, 'id' | 'status' | 'sent_at'>): Promise<TraceabilityNotification | null> => {
  try {
    // Create the notification with pending status
    const newNotification = {
      ...notificationData,
      status: 'Pending' as NotificationStatus,
    };
    
    const { data, error } = await supabase
      .from('traceability_notifications')
      .insert(newNotification)
      .select()
      .single();
    
    if (error) throw error;
    
    // In a real implementation, you would send the actual email/notification here
    // For now, we'll simulate by updating the status after a delay
    setTimeout(async () => {
      const { error: updateError } = await supabase
        .from('traceability_notifications')
        .update({
          status: 'Sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', data.id);
      
      if (updateError) {
        console.error('Error updating notification status:', updateError);
      }
    }, 2000);
    
    toast.success('Notification sent successfully');
    return data as TraceabilityNotification;
  } catch (error) {
    console.error('Error sending notification:', error);
    toast.error('Failed to send notification');
    return null;
  }
};

export const fetchNotifications = async (recallId: string): Promise<TraceabilityNotification[]> => {
  try {
    const { data, error } = await supabase
      .from('traceability_notifications')
      .select('*')
      .eq('recall_id', recallId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as TraceabilityNotification[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    toast.error('Failed to load notifications');
    return [];
  }
};

// Supply Chain Partners CRUD operations
export const fetchSupplyChainPartners = async (): Promise<SupplyChainPartner[]> => {
  try {
    const { data, error } = await supabase
      .from('supply_chain_partners')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as SupplyChainPartner[];
  } catch (error) {
    console.error('Error fetching supply chain partners:', error);
    toast.error('Failed to load supply chain partners');
    return [];
  }
};

export const createSupplyChainPartner = async (partnerData: Omit<SupplyChainPartner, 'id'>): Promise<SupplyChainPartner | null> => {
  try {
    const { data, error } = await supabase
      .from('supply_chain_partners')
      .insert(partnerData)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Supply chain partner created successfully');
    return data as SupplyChainPartner;
  } catch (error) {
    console.error('Error creating supply chain partner:', error);
    toast.error('Failed to create supply chain partner');
    return null;
  }
};

// Supply Chain Links operations
export const fetchSupplyChainLinks = async (productId?: string): Promise<SupplyChainLink[]> => {
  try {
    let query = supabase
      .from('supply_chain_links')
      .select('*');
    
    if (productId) {
      query = query.eq('product_id', productId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as SupplyChainLink[];
  } catch (error) {
    console.error('Error fetching supply chain links:', error);
    toast.error('Failed to load supply chain links');
    return [];
  }
};

export const createSupplyChainLink = async (linkData: Omit<SupplyChainLink, 'id'>): Promise<SupplyChainLink | null> => {
  try {
    const { data, error } = await supabase
      .from('supply_chain_links')
      .insert(linkData)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Supply chain link created successfully');
    return data as SupplyChainLink;
  } catch (error) {
    console.error('Error creating supply chain link:', error);
    toast.error('Failed to create supply chain link');
    return null;
  }
};

// Build supply chain visualization
export const buildSupplyChainVisualization = async (productId: string): Promise<GraphData | null> => {
  try {
    // Get all supply chain links related to this product
    const links = await fetchSupplyChainLinks(productId);
    
    if (links.length === 0) {
      toast.warning('No supply chain data found for this product');
      return null;
    }
    
    // Extract all unique partner IDs from the links
    const partnerIds = Array.from(new Set([
      ...links.map(link => link.source_id),
      ...links.map(link => link.target_id)
    ]));
    
    // Fetch all partners
    const { data: partners, error } = await supabase
      .from('supply_chain_partners')
      .select('*')
      .in('id', partnerIds);
    
    if (error) throw error;
    
    // Create nodes and edges for the graph data
    const nodes: GraphNode[] = partners.map(partner => ({
      id: partner.id,
      label: partner.name,
      type: partner.partner_type as PartnerType,
      data: partner
    }));
    
    const edges: GraphEdge[] = links.map(link => ({
      id: link.id,
      source: link.source_id,
      target: link.target_id,
      label: link.link_type as LinkType,
      data: link
    }));
    
    return { nodes, edges };
  } catch (error) {
    console.error('Error building supply chain visualization:', error);
    toast.error('Failed to build supply chain visualization');
    return null;
  }
};

// Find affected products by component batch/lot
export const findAffectedProductsByComponent = async (componentBatchLot: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .rpc('find_affected_products_by_component', { component_batch_lot: componentBatchLot });
    
    if (error) throw error;
    return data as Product[];
  } catch (error) {
    console.error('Error finding affected products:', error);
    toast.error('Failed to find affected products');
    return [];
  }
};

// Find component ancestors of a product
export const findProductComponents = async (productBatchLot: string): Promise<Component[]> => {
  try {
    const { data, error } = await supabase
      .rpc('find_product_components', { product_batch_lot: productBatchLot });
    
    if (error) throw error;
    return data as Component[];
  } catch (error) {
    console.error('Error finding product components:', error);
    toast.error('Failed to find product components');
    return [];
  }
};

// Send notifications to all stakeholders for a recall
export const sendBulkNotifications = async (
  recallId: string, 
  subject: string, 
  message: string, 
  createdBy: string
): Promise<boolean> => {
  try {
    // Get the recall details
    const recall = await fetchRecallById(recallId);
    if (!recall) throw new Error('Recall not found');
    
    // Get all supply chain partners (in a real implementation, you would filter to relevant ones)
    const partners = await fetchSupplyChainPartners();
    
    // Create notifications in bulk
    const notifications = partners.map(partner => ({
      recall_id: recallId,
      recipient_type: partner.partner_type,
      recipient_id: partner.id,
      recipient_email: partner.contact_email || undefined,
      subject,
      message,
      created_by: createdBy
    }));
    
    // Insert all notifications
    const { error } = await supabase
      .from('traceability_notifications')
      .insert(notifications);
    
    if (error) throw error;
    
    toast.success(`Notifications sent to ${partners.length} recipients`);
    return true;
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    toast.error('Failed to send notifications to all stakeholders');
    return false;
  }
};
