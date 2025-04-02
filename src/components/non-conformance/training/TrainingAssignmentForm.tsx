
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, FileSpreadsheet } from 'lucide-react';
import { FoodSafetyCategory } from '@/hooks/useAuditTraining';

interface Employee {
  id: string;
  name: string;
  department?: string;
}

interface TrainingAssignmentFormProps {
  recommendedCourses: string[];
  employees: Employee[];
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
        <Label className="text-sm font-medium mb-1 block">Training Course</Label>
        <Select value={selectedCourse} onValueChange={onSelectCourse}>
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

        {selectedCourse === 'custom' && (
          <Input 
            className="mt-2"
            placeholder="Enter custom training course title"
            onChange={(e) => onSelectCourse(e.target.value)}
          />
        )}
      </div>
      
      <div>
        <Label className="text-sm font-medium mb-1 block">Priority</Label>
        <Select value={priority} onValueChange={(value) => onPriorityChange(value as 'low' | 'medium' | 'high' | 'critical')}>
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
            onChange={(e) => onDueDateChange(e.target.value)}
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
                    onSelectAssignee(employee.id);
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
                      onClick={() => onRemoveAssignee(id)}
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
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
      
      <Button 
        className="w-full" 
        onClick={onAssign}
        disabled={isLoading}
      >
        {isLoading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
        Assign Training
      </Button>
    </div>
  );
};

export default TrainingAssignmentForm;
