
import { CAPAStatus } from './enums';

export enum NCStatus {
  Draft = 'Draft',
  Open = 'Open',
  InProgress = 'In_Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
  OnHold = 'On_Hold',
  Reopened = 'Reopened'
}

export enum NCRiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum NCCategory {
  Equipment = 'Equipment',
  Process = 'Process',
  Material = 'Material',
  Method = 'Method',
  Environment = 'Environment',
  Personnel = 'Personnel',
  Other = 'Other'
}

export interface NonConformance {
  id: string;
  title: string;
  description: string;
  status: NCStatus;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to: string;
  department: string;
  location: string;
  root_cause?: string;
  item_name: string;
  item_category: string;
  risk_level: NCRiskLevel;
  severity?: string;
  immediate_action?: string;
  corrective_action?: string;
  preventive_action?: string;
  capa_id?: string;
  attachments?: string[];
  due_date?: string;
  closed_date?: string;
}

export interface NCDetailsProps {
  id: string;
  title: string;
  status: NCStatus;
  itemName: string;
  itemCategory: string;
  description: string;
  onStatusChange?: (status: NCStatus) => void;
}
