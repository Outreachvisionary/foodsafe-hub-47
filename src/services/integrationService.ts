import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ModuleIntegration {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  data: any[];
  lastSync: Date;
  error?: string;
}

class IntegrationService {
  private static instance: IntegrationService;
  private moduleStatus: Map<string, ModuleIntegration> = new Map();

  private constructor() {}

  static getInstance(): IntegrationService {
    if (!IntegrationService.instance) {
      IntegrationService.instance = new IntegrationService();
    }
    return IntegrationService.instance;
  }

  async syncModule(moduleName: string): Promise<ModuleIntegration> {
    try {
      console.log(`Syncing module: ${moduleName}`);
      
      let data = [];
      let status: 'healthy' | 'warning' | 'error' = 'healthy';
      let error: string | undefined;

      switch (moduleName) {
        case 'documents':
          const { data: documents, error: docsError } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (docsError) {
            status = 'error';
            error = docsError.message;
          } else {
            data = documents || [];
          }
          break;

        case 'capa':
          const { data: capas, error: capaError } = await supabase
            .from('capa_actions')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (capaError) {
            status = 'error';
            error = capaError.message;
          } else {
            data = capas || [];
          }
          break;

        case 'non-conformance':
          const { data: ncs, error: ncError } = await supabase
            .from('non_conformances')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (ncError) {
            status = 'error';
            error = ncError.message;
          } else {
            data = ncs || [];
          }
          break;

        case 'audits':
          const { data: audits, error: auditError } = await supabase
            .from('audits')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (auditError) {
            status = 'error';
            error = auditError.message;
          } else {
            data = audits || [];
          }
          break;

        case 'complaints':
          const { data: complaints, error: complaintError } = await supabase
            .from('complaints')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (complaintError) {
            status = 'error';
            error = complaintError.message;
          } else {
            data = complaints || [];
          }
          break;

        case 'training':
          const { data: training, error: trainingError } = await supabase
            .from('training_sessions')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (trainingError) {
            status = 'warning';
            error = trainingError.message;
            data = [];
          } else {
            data = training || [];
          }
          break;

        case 'certifications':
          const { data: certifications, error: certError } = await supabase
            .from('certifications')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (certError) {
            status = 'warning';
            error = certError.message;
            data = [];
          } else {
            data = certifications || [];
          }
          break;

        case 'suppliers':
          const { data: suppliers, error: supplierError } = await supabase
            .from('supply_chain_partners')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (supplierError) {
            status = 'warning';
            error = supplierError.message;
            data = [];
          } else {
            data = suppliers || [];
          }
          break;

        case 'facilities':
          const { data: facilities, error: facilityError } = await supabase
            .from('facilities')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (facilityError) {
            status = 'warning';
            error = facilityError.message;
            data = [];
          } else {
            data = facilities || [];
          }
          break;

        default:
          status = 'warning';
          error = `Unknown module: ${moduleName}`;
          break;
      }

      const integration: ModuleIntegration = {
        name: moduleName,
        status,
        data,
        lastSync: new Date(),
        error
      };

      this.moduleStatus.set(moduleName, integration);
      
      if (status === 'error') {
        console.error(`Module ${moduleName} sync failed:`, error);
        toast.error(`${moduleName} module sync failed: ${error}`);
      } else if (status === 'warning') {
        console.warn(`Module ${moduleName} sync warning:`, error);
        toast.warning(`${moduleName} module warning: ${error}`);
      } else {
        console.log(`Module ${moduleName} synced successfully`);
      }

      return integration;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const integration: ModuleIntegration = {
        name: moduleName,
        status: 'error',
        data: [],
        lastSync: new Date(),
        error: errorMessage
      };

      this.moduleStatus.set(moduleName, integration);
      console.error(`Module ${moduleName} sync failed:`, error);
      toast.error(`${moduleName} module sync failed: ${errorMessage}`);
      
      return integration;
    }
  }

  async syncAllModules(): Promise<void> {
    const modules = [
      'documents',
      'capa', 
      'non-conformance',
      'audits',
      'complaints',
      'training',
      'certifications',
      'suppliers',
      'facilities'
    ];

    console.log('Syncing all modules:', modules);
    
    await Promise.all(modules.map(module => this.syncModule(module)));
  }

  getModuleStatus(moduleName: string): ModuleIntegration | undefined {
    return this.moduleStatus.get(moduleName);
  }

  getAllModuleStatus(): Map<string, ModuleIntegration> {
    return new Map(this.moduleStatus);
  }

  getHealthyModules(): string[] {
    return Array.from(this.moduleStatus.entries())
      .filter(([_, integration]) => integration.status === 'healthy')
      .map(([name]) => name);
  }

  getUnhealthyModules(): string[] {
    return Array.from(this.moduleStatus.entries())
      .filter(([_, integration]) => integration.status !== 'healthy')
      .map(([name]) => name);
  }

  async repairModule(moduleName: string): Promise<boolean> {
    console.log(`Attempting to repair module: ${moduleName}`);
    
    try {
      const integration = await this.syncModule(moduleName);
      
      if (integration.status === 'healthy') {
        toast.success(`Module ${moduleName} repaired successfully`);
        return true;
      } else {
        toast.error(`Failed to repair module ${moduleName}: ${integration.error}`);
        return false;
      }
    } catch (error) {
      console.error(`Repair failed for module ${moduleName}:`, error);
      toast.error(`Repair failed for module ${moduleName}`);
      return false;
    }
  }
}

export const integrationService = IntegrationService.getInstance();