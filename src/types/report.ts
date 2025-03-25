
export type ReportCategory = 
  | 'documents' 
  | 'audits' 
  | 'capa' 
  | 'training' 
  | 'complaints' 
  | 'haccp';

export type ReportFormat = 
  | 'pdf' 
  | 'excel' 
  | 'csv' 
  | 'html' 
  | 'xml';

export type ReportFrequency = 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'quarterly' 
  | 'yearly' 
  | 'custom';

export type ReportStatus = 
  | 'draft' 
  | 'active' 
  | 'inactive' 
  | 'archived';

export type VisualizationType = 
  | 'table' 
  | 'bar' 
  | 'pie' 
  | 'line' 
  | 'area' 
  | 'scatter';

export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'greater_than' 
  | 'less_than' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with' 
  | 'is_empty' 
  | 'is_not_empty';

export interface ReportDefinition {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isTemplate: boolean;
  isFavorite?: boolean;
  columns: string[];
  filters?: ReportFilter[];
  visualization: VisualizationConfig;
  format: ReportFormat;
  schedule?: ReportSchedule;
}

export interface ReportFilter {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | Date | null;
}

export interface VisualizationConfig {
  type: VisualizationType;
  xAxis?: string;
  yAxis?: string;
  showLegend: boolean;
  showGrid: boolean;
  showLabels: boolean;
  colors?: string[];
}

export interface ReportSchedule {
  id: string;
  reportId: string;
  frequency: ReportFrequency;
  day?: string;
  time: string;
  startDate: string;
  endDate?: string;
  lastRunAt?: string;
  nextRunAt: string;
  recipients: string[];
  status: ReportStatus;
  format: ReportFormat;
  notifyOnFailure: boolean;
}

export interface ReportExecution {
  id: string;
  reportId: string;
  scheduleId?: string;
  executedAt: string;
  executedBy: string;
  status: 'success' | 'failure';
  errorMessage?: string;
  fileUrl?: string;
  duration: number;
  recipients?: string[];
}

export interface ReportMetrics {
  totalReports: number;
  activeSchedules: number;
  favoriteReports: number;
  recentExecutions: number;
  successRate: number;
  mostUsedTemplates: Array<{
    templateId: string;
    title: string;
    usageCount: number;
  }>;
}

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  isSystemTemplate: boolean;
  usageCount: number;
  lastUsed?: string;
  definition: ReportDefinition;
}
