
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingStatus } from '@/types/enums';
import { trainingStatusToString } from '@/utils/typeAdapters';

interface TrainingSession {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  duration: number;
  start_date: string;
  end_date: string;
  instructor: string;
  location: string;
  capacity: number;
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

        // Transform data to match TrainingSession interface
        const sessions: TrainingSession[] = (data || []).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category || 'General',
          type: item.type || 'Online',
          duration: item.duration || 60,
          start_date: item.start_date,
          end_date: item.end_date || item.start_date,
          instructor: item.instructor || 'TBD',
          location: item.location || 'Online',
          capacity: item.capacity || 0,
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
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        setTrainingRecords(data?.map(record => ({
          ...record,
          status: record.status as TrainingStatus
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

  const createTrainingRecord = (sessionId: string, employeeId: string, employeeName: string) => {
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      session_id: sessionId,
      employee_id: employeeId,
      employee_name: employeeName,
      status: TrainingStatus.Not_Started,
      assigned_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      completion_date: null,
      score: null,
      pass_threshold: 80,
      notes: null,
      last_recurrence: null,
      next_recurrence: null,
    };

    setTrainingRecords(prevRecords => [...prevRecords, newRecord]);
    return newRecord;
  };

  const updateTrainingRecord = async (recordId: string, updates: Partial<TrainingRecord>) => {
    try {
      setLoading(true);
      
      // Convert status to string for database
      const dbUpdates = {
        ...updates,
        status: updates.status ? trainingStatusToString(updates.status) : undefined
      };
      
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
        prevRecords.map(record => (record.id === recordId ? { ...record, ...data, status: data.status as TrainingStatus } : record))
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
