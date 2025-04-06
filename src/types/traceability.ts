
// Enums for statuses and types
export type RecallStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
export type RecallType = 'Mock' | 'Actual';
export type NotificationStatus = 'Sent' | 'Failed' | 'Pending';
export type PartnerType = 'Supplier' | 'Manufacturer' | 'Distributor' | 'Retailer';
export type LinkType = 'Supplies' | 'Manufactures' | 'Distributes';

// Product interface
export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  sku?: string;
  batch_lot_number: string;
  manufacturing_date: string;
  expiry_date?: string;
  created_at?: string;
  updated_at?: string;
  created_by: string;
  status?: string;
  attributes?: Record<string, any>;
}

// Component interface
export interface Component {
  id: string;
  name: string;
  description?: string;
  category?: string;
  supplier_id?: string;
  batch_lot_number: string;
  received_date: string;
  expiry_date?: string;
  created_at?: string;
  updated_at?: string;
  created_by: string;
  status?: string;
  attributes?: Record<string, any>;
}

// ProductGenealogy interface
export interface ProductGenealogy {
  id: string;
  product_id: string;
  component_id: string;
  quantity?: number;
  created_at?: string;
  updated_at?: string;
  created_by: string;
  notes?: string;
}

// Recall interface
export interface Recall {
  id: string;
  title: string;
  description?: string;
  recall_type: RecallType;
  status: RecallStatus;
  initiated_by: string;
  initiated_at?: string;
  completed_at?: string;
  affected_products?: Record<string, any>;
  recall_reason: string;
  corrective_actions?: string;
  created_at?: string;
  updated_at?: string;
}

// RecallSimulation interface
export interface RecallSimulation {
  id: string;
  recall_id: string;
  simulation_date?: string;
  results?: Record<string, any>;
  duration?: number;
  success_rate?: number;
  bottlenecks?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

// RecallSchedule interface
export interface RecallSchedule {
  id: string;
  title: string;
  description?: string;
  recall_type: RecallType;
  one_time_date?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  recurrence_interval?: number;
  last_executed_at?: string;
  next_execution_at?: string;
  assigned_users?: string[];
  created_by: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

// Notification interface
export interface TraceabilityNotification {
  id: string;
  recall_id: string;
  recipient_type: string;
  recipient_id?: string;
  recipient_email?: string;
  subject: string;
  message: string;
  status: NotificationStatus;
  sent_at?: string;
  created_at?: string;
  created_by: string;
}

// SupplyChainPartner interface
export interface SupplyChainPartner {
  id: string;
  name: string;
  partner_type: PartnerType;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
  created_by: string;
  status?: string;
}

// SupplyChainLink interface
export interface SupplyChainLink {
  id: string;
  source_id: string;
  target_id: string;
  product_id?: string;
  component_id?: string;
  link_type: LinkType;
  created_at?: string;
  updated_at?: string;
  created_by: string;
}

// Node interface for genealogy tree visualization
export interface TreeNode {
  id: string;
  name: string;
  type: 'product' | 'component';
  data?: Product | Component;
  children?: TreeNode[];
}

// Graph node and edge interfaces for supply chain visualization
export interface GraphNode {
  id: string;
  label: string;
  type: PartnerType;
  data?: SupplyChainPartner;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: LinkType;
  data?: SupplyChainLink;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
