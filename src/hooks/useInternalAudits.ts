
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Database audit interface that matches the actual DB schema
export interface DatabaseAudit {
  id: string;
  title: string;
  status: string;
  start_date: string;
  due_date: string;
  completion_date?: string;
  audit_type: string;
  assigned_to: string;
  created_by: string;
  description?: string;
  findings_count: number;
  related_standard?: string;
  location?: string;
  department?: string;
  created_at?: string;
  updated_at?: string;
}

export const useInternalAudits = () => {
  const [audits, setAudits] = useState<DatabaseAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAudits(data || []);
    } catch (err) {
      console.error('Error fetching audits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch audits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  return {
    audits,
    loading,
    error,
    refetch: fetchAudits,
    loadAudits: fetchAudits // Alias for compatibility
  };
};
