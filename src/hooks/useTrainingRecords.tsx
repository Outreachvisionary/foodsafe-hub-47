import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTrainingRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('training_records')
        .select(`
          *,
          employee:employee_id(*),
          session:session_id(
            *,
            training:training_id(*)
          )
        `)
        .order('completed_date', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to a more usable format
      const transformedData = data.map(transformSessionRecord);
      setRecords(transformedData);
    } catch (err) {
      console.error('Error fetching training records:', err);
      setError(err.message);
      toast({
        title: 'Error fetching records',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const transformSessionRecord = (record: any) => {
    // If record doesn't have session data, return a basic object
    if (!record.session) {
      return {
        id: record.id,
        title: 'Unknown Session', // Provide a default title
        status: record.status,
        // ... other properties with defaults as needed
      };
    }
    
    return {
      id: record.id,
      title: record.session?.training?.title || 'Untitled Training',
      employeeId: record.employee_id,
      employeeName: record.employee ? `${record.employee.first_name} ${record.employee.last_name}` : 'Unknown Employee',
      sessionId: record.session_id,
      sessionDate: record.session?.session_date,
      trainingId: record.session?.training_id,
      trainingType: record.session?.training?.type,
      status: record.status,
      score: record.score,
      completedDate: record.completed_date,
      notes: record.notes,
      isRequired: record.session?.training?.is_required,
      expiresAt: record.expires_at,
      department: record.employee?.department,
      position: record.employee?.position,
      instructor: record.session?.instructor,
      location: record.session?.location,
      duration: record.session?.duration_hours,
    };
  };

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (newRecord) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('training_records')
        .insert(newRecord)
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Record added',
        description: 'Training record has been added successfully',
      });
      
      // Refresh records
      fetchRecords();
      return data;
    } catch (err) {
      console.error('Error adding training record:', err);
      toast({
        title: 'Error adding record',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (id, updates) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('training_records')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Record updated',
        description: 'Training record has been updated successfully',
      });
      
      // Refresh records
      fetchRecords();
      return data;
    } catch (err) {
      console.error('Error updating training record:', err);
      toast({
        title: 'Error updating record',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('training_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Record deleted',
        description: 'Training record has been deleted successfully',
      });
      
      // Refresh records
      fetchRecords();
    } catch (err) {
      console.error('Error deleting training record:', err);
      toast({
        title: 'Error deleting record',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    records,
    loading,
    error,
    fetchRecords,
    addRecord,
    updateRecord,
    deleteRecord
  };
};
