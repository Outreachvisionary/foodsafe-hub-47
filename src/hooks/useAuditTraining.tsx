
import { useState, useEffect } from 'react';

interface AuditRelatedTraining {
  id: string;
  auditId: string;
  findingId: string;
  courseTitle: string;
  assignedTo: string[];
  dueDate: string;
  status: 'assigned' | 'in-progress' | 'completed' | 'overdue';
}

// This would normally be fetched from an API
const mockAuditTrainingData: AuditRelatedTraining[] = [
  {
    id: 'train1',
    auditId: 'A001',
    findingId: 'find1',
    courseTitle: 'Food Safety Refresher',
    assignedTo: ['emp1', 'emp2'],
    dueDate: '2023-08-30',
    status: 'completed'
  },
  {
    id: 'train2',
    auditId: 'A002',
    findingId: 'find2',
    courseTitle: 'GMP Basics',
    assignedTo: ['emp3'],
    dueDate: '2023-07-15',
    status: 'overdue'
  },
  {
    id: 'train3',
    auditId: 'A003',
    findingId: 'find3',
    courseTitle: 'HACCP Principles',
    assignedTo: ['emp1', 'emp4'],
    dueDate: '2023-09-01',
    status: 'in-progress'
  }
];

export const useAuditTraining = (auditId?: string, findingId?: string) => {
  const [trainings, setTrainings] = useState<AuditRelatedTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      try {
        let filteredTrainings = [...mockAuditTrainingData];
        
        if (auditId) {
          filteredTrainings = filteredTrainings.filter(t => t.auditId === auditId);
        }
        
        if (findingId) {
          filteredTrainings = filteredTrainings.filter(t => t.findingId === findingId);
        }
        
        setTrainings(filteredTrainings);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }, 500);
  }, [auditId, findingId]);

  const assignTraining = (training: Omit<AuditRelatedTraining, 'id' | 'status'>) => {
    const newTraining: AuditRelatedTraining = {
      ...training,
      id: `train${Math.floor(Math.random() * 1000)}`,
      status: 'assigned'
    };
    
    setTrainings(prev => [...prev, newTraining]);
    return newTraining;
  };

  return {
    trainings,
    loading,
    error,
    assignTraining
  };
};
