
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Users, BookOpen, AlertTriangle } from 'lucide-react';

interface TrainingIntegrationProps {
  findingId: string;
  findingDescription: string;
  severity: string;
}

export const TrainingIntegration: React.FC<TrainingIntegrationProps> = ({
  findingId,
  findingDescription,
  severity
}) => {
  const { toast } = useToast();
  const [trainingCourse, setTrainingCourse] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignees, setAssignees] = useState<string[]>([]);

  // Mock training courses based on finding categories
  const recommendedCourses = {
    'Documentation Error': ['Document Control Basics', 'GDP Training', 'Record Keeping 101'],
    'Process Deviation': ['SOP Adherence', 'Process Control Fundamentals', 'Root Cause Analysis'],
    'Food Safety Issue': ['Food Safety Refresher', 'GMP Basics', 'Allergen Management'],
    'Equipment Issue': ['Equipment Handling', 'Calibration Basics', 'Preventive Maintenance'],
    'Environment Control': ['Environmental Monitoring', 'Sanitation Procedures', 'Pest Control'],
  };

  // Mock employees
  const employees = [
    { id: 'emp1', name: 'John Doe', department: 'Production' },
    { id: 'emp2', name: 'Jane Smith', department: 'Quality' },
    { id: 'emp3', name: 'Robert Johnson', department: 'Maintenance' },
    { id: 'emp4', name: 'Sarah Williams', department: 'Sanitation' },
  ];

  // Detect likely category based on finding description
  const detectCategory = (description: string): string => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('document') || lowerDesc.includes('record')) return 'Documentation Error';
    if (lowerDesc.includes('process') || lowerDesc.includes('procedure')) return 'Process Deviation';
    if (lowerDesc.includes('food') || lowerDesc.includes('contaminat')) return 'Food Safety Issue';
    if (lowerDesc.includes('equipment') || lowerDesc.includes('machine')) return 'Equipment Issue';
    if (lowerDesc.includes('environment') || lowerDesc.includes('sanitation')) return 'Environment Control';
    return 'Process Deviation'; // Default
  };

  const detectedCategory = detectCategory(findingDescription);
  const suggestedCourses = recommendedCourses[detectedCategory] || recommendedCourses['Process Deviation'];

  const handleAssignTraining = () => {
    if (!trainingCourse || !dueDate || assignees.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please complete all fields before assigning training",
        variant: "destructive"
      });
      return;
    }

    // In a real application, this would call an API to assign training
    console.log('Assigning training:', {
      findingId,
      trainingCourse,
      dueDate,
      assignees,
    });

    toast({
      title: "Training Assigned",
      description: `${trainingCourse} has been assigned to ${assignees.length} employee(s)`,
    });

    // Reset form
    setTrainingCourse('');
    setDueDate('');
    setAssignees([]);
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Assign Remedial Training
        </CardTitle>
        <CardDescription>
          Create training assignments based on this audit finding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-md">
              <AlertTriangle className="h-4 w-4" />
              <span>Suggested category: <strong>{detectedCategory}</strong></span>
            </div>
            
            <label className="text-sm font-medium mb-1 block">Training Course</label>
            <Select value={trainingCourse} onValueChange={setTrainingCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {suggestedCourses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom Training...</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Due Date</label>
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
            <label className="text-sm font-medium mb-1 block">Assign To</label>
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
                      }
                    }}
                  >
                    {employee.name} - {employee.department}
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
              </div>
            )}
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleAssignTraining}
          >
            Assign Training
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingIntegration;
