
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingStatus } from '@/types/enums';
import { trainingStatusToString, stringToTrainingStatus } from '@/utils/typeAdapters';

interface TrainingSession {
  id: string;
  title: string;
  description: string;
  start_date: string;
  due_date: string;
  created_by: string;
  department: string;
  created_at: string;
  updated_at: string;
}

interface TrainingRecord {
  id: string;
  session_id: string;
  employee_id: string;
  employee_name: string;
  status: TrainingStatus;
  assigned_date: string;
  due_date: string;
  completion_date: string | null;
  score: number | null;
  pass_threshold: number;
  notes: string | null;
  last_recurrence: string | null;
  next_recurrence: string | null;
}

export const useTrainingSessions = () => {
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainingSessions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('training_sessions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        // Map database fields to interface properties
        const sessions: TrainingSession[] = (data || []).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          start_date: item.start_date,
          due_date: item.due_date || item.start_date,
          created_by: item.created_by || 'TBD',
          department: item.department || 'General',
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));

        setTrainingSessions(sessions);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTrainingRecords = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('training_records')
          .select('*')
          .order('assigned_date', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        setTrainingRecords(data?.map(record => ({
          ...record,
          status: stringToTrainingStatus(record.status)
        })) || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingSessions();
    fetchTrainingRecords();
  }, []);

  const createTrainingRecord = async (sessionId: string, employeeId: string, employeeName: string) => {
    try {
      const newRecord = {
        session_id: sessionId,
        employee_id: employeeId,
        employee_name: employeeName,
        status: trainingStatusToString(TrainingStatus.Not_Started),
        assigned_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        completion_date: null,
        score: null,
        pass_threshold: 80,
        notes: null,
        last_recurrence: null,
        next_recurrence: null,
      };

      const { data, error } = await supabase
        .from('training_records')
        .insert(newRecord)
        .select()
        .single();

      if (error) throw error;

      const transformedRecord: TrainingRecord = {
        ...data,
        status: stringToTrainingStatus(data.status)
      };

      setTrainingRecords(prevRecords => [...prevRecords, transformedRecord]);
      return transformedRecord;
    } catch (error) {
      console.error('Error creating training record:', error);
      throw error;
    }
  };

  const updateTrainingRecord = async (recordId: string, updates: Partial<TrainingRecord>) => {
    try {
      setLoading(true);
      
      // Convert status to string for database and remove undefined values
      const dbUpdates: any = {};
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'status' && value) {
            dbUpdates[key] = trainingStatusToString(value as TrainingStatus);
          } else {
            dbUpdates[key] = value;
          }
        }
      });
      
      const { data, error } = await supabase
        .from('training_records')
        .update(dbUpdates)
        .eq('id', recordId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setTrainingRecords(prevRecords =>
        prevRecords.map(record => (record.id === recordId ? { ...record, ...data, status: stringToTrainingStatus(data.status) } : record))
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrainingRecord = async (recordId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('training_records')
        .delete()
        .eq('id', recordId);

      if (error) {
        throw new Error(error.message);
      }

      setTrainingRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    trainingSessions,
    trainingRecords,
    loading,
    error,
    createTrainingRecord,
    updateTrainingRecord,
    deleteTrainingRecord
  };
};
