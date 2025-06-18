
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

class OptimizedDatabaseService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  // Cache management
  private setCache(key: string, data: any, ttl: number = this.DEFAULT_TTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getCache(key: string) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private clearCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Enhanced auth check with better error handling
  async checkAuth(): Promise<boolean> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Auth check error:', error);
        return false;
      }
      return !!user;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }

  // Optimized data fetching with caching
  async getComplaints(useCache: boolean = true) {
    const cacheKey = 'complaints';
    
    if (useCache) {
      const cached = this.getCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('reported_date', { ascending: false });

      if (error) throw error;
      
      this.setCache(cacheKey, data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
      return [];
    }
  }

  async getCAPAs(useCache: boolean = true) {
    const cacheKey = 'capas';
    
    if (useCache) {
      const cached = this.getCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const { data, error } = await supabase
        .from('capa_actions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      this.setCache(cacheKey, data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching CAPAs:', error);
      toast.error('Failed to load CAPAs');
      return [];
    }
  }

  async getNonConformances(useCache: boolean = true) {
    const cacheKey = 'non_conformances';
    
    if (useCache) {
      const cached = this.getCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const { data, error } = await supabase
        .from('non_conformances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      this.setCache(cacheKey, data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching non-conformances:', error);
      toast.error('Failed to load non-conformances');
      return [];
    }
  }

  async getDocuments(useCache: boolean = true) {
    const cacheKey = 'documents';
    
    if (useCache) {
      const cached = this.getCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      this.setCache(cacheKey, data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
      return [];
    }
  }

  // Batch operations for better performance
  async getDashboardData() {
    const cacheKey = 'dashboard_data';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const [complaints, capas, nonConformances, documents] = await Promise.allSettled([
        this.getComplaints(false),
        this.getCAPAs(false),
        this.getNonConformances(false),
        this.getDocuments(false)
      ]);

      const result = {
        complaints: complaints.status === 'fulfilled' ? complaints.value : [],
        capas: capas.status === 'fulfilled' ? capas.value : [],
        nonConformances: nonConformances.status === 'fulfilled' ? nonConformances.value : [],
        documents: documents.status === 'fulfilled' ? documents.value : []
      };

      this.setCache(cacheKey, result, 2 * 60 * 1000); // 2 minutes TTL for dashboard
      return result;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Health check with comprehensive testing
  async performHealthCheck() {
    const results = {
      auth: false,
      database: false,
      tables: {
        complaints: false,
        capas: false,
        nonConformances: false,
        documents: false
      },
      performance: {
        authTime: 0,
        queryTime: 0
      }
    };

    try {
      // Test auth
      const authStart = Date.now();
      results.auth = await this.checkAuth();
      results.performance.authTime = Date.now() - authStart;

      if (!results.auth) {
        return results;
      }

      // Test database connectivity and table access
      const queryStart = Date.now();
      const tableTests = await Promise.allSettled([
        supabase.from('complaints').select('count').limit(1),
        supabase.from('capa_actions').select('count').limit(1),
        supabase.from('non_conformances').select('count').limit(1),
        supabase.from('documents').select('count').limit(1)
      ]);

      results.tables.complaints = tableTests[0].status === 'fulfilled';
      results.tables.capas = tableTests[1].status === 'fulfilled';
      results.tables.nonConformances = tableTests[2].status === 'fulfilled';
      results.tables.documents = tableTests[3].status === 'fulfilled';

      results.database = Object.values(results.tables).every(Boolean);
      results.performance.queryTime = Date.now() - queryStart;

    } catch (error) {
      console.error('Health check failed:', error);
    }

    return results;
  }

  // Cache management methods
  invalidateCache(pattern?: string) {
    this.clearCache(pattern);
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const optimizedDatabaseService = new OptimizedDatabaseService();
