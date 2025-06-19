
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  training_type: string;
  training_category?: string;
  department?: string;
  start_date?: string;
  due_date?: string;
  assigned_to: string[];
  instructor?: string;
  duration?: string;
  priority: string;
  completion_status: string;
  created_by: string;
  created_at?: string;
}

export interface TrainingRecord {
  id: string;
  session_id: string;
  employee_id: string;
  employee_name: string;
  status: string;
  assigned_date?: string;
  due_date?: string;
  completion_date?: string;
  score?: number;
}

export const useTrainingSessions = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to ensure priority field is included with default
      const transformedData = (data || []).map(item => ({
        ...item,
        priority: 'Medium' // Default priority since it's missing from DB
      }));
      
      setSessions(transformedData);
    } catch (err) {
      console.error('Error fetching training sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch training sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions
  };
};

export const useTrainingRecords = () => {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('training_records')
        .select('*')
        .order('assigned_date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching training records:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch training records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    loading,
    error,
    refetch: fetchRecords
  };
};
