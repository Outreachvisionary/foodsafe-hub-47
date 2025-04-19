
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedTrainingRecord, TrainingStatus } from '@/types/training';

const useTrainingRecords = (employeeId?: string) => {
  const [trainingRecords, setTrainingRecords] = useState<ExtendedTrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrainingRecords = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('training_records')
        .select(`
          *,
          training_sessions(title, instructor_name)
        `)
        .order('due_date', { ascending: false });
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match ExtendedTrainingRecord type
      const transformedData: ExtendedTrainingRecord[] = (data || []).map(record => {
        // Handle possible null values and provide fallbacks
        const sessionInfo = record.training_sessions || {};
        
        return {
          id: record.id,
          employee_id: record.employee_id,
          session_id: record.session_id,
          status: record.status as TrainingStatus,
          completion_date: record.completion_date,
          score: record.score,
          due_date: record.due_date,
          notes: record.notes,
          assigned_date: record.assigned_date,
          courseName: sessionInfo.title || 'Unknown Course',
          instructorName: sessionInfo.instructor_name || 'Not Assigned',
          created_at: record.created_at || new Date().toISOString(),
          updated_at: record.updated_at || new Date().toISOString()
        };
      });
      
      setTrainingRecords(transformedData);
    } catch (err) {
      console.error('Error fetching training records:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch training records'));
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchTrainingRecords();
  }, [fetchTrainingRecords]);

  return {
    trainingRecords,
    loading,
    error,
    refresh: fetchTrainingRecords
  };
};

export default useTrainingRecords;
