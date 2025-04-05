
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuditTraining {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  audit_id: string;
  assigned_to: string;
}

export function useAuditTraining() {
  const [trainings, setTrainings] = useState<AuditTraining[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditTraining = async () => {
      try {
        setLoading(true);
        
        // Mock data for now
        // In a real app, fetch from Supabase
        const mockTrainings: AuditTraining[] = [
          {
            id: '1',
            title: 'Annual GMP Training Update',
            description: 'Complete GMP refresher training required by SQF audit findings',
            due_date: '2025-04-20',
            status: 'pending',
            priority: 'high',
            audit_id: 'audit-123',
            assigned_to: 'Production Team'
          },
          {
            id: '2',
            title: 'HACCP Documentation Review',
            description: 'Review and update HACCP documentation based on audit findings',
            due_date: '2025-04-15',
            status: 'in_progress',
            priority: 'critical',
            audit_id: 'audit-123',
            assigned_to: 'Quality Team'
          },
          {
            id: '3',
            title: 'Metal Detection Training',
            description: 'Conduct training on proper metal detector verification procedures',
            due_date: '2025-04-25',
            status: 'pending',
            priority: 'medium',
            audit_id: 'audit-124',
            assigned_to: 'Production Team'
          },
          {
            id: '4',
            title: 'Allergen Control Training',
            description: 'Conduct training on allergen control procedures',
            due_date: '2025-05-01',
            status: 'completed',
            priority: 'high',
            audit_id: 'audit-125',
            assigned_to: 'All Staff'
          }
        ];
        
        setTrainings(mockTrainings);
      } catch (error) {
        console.error('Error fetching audit-related training:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditTraining();
  }, []);

  const updateTrainingStatus = async (id: string, status: AuditTraining['status']) => {
    try {
      // Update status locally first
      setTrainings(prev => 
        prev.map(training => 
          training.id === id 
            ? { ...training, status } 
            : training
        )
      );
      
      // In a real app, update in Supabase
      // const { error } = await supabase
      //   .from('audit_training')
      //   .update({ status })
      //   .eq('id', id);
      
      // if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating training status:', error);
      return false;
    }
  };

  return { trainings, loading, updateTrainingStatus };
}
