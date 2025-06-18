
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product, Component, Recall, RecallSchedule, ProductGenealogy, RecallSimulation, TraceabilityNotification } from '@/types/traceability';

// Product operations
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.error('Failed to fetch products');
    return [];
  }
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    toast.success('Product created successfully');
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    toast.error('Failed to create product');
    return null;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Product updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    toast.error('Failed to update product');
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success('Product deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    toast.error('Failed to delete product');
    return false;
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
};

export const fetchProductByBatchLot = async (batchLot: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('batch_lot_number', `%${batchLot}%`);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching product by batch/lot:', error);
    return [];
  }
};

// Component operations
export const fetchComponents = async (): Promise<Component[]> => {
  try {
    const { data, error } = await supabase
      .from('components')
      .select(`
        *,
        supply_chain_partners:supplier_id(name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching components:', error);
    toast.error('Failed to fetch components');
    return [];
  }
};

export const createComponent = async (component: Omit<Component, 'id' | 'created_at' | 'updated_at'>): Promise<Component | null> => {
  try {
    const { data, error } = await supabase
      .from('components')
      .insert(component)
      .select()
      .single();

    if (error) throw error;
    toast.success('Component created successfully');
    return data;
  } catch (error) {
    console.error('Error creating component:', error);
    toast.error('Failed to create component');
    return null;
  }
};

export const fetchComponentById = async (id: string): Promise<Component | null> => {
  try {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching component by ID:', error);
    return null;
  }
};

// Recall operations
export const fetchRecalls = async (): Promise<Recall[]> => {
  try {
    const { data, error } = await supabase
      .from('recalls')
      .select('*')
      .order('initiated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recalls:', error);
    toast.error('Failed to fetch recalls');
    return [];
  }
};

export const createRecall = async (recall: Omit<Recall, 'id' | 'created_at' | 'updated_at'>): Promise<Recall | null> => {
  try {
    const { data, error } = await supabase
      .from('recalls')
      .insert(recall)
      .select()
      .single();

    if (error) throw error;
    
    // Create related CAPA if needed
    if (recall.recall_reason && recall.title) {
      await createRelatedCapa(data.id, recall.title, recall.recall_reason);
    }
    
    toast.success('Recall created successfully');
    return data;
  } catch (error) {
    console.error('Error creating recall:', error);
    toast.error('Failed to create recall');
    return null;
  }
};

export const fetchRecallById = async (id: string): Promise<Recall | null> => {
  try {
    const { data, error } = await supabase
      .from('recalls')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching recall by ID:', error);
    return null;
  }
};

// Genealogy operations
export const fetchProductGenealogy = async (productId: string): Promise<ProductGenealogy[]> => {
  try {
    const { data, error } = await supabase
      .from('product_genealogy')
      .select(`
        *,
        products(*),
        components(*)
      `)
      .eq('product_id', productId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching product genealogy:', error);
    return [];
  }
};

export const createGenealogyLink = async (genealogy: Omit<ProductGenealogy, 'id' | 'created_at' | 'updated_at'>): Promise<ProductGenealogy | null> => {
  try {
    const { data, error } = await supabase
      .from('product_genealogy')
      .insert(genealogy)
      .select()
      .single();

    if (error) throw error;
    toast.success('Genealogy link created successfully');
    return data;
  } catch (error) {
    console.error('Error creating genealogy link:', error);
    toast.error('Failed to create genealogy link');
    return null;
  }
};

// Traceability search functions using database functions
export const fetchProductComponents = async (productBatchLot: string): Promise<Component[]> => {
  try {
    const { data, error } = await supabase.rpc('find_product_components', {
      product_batch_lot: productBatchLot
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching product components:', error);
    return [];
  }
};

export const fetchAffectedProducts = async (componentBatchLot: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase.rpc('find_affected_products_by_component', {
      component_batch_lot: componentBatchLot
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching affected products:', error);
    return [];
  }
};

// Recall schedule operations
export const fetchRecallSchedules = async (): Promise<RecallSchedule[]> => {
  try {
    const { data, error } = await supabase
      .from('recall_schedules')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recall schedules:', error);
    return [];
  }
};

export const createRecallSchedule = async (schedule: Omit<RecallSchedule, 'id' | 'created_at' | 'updated_at'>): Promise<RecallSchedule | null> => {
  try {
    const { data, error } = await supabase
      .from('recall_schedules')
      .insert(schedule)
      .select()
      .single();

    if (error) throw error;
    toast.success('Recall schedule created successfully');
    return data;
  } catch (error) {
    console.error('Error creating recall schedule:', error);
    toast.error('Failed to create recall schedule');
    return null;
  }
};

// Simulation operations
export const fetchRecallSimulations = async (): Promise<RecallSimulation[]> => {
  try {
    const { data, error } = await supabase
      .from('recall_simulations')
      .select('*')
      .order('simulation_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recall simulations:', error);
    return [];
  }
};

export const createRecallSimulation = async (simulation: Omit<RecallSimulation, 'id' | 'created_at' | 'updated_at'>): Promise<RecallSimulation | null> => {
  try {
    const { data, error } = await supabase
      .from('recall_simulations')
      .insert(simulation)
      .select()
      .single();

    if (error) throw error;
    toast.success('Recall simulation created successfully');
    return data;
  } catch (error) {
    console.error('Error creating recall simulation:', error);
    toast.error('Failed to create recall simulation');
    return null;
  }
};

// Notification operations
export const fetchNotifications = async (): Promise<TraceabilityNotification[]> => {
  try {
    const { data, error } = await supabase
      .from('traceability_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const createNotification = async (notification: Omit<TraceabilityNotification, 'id' | 'created_at' | 'sent_at' | 'status'>): Promise<TraceabilityNotification | null> => {
  try {
    const { data, error } = await supabase
      .from('traceability_notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    toast.success('Notification created successfully');
    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    toast.error('Failed to create notification');
    return null;
  }
};

export const sendBulkNotifications = async (notifications: any[]): Promise<TraceabilityNotification[]> => {
  try {
    const { data, error } = await supabase
      .from('traceability_notifications')
      .insert(notifications)
      .select();

    if (error) throw error;
    toast.success(`${notifications.length} notifications sent successfully`);
    return data || [];
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    toast.error('Failed to send notifications');
    return [];
  }
};

// Supply chain data
export const fetchSupplyChainData = async () => {
  try {
    // Fetch products and components to build supply chain graph
    const [products, components] = await Promise.all([
      fetchProducts(),
      fetchComponents()
    ]);

    const nodes = [
      ...products.map(p => ({
        id: p.id,
        name: p.name,
        type: 'product',
        data: p
      })),
      ...components.map(c => ({
        id: c.id,
        name: c.name,
        type: 'component',
        data: c
      }))
    ];

    // Fetch genealogy links to create edges
    const { data: genealogyLinks, error } = await supabase
      .from('product_genealogy')
      .select('*');

    if (error) throw error;

    const links = genealogyLinks?.map(link => ({
      source: link.component_id,
      target: link.product_id,
      type: 'contains'
    })) || [];

    return { nodes, links };
  } catch (error) {
    console.error('Error fetching supply chain data:', error);
    return { nodes: [], links: [] };
  }
};

// CAPA integration
const createRelatedCapa = async (recallId: string, title: string, reason: string) => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .insert({
        title: `CAPA for Recall: ${title}`,
        description: `Corrective and Preventive Action required for recall due to: ${reason}`,
        source: 'Traceability',
        source_id: recallId,
        priority: 'High',
        assigned_to: 'Quality Manager',
        created_by: 'System',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        root_cause: reason
      });

    if (error) throw error;
    console.log('Related CAPA created for recall');
  } catch (error) {
    console.error('Error creating related CAPA:', error);
  }
};

export default {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProductById,
  fetchProductByBatchLot,
  fetchComponents,
  createComponent,
  fetchComponentById,
  fetchRecalls,
  createRecall,
  fetchRecallById,
  fetchRecallSchedules,
  createRecallSchedule,
  fetchRecallSimulations,
  createRecallSimulation,
  fetchNotifications,
  createNotification,
  sendBulkNotifications,
  fetchProductGenealogy,
  createGenealogyLink,
  fetchProductComponents,
  fetchAffectedProducts,
  fetchSupplyChainData
};
