
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ExtendedTrainingRecord } from '@/types/training';
import { supabase } from '@/integrations/supabase/client';

export function useTrainingRecords() {
  const [records, setRecords] = useState<ExtendedTrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrainingRecords = async () => {
      try {
        setLoading(true);
        
        // Fetch training records from Supabase
        const { data: recordsData, error: recordsError } = await supabase
          .from('training_records')
          .select('*')
          .order('assigned_date', { ascending: false });
          
        if (recordsError) throw recordsError;

        // Fetch training sessions to get course names
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('training_sessions')
          .select('id, title');
          
        if (sessionsError) throw sessionsError;

        // Map sessions to a lookup object for easier access
        const sessionsMap = (sessionsData || []).reduce((acc, session) => {
          acc[session.id] = session.title;
          return acc;
        }, {} as Record<string, string>);

        // Transform the records with additional info
        const extendedRecords: ExtendedTrainingRecord[] = (recordsData || []).map(record => ({
          ...record,
          courseName: sessionsMap[record.session_id] || 'Unknown Course',
          instructorName: record.session_id ? 'Assigned Instructor' : 'Not Assigned'
        }));

        setRecords(extendedRecords);
      } catch (err) {
        console.error('Error fetching training records:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch training records'));
        toast({
          title: 'Error',
          description: 'Failed to load training records. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingRecords();
  }, [toast]);

  const updateTrainingRecord = async (
    recordId: string, 
    updates: Partial<ExtendedTrainingRecord>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Remove extended properties before sending to Supabase
      const { courseName, instructorName, ...recordUpdates } = updates;
      
      const { error } = await supabase
        .from('training_records')
        .update(recordUpdates)
        .eq('id', recordId);
        
      if (error) throw error;
      
      // Update the local state
      setRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === recordId ? { ...record, ...updates } : record
        )
      );
      
      toast({
        title: 'Success',
        description: 'Training record updated successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating training record:', err);
      toast({
        title: 'Error',
        description: 'Failed to update training record. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Analytics helpers
  const getStatsByStatus = () => {
    const completedCount = records.filter(r => r.status === "Completed").length;
    const inProgressCount = records.filter(r => r.status === "In Progress").length;
    const notStartedCount = records.filter(r => r.status === "Not Started").length;
    const overdueCount = records.filter(r => r.status === "Overdue").length;
    
    return {
      completedCount,
      inProgressCount,
      notStartedCount,
      overdueCount,
      totalCount: records.length
    };
  };

  return {
    records,
    loading,
    error,
    updateTrainingRecord,
    stats: getStatsByStatus()
  };
}
