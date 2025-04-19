
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, ClipboardList } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FoodSafetyCategory, useAuditTraining } from '@/hooks/useAuditTraining';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { createTrainingRecord, createTrainingSession } from '@/services/supabaseService';
import { TrainingStatus, TrainingType } from '@/types/training';
import TrainingAssignmentForm from './training/TrainingAssignmentForm';

interface NCTrainingIntegrationProps {
  ncId: string;
  ncTitle: string;
  ncDescription: string;
  severity?: string;
  category?: string;
}

const NCTrainingIntegration: React.FC<NCTrainingIntegrationProps> = ({
  ncId,
  ncTitle,
  ncDescription,
  severity = 'medium',
  category = 'general'
}) => {
  const { toast: uiToast } = useToast();
  const [trainingCourse, setTrainingCourse] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [assigneeNames, setAssigneeNames] = useState<Record<string, string>>({});
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Get training-related helpers from the audit training hook
  const { 
    getRecommendedTraining, 
    getDeadlineByPriority 
  } = useAuditTraining();

  // Determine the category based on non-conformance info
  const [trainingCategory, setTrainingCategory] = useState<FoodSafetyCategory>('general');

  useEffect(() => {
    // Map NC category to training category
    if (category?.toLowerCase().includes('food') || category?.toLowerCase().includes('product')) {
      setTrainingCategory('foreign-material');
    } else if (category?.toLowerCase().includes('process')) {
      setTrainingCategory('documentation');
    } else if (category?.toLowerCase().includes('equipment')) {
      setTrainingCategory('temperature-control');
    } else if (category?.toLowerCase().includes('allergen')) {
      setTrainingCategory('allergen-control');
    } else if (category?.toLowerCase().includes('hygiene')) {
      setTrainingCategory('hygiene-monitoring');
    }

    // Map severity to priority
    if (severity?.toLowerCase().includes('critical')) {
      setPriority('critical');
    } else if (severity?.toLowerCase().includes('major')) {
      setPriority('high');
    } else if (severity?.toLowerCase().includes('minor')) {
      setPriority('medium');
    } else {
      setPriority('low');
    }
  }, [category, severity]);

  useEffect(() => {
    setDueDate(getDeadlineByPriority(priority));
  }, [priority, getDeadlineByPriority]);

  const recommendedCourses = getRecommendedTraining(trainingCategory);

  // Fetch employees from profiles
  const [employees, setEmployees] = useState<Array<{id: string, name: string, department?: string}>>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, department')
          .eq('status', 'active');

        if (error) throw error;
        
        setEmployees(data?.map(emp => ({
          id: emp.id,
          name: emp.full_name || 'Unnamed Employee',
          department: emp.department
        })) || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
        // Fallback to mock data if fetch fails
        setEmployees([
          { id: 'emp1', name: 'John Doe', department: 'Production' },
          { id: 'emp2', name: 'Jane Smith', department: 'Quality' },
          { id: 'emp3', name: 'Robert Johnson', department: 'Maintenance' },
        ]);
      }
    };

    if (showForm) {
      fetchEmployees();
    }
  }, [showForm]);

  const handleAssignTraining = async () => {
    if (!trainingCourse || !dueDate || assignees.length === 0) {
      toast.error("Please complete all required fields before assigning training");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create a training session
      const sessionId = uuidv4();
      const newSession = {
        id: sessionId,
        title: trainingCourse,
        description: `Remedial training for NC: ${ncTitle}`,
        training_type: 'compliance' as TrainingType,
        training_category: trainingCategory as unknown as TrainingCategory,
        assigned_to: assignees.map(id => assigneeNames[id] || id),
        start_date: new Date().toISOString(),
        due_date: new Date(dueDate).toISOString(),
        created_by: 'system',
        required_roles: [],
        is_recurring: false
      };

      await createTrainingSession(newSession);
      console.log('Created training session with ID:', sessionId);

      // 2. Create training records for each assignee
      const trainingRecordPromises = assignees.map(async (assigneeId) => {
        const empName = assigneeNames[assigneeId] || 
                        employees.find(e => e.id === assigneeId)?.name || 
                        'Employee';
        
        const newRecord = {
          session_id: sessionId,
          employee_id: assigneeId,
          employee_name: empName,
          status: 'Not Started' as TrainingStatus,
          assigned_date: new Date().toISOString(),
          due_date: new Date(dueDate).toISOString(),
          notes
        };

        return await createTrainingRecord(newRecord);
      });

      const createdRecords = await Promise.all(trainingRecordPromises);
      console.log('Created training records:', createdRecords);

      // 3. Create a module relationship to link NC and training
      const { error: relationshipError } = await supabase.from('module_relationships').insert({
        id: uuidv4(),
        source_id: ncId,
        source_type: 'non_conformance',
        target_id: sessionId,
        target_type: 'training',
        relationship_type: 'remedial_training',
        created_by: 'system',
        created_at: new Date().toISOString()
      });

      if (relationshipError) throw relationshipError;

      toast.success(`${trainingCourse} has been assigned to ${assignees.length} employee(s)`);
      uiToast({
        title: "Training Assigned",
        description: `${trainingCourse} has been assigned to ${assignees.length} employee(s)`,
      });

      // Reset form
      setTrainingCourse('');
      setDueDate(getDeadlineByPriority(priority));
      setAssignees([]);
      setNotes('');
      setShowForm(false);
    } catch (error) {
      console.error('Error assigning training:', error);
      toast.error("There was an error assigning the training");
      uiToast({
        title: "Assignment Failed",
        description: "There was an error assigning the training",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAssignee = (assigneeId: string) => {
    setAssignees([...assignees, assigneeId]);
    const employee = employees.find(e => e.id === assigneeId);
    if (employee) {
      setAssigneeNames({
        ...assigneeNames,
        [assigneeId]: employee.name
      });
    }
  };

  const handleRemoveAssignee = (assigneeId: string) => {
    setAssignees(assignees.filter(id => id !== assigneeId));
  };

  if (!showForm) {
    return (
      <div className="mt-4">
        <Button 
          onClick={() => setShowForm(true)} 
          className="w-full"
          variant="outline"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Assign Remedial Training
        </Button>
      </div>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Assign Remedial Training
        </CardTitle>
        <CardDescription>
          Create training assignments based on this non-conformance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-md">
            <h4 className="text-sm font-medium">{ncTitle}</h4>
            <p className="text-xs text-muted-foreground mt-1">{ncDescription}</p>
          </div>
          
          <TrainingAssignmentForm
            recommendedCourses={recommendedCourses}
            employees={employees}
            priority={priority}
            dueDate={dueDate}
            onDueDateChange={setDueDate}
            onPriorityChange={setPriority}
            onAssign={handleAssignTraining}
            isLoading={isLoading}
            onSelectCourse={setTrainingCourse}
            selectedCourse={trainingCourse}
            notes={notes}
            onNotesChange={setNotes}
            assignees={assignees}
            onSelectAssignee={handleSelectAssignee}
            onRemoveAssignee={handleRemoveAssignee}
            assigneeNames={assigneeNames}
          />
          
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => setShowForm(false)}
            disabled={isLoading}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NCTrainingIntegration;
