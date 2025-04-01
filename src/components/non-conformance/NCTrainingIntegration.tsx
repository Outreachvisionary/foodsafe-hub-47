
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Calendar, Users, Clock, FileSpreadsheet, ClipboardList } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { FoodSafetyCategory, useAuditTraining } from '@/hooks/useAuditTraining';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { createTrainingRecord, createTrainingSession } from '@/services/supabaseService';

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
        training_type: 'Online',
        training_category: trainingCategory,
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
          status: 'Not Started',
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
          <div>
            <Label className="text-sm font-medium mb-1 block">Non-Conformance Issue</Label>
            <div className="p-3 bg-muted rounded-md">
              <h4 className="text-sm font-medium">{ncTitle}</h4>
              <p className="text-xs text-muted-foreground mt-1">{ncDescription}</p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-1 block">Training Course</Label>
            <Select value={trainingCourse} onValueChange={setTrainingCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {recommendedCourses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom Training...</SelectItem>
              </SelectContent>
            </Select>

            {trainingCourse === 'custom' && (
              <Input 
                className="mt-2"
                placeholder="Enter custom training course title"
                onChange={(e) => setTrainingCourse(e.target.value)}
              />
            )}
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-1 block">Priority</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high' | 'critical')}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical (24 hours)</SelectItem>
                <SelectItem value="high">High (3 days)</SelectItem>
                <SelectItem value="medium">Medium (1 week)</SelectItem>
                <SelectItem value="low">Low (2 weeks)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-1 block">Due Date</Label>
            <div className="relative">
              <Input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-1 block">Assign To</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select employees" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem 
                    key={employee.id} 
                    value={employee.id}
                    onClick={() => {
                      if (!assignees.includes(employee.id)) {
                        setAssignees([...assignees, employee.id]);
                        setAssigneeNames({
                          ...assigneeNames,
                          [employee.id]: employee.name
                        });
                      }
                    }}
                  >
                    {employee.name} {employee.department ? `- ${employee.department}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {assignees.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{assignees.length} employee(s) selected</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {assignees.map(id => {
                    const emp = employees.find(e => e.id === id);
                    return (
                      <Badge key={id} variant="outline" className="flex items-center gap-1">
                        {emp?.name || assigneeNames[id] || id}
                        <button
                          onClick={() => setAssignees(assignees.filter(a => a !== id))}
                          className="ml-1 text-xs hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium mb-1 block">Additional Notes</Label>
            <Textarea 
              placeholder="Enter any additional information or instructions..."
              className="h-24"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              onClick={handleAssignTraining}
              disabled={isLoading}
            >
              {isLoading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
              Assign Training
            </Button>
            
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={() => setShowForm(false)}
              disabled={isLoading}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NCTrainingIntegration;
