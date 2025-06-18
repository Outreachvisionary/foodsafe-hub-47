
export interface DashboardStats {
  complaints: number;
  nonConformances: number;
  capas: number;
  documents: number;
  loading: boolean;
  error: string | null;
}

export interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  authentication: 'healthy' | 'warning' | 'error';
  services: 'healthy' | 'warning' | 'error';
  overall: 'healthy' | 'warning' | 'error';
}

export interface DashboardMetrics {
  totalUsers: number;
  activeIssues: number;
  completionRate: number;
  complianceScore: number;
  trends: {
    complaints: number;
    capas: number;
    documents: number;
  };
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  disabled?: boolean;
}
