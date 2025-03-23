
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Users, BookOpen, AlertTriangle, Thermometer, AlertCircle, FileText, Utensils, Bug } from 'lucide-react';
import { useAuditTraining, FoodSafetyCategory, FOOD_SAFETY_TRAINING_MAP } from '@/hooks/useAuditTraining';

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
  const [category, setCategory] = useState<FoodSafetyCategory>('general');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [selectedHazards, setSelectedHazards] = useState<string[]>([]);

  const { getRecommendedTraining, getDeadlineByPriority, assignTraining } = useAuditTraining();

  // Detect likely category based on finding description
  useEffect(() => {
    const lowerDesc = findingDescription.toLowerCase();
    if (lowerDesc.includes('temperature') || lowerDesc.includes('cold') || lowerDesc.includes('hot')) {
      setCategory('temperature-control');
    } else if (lowerDesc.includes('allergen') || lowerDesc.includes('cross-contamination')) {
      setCategory('allergen-control');
    } else if (lowerDesc.includes('hygiene') || lowerDesc.includes('handwash')) {
      setCategory('hygiene-monitoring');
    } else if (lowerDesc.includes('document') || lowerDesc.includes('record')) {
      setCategory('documentation');
    } else if (lowerDesc.includes('clean') || lowerDesc.includes('sanit')) {
      setCategory('sanitization');
    } else if (lowerDesc.includes('pest') || lowerDesc.includes('insect')) {
      setCategory('pest-control');
    } else if (lowerDesc.includes('foreign') || lowerDesc.includes('metal')) {
      setCategory('foreign-material');
    } else if (lowerDesc.includes('trace') || lowerDesc.includes('recall')) {
      setCategory('traceability');
    }

    // Set priority based on severity
    if (severity === 'critical') {
      setPriority('critical');
    } else if (severity === 'major') {
      setPriority('high');
    } else if (severity === 'minor') {
      setPriority('medium');
    } else {
      setPriority('low');
    }
  }, [findingDescription, severity]);

  // Set recommended due date based on priority
  useEffect(() => {
    setDueDate(getDeadlineByPriority(priority));
  }, [priority, getDeadlineByPriority]);

  // Get recommended courses for selected category
  const recommendedCourses = getRecommendedTraining(category);

  // Mock employees
  const employees = [
    { id: 'emp1', name: 'John Doe', department: 'Production' },
    { id: 'emp2', name: 'Jane Smith', department: 'Quality' },
    { id: 'emp3', name: 'Robert Johnson', department: 'Maintenance' },
    { id: 'emp4', name: 'Sarah Williams', department: 'Sanitation' },
    { id: 'emp5', name: 'Michael Brown', department: 'Warehouse' },
  ];

  const getCategoryIcon = (category: FoodSafetyCategory) => {
    switch (category) {
      case 'temperature-control':
        return <Thermometer className="h-5 w-5 text-blue-600" />;
      case 'allergen-control':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'hygiene-monitoring':
        return <Users className="h-5 w-5 text-green-600" />;
      case 'documentation':
        return <FileText className="h-5 w-5 text-yellow-600" />;
      case 'sanitization':
        return <AlertTriangle className="h-5 w-5 text-purple-600" />;
      case 'pest-control':
        return <Bug className="h-5 w-5 text-orange-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-blue-600" />;
    }
  };

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
      category,
      priority,
      hazards: selectedHazards
    });

    assignTraining({
      auditId: `A${Math.floor(Math.random() * 1000)}`,
      findingId,
      courseTitle: trainingCourse,
      assignedTo: assignees,
      dueDate,
      category,
      priority
    });

    toast({
      title: "Training Assigned",
      description: `${trainingCourse} has been assigned to ${assignees.length} employee(s)`,
    });

    // Reset form
    setTrainingCourse('');
    setDueDate(getDeadlineByPriority(priority));
    setAssignees([]);
    setSelectedHazards([]);
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {getCategoryIcon(category)}
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
              <span>Suggested category: <strong>{category.replace('-', ' ')}</strong></span>
            </div>
            
            <label className="text-sm font-medium mb-1 block">Finding Category</label>
            <Select value={category} onValueChange={(value) => setCategory(value as FoodSafetyCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(FOOD_SAFETY_TRAINING_MAP).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Hazard Type</label>
            <div className="space-y-2 mt-1">
              {['Biological', 'Chemical', 'Physical', 'Allergen'].map((hazard) => (
                <div key={hazard} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`hazard-${hazard}`} 
                    checked={selectedHazards.includes(hazard)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedHazards([...selectedHazards, hazard]);
                      } else {
                        setSelectedHazards(selectedHazards.filter(h => h !== hazard));
                      }
                    }}
                  />
                  <label
                    htmlFor={`hazard-${hazard}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {hazard}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Training Course</label>
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
            <label className="text-sm font-medium mb-1 block">Priority</label>
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

          <div>
            <label className="text-sm font-medium mb-1 block">Additional Notes</label>
            <Textarea 
              placeholder="Enter any additional information or instructions..."
              className="h-24"
            />
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
