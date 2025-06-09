
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TrainingAssignmentFormProps {
  recommendedCourses: string[];
  employees: Array<{id: string, name: string, department?: string}>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  onDueDateChange: (date: string) => void;
  onPriorityChange: (priority: 'low' | 'medium' | 'high' | 'critical') => void;
  onAssign: () => void;
  isLoading: boolean;
  onSelectCourse: (course: string) => void;
  selectedCourse: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  assignees: string[];
  onSelectAssignee: (assigneeId: string) => void;
  onRemoveAssignee: (assigneeId: string) => void;
  assigneeNames: Record<string, string>;
}

const TrainingAssignmentForm: React.FC<TrainingAssignmentFormProps> = ({
  recommendedCourses,
  employees,
  priority,
  dueDate,
  onDueDateChange,
  onPriorityChange,
  onAssign,
  isLoading,
  onSelectCourse,
  selectedCourse,
  notes,
  onNotesChange,
  assignees,
  onSelectAssignee,
  onRemoveAssignee,
  assigneeNames
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="course">Training Course</Label>
        <Select value={selectedCourse} onValueChange={onSelectCourse}>
          <SelectTrigger>
            <SelectValue placeholder="Select a training course" />
          </SelectTrigger>
          <SelectContent>
            {recommendedCourses.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="assignees">Assign To</Label>
        <Select onValueChange={onSelectAssignee}>
          <SelectTrigger>
            <SelectValue placeholder="Select employees" />
          </SelectTrigger>
          <SelectContent>
            {employees
              .filter(emp => !assignees.includes(emp.id))
              .map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name} {emp.department && `(${emp.department})`}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        
        {assignees.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {assignees.map((assigneeId) => (
              <Badge key={assigneeId} variant="secondary" className="flex items-center gap-1">
                {assigneeNames[assigneeId]}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onRemoveAssignee(assigneeId)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Additional notes for this training assignment"
          rows={3}
        />
      </div>

      <Button 
        onClick={onAssign}
        disabled={isLoading || !selectedCourse || assignees.length === 0}
        className="w-full"
      >
        {isLoading ? 'Assigning...' : 'Assign Training'}
      </Button>
    </div>
  );
};

export default TrainingAssignmentForm;
