
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ModuleHealth {
  status: 'healthy' | 'warning' | 'error';
  lastCheck: Date;
  message?: string;
}

export class ModuleConnector {
  private static instance: ModuleConnector;
  private healthStatus: Map<string, ModuleHealth> = new Map();

  private constructor() {}

  static getInstance(): ModuleConnector {
    if (!ModuleConnector.instance) {
      ModuleConnector.instance = new ModuleConnector();
    }
    return ModuleConnector.instance;
  }

  async checkModuleHealth(moduleName: string): Promise<ModuleHealth> {
    try {
      console.log(`Checking health for module: ${moduleName}`);
      
      switch (moduleName) {
        case 'database':
          const { error } = await supabase.from('profiles').select('id').limit(1);
          return {
            status: error ? 'error' : 'healthy',
            lastCheck: new Date(),
            message: error?.message
          };
          
        case 'auth':
          const { data: { session } } = await supabase.auth.getSession();
          return {
            status: session ? 'healthy' : 'warning',
            lastCheck: new Date(),
            message: session ? 'Authenticated' : 'Not authenticated'
          };
          
        case 'roles':
          const { error: rolesError } = await supabase.from('roles').select('id').limit(1);
          return {
            status: rolesError ? 'error' : 'healthy',
            lastCheck: new Date(),
            message: rolesError?.message
          };
          
        case 'documents':
          const { error: docsError } = await supabase.from('documents').select('id').limit(1);
          return {
            status: docsError ? 'error' : 'healthy',
            lastCheck: new Date(),
            message: docsError?.message
          };
          
        default:
          return {
            status: 'warning',
            lastCheck: new Date(),
            message: 'Unknown module'
          };
      }
    } catch (error) {
      return {
        status: 'error',
        lastCheck: new Date(),
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async initializeModules(): Promise<void> {
    const modules = ['database', 'auth', 'roles', 'documents'];
    
    console.log('Initializing modules:', modules);
    
    for (const module of modules) {
      const health = await this.checkModuleHealth(module);
      this.healthStatus.set(module, health);
      
      if (health.status === 'error') {
        console.error(`Module ${module} initialization failed:`, health.message);
        toast.error(`Module ${module} connection failed: ${health.message}`);
      } else {
        console.log(`Module ${module} initialized successfully`);
      }
    }
  }

  getModuleHealth(moduleName: string): ModuleHealth | undefined {
    return this.healthStatus.get(moduleName);
  }

  getAllModuleHealth(): Map<string, ModuleHealth> {
    return new Map(this.healthStatus);
  }

  async repairModule(moduleName: string): Promise<boolean> {
    console.log(`Attempting to repair module: ${moduleName}`);
    
    try {
      const health = await this.checkModuleHealth(moduleName);
      this.healthStatus.set(moduleName, health);
      
      if (health.status === 'healthy') {
        toast.success(`Module ${moduleName} repaired successfully`);
        return true;
      } else {
        toast.error(`Failed to repair module ${moduleName}: ${health.message}`);
        return false;
      }
    } catch (error) {
      console.error(`Repair failed for module ${moduleName}:`, error);
      toast.error(`Repair failed for module ${moduleName}`);
      return false;
    }
  }
}

export const moduleConnector = ModuleConnector.getInstance();
