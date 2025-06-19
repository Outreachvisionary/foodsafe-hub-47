
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Audit {
  id: string;
  title: string;
  description?: string;
  status: string;
  audit_type: string;
  assigned_to: string;
  start_date: string;
  due_date: string;
  completion_date?: string;
  location?: string;
  findings_count: number;
  department?: string;
  created_by: string;
  created_at?: string;
}

export const useAudits = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
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
    refetch: fetchAudits
  };
};
