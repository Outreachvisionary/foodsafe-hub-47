import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Users, BookOpen, AlertTriangle, Thermometer, AlertCircle, FileText, Utensils, Bug, Banana, Flame, TestTube2, Sparkles } from 'lucide-react';
import { useAuditTraining, FoodSafetyCategory, FOOD_SAFETY_TRAINING_MAP, FoodHazardType } from '@/hooks/useAuditTraining';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface TrainingIntegrationProps {
  findingId: string;
  findingDescription: string;
  severity: string;
  equipmentId?: string;
  locationId?: string;
}

export const TrainingIntegration: React.FC<TrainingIntegrationProps> = ({
  findingId,
  findingDescription,
  severity,
  equipmentId,
  locationId
}) => {
  const { toast } = useToast();
  const [trainingCourse, setTrainingCourse] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [category, setCategory] = useState<FoodSafetyCategory>('general');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [selectedHazards, setSelectedHazards] = useState<FoodHazardType[]>([]);
  const [notes, setNotes] = useState('');
  const [showHACCPFields, setShowHACCPFields] = useState(false);

  const { 
    getRecommendedTraining, 
    getDeadlineByPriority, 
    assignTraining, 
    getCoursesForHazards,
    isCriticalControlPoint 
  } = useAuditTraining();

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

    if (severity === 'critical') {
      setPriority('critical');
      setShowHACCPFields(true);
    } else if (severity === 'major') {
      setPriority('high');
    } else if (severity === 'minor') {
      setPriority('medium');
    } else {
      setPriority('low');
    }
  }, [findingDescription, severity]);

  useEffect(() => {
    setDueDate(getDeadlineByPriority(priority));
  }, [priority, getDeadlineByPriority]);

  const recommendedCourses = selectedHazards.length > 0 
    ? getCoursesForHazards(selectedHazards)
    : getRecommendedTraining(category);

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

  const getHazardIcon = (hazard: FoodHazardType) => {
    switch (hazard) {
      case 'biological':
        return <TestTube2 className="h-4 w-4 text-green-600" />;
      case 'chemical':
        return <Flame className="h-4 w-4 text-orange-600" />;
      case 'physical':
        return <Sparkles className="h-4 w-4 text-blue-600" />;
      case 'allergen':
        return <Banana className="h-4 w-4 text-yellow-600" />;
      case 'radiological':
        return <AlertTriangle className="h-4 w-4 text-purple-600" />;
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

    console.log('Assigning training:', {
      findingId,
      trainingCourse,
      dueDate,
      assignees,
      category,
      priority,
      hazards: selectedHazards,
      equipmentId,
      locationId,
      notes
    });

    assignTraining({
      auditId: `A${Math.floor(Math.random() * 1000)}`,
      findingId,
      courseTitle: trainingCourse,
      assignedTo: assignees,
      dueDate,
      category,
      priority,
      hazardTypes: selectedHazards,
      equipmentId,
      locationId,
      notes
    });

    toast({
      title: "Training Assigned",
      description: `${trainingCourse} has been assigned to ${assignees.length} employee(s)`,
    });

    setTrainingCourse('');
    setDueDate(getDeadlineByPriority(priority));
    setAssignees([]);
    setSelectedHazards([]);
    setNotes('');
  };

  const isCCP = isCriticalControlPoint({ category, priority });

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {getCategoryIcon(category)}
          Assign Remedial Training
          {isCCP && (
            <Badge className="bg-red-100 text-red-800 ml-2">CCP</Badge>
          )}
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
            
            <Label className="text-sm font-medium mb-1 block">Finding Category</Label>
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
            <Label className="text-sm font-medium mb-1 block">Hazard Type</Label>
            <div className="space-y-2 mt-1">
              {['biological', 'chemical', 'physical', 'allergen', 'radiological'].map((hazard) => (
                <div key={hazard} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`hazard-${hazard}`} 
                    checked={selectedHazards.includes(hazard as FoodHazardType)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedHazards([...selectedHazards, hazard as FoodHazardType]);
                      } else {
                        setSelectedHazards(selectedHazards.filter(h => h !== hazard));
                      }
                    }}
                  />
                  <Label
                    htmlFor={`hazard-${hazard}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                  >
                    {getHazardIcon(hazard as FoodHazardType)}
                    {hazard.charAt(0).toUpperCase() + hazard.slice(1)}
                  </Label>
                </div>
              ))}
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

          {(showHACCPFields || priority === 'critical' || isCCP) && (
            <div className="bg-red-50 p-3 rounded-md border border-red-100">
              <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                HACCP Control Point Training
              </h4>
              <p className="text-xs text-red-700 mb-2">
                This finding affects a Critical Control Point. Immediate training is required.
              </p>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Corrective Action per HACCP Plan</Label>
                <Textarea 
                  placeholder="Describe the required corrective action according to HACCP plan..."
                  className="text-sm"
                  rows={2}
                />
              </div>
            </div>
          )}

          {category === 'allergen-control' && (
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
              <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-1">
                <Banana className="h-4 w-4" />
                Allergen Training Requirements
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="allergen-cleanup" />
                  <Label htmlFor="allergen-cleanup" className="text-xs">
                    Equipment cleanup verification required
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="allergen-testing" />
                  <Label htmlFor="allergen-testing" className="text-xs">
                    ATP/allergen testing required post-training
                  </Label>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium mb-1 block">Additional Notes</Label>
            <Textarea 
              placeholder="Enter any additional information or instructions..."
              className="h-24"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
