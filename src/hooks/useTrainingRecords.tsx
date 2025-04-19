import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingRecord, ExtendedTrainingRecord, TrainingStatus } from '@/types/training';
import { useToast } from '@/components/ui/use-toast';

interface TrainingStats {
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  overdueCount: number;
  totalCount: number;
}

export function useTrainingRecords() {
  const [records, setRecords] = useState<ExtendedTrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  const stats = useMemo<TrainingStats>(() => {
    const completedCount = records.filter(r => r.status === 'Completed').length;
    const inProgressCount = records.filter(r => r.status === 'In Progress').length;
    const notStartedCount = records.filter(r => r.status === 'Not Started').length;
    const overdueCount = records.filter(r => r.status === 'Overdue').length;
    
    return {
      completedCount,
      inProgressCount,
      notStartedCount,
      overdueCount,
      totalCount: records.length
    };
  }, [records]);
  
  const fetchTrainingRecords = async () => {
    try {
      setLoading(true);
      
      // In a real app, join with course data
      const { data, error: fetchError } = await supabase
        .from('training_records')
        .select('*')
        .order('due_date', { ascending: true });
        
      if (fetchError) throw fetchError;
      
      // Process data to add course name (mock version)
      const extendedRecords: ExtendedTrainingRecord[] = (data || []).map(record => {
        // Here you would normally get course name from a courses JOIN
        const courseName = `Course ${record.session_id.substring(0, 4)}`;
        const instructorName = `Instructor ${record.employee_id.substring(0, 3)}`;
        
        // Check for overdue status
        let status = record.status as TrainingStatus;
        if (status !== 'Completed' && new Date(record.due_date) < new Date()) {
          status = 'Overdue';
        }
        
        return {
          ...record,
          courseName,
          instructorName,
          status,
          created_at: record.created_at || new Date().toISOString(),
          updated_at: record.updated_at || new Date().toISOString()
        };
      });
      
      setRecords(extendedRecords);
    } catch (err) {
      console.error('Error fetching training records:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch training records'));
      toast({
        title: 'Error',
        description: 'Failed to load training records',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTrainingRecords();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('training-records-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'training_records' 
      }, () => {
        fetchTrainingRecords();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  const updateTrainingRecord = async (recordId: string, updates: Partial<TrainingRecord>): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('training_records')
        .update(updates)
        .eq('id', recordId);
        
      if (updateError) throw updateError;
      
      // Update local state
      setRecords(prev => 
        prev.map(record => 
          record.id === recordId 
            ? { ...record, ...updates } 
            : record
        )
      );
      
      toast({
        title: 'Success',
        description: 'Training record updated successfully',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating training record:', err);
      toast({
        title: 'Error',
        description: 'Failed to update training record',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  return {
    records,
    loading,
    error,
    stats,
    updateTrainingRecord,
    refreshRecords: fetchTrainingRecords
  };
}
