
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  UserPlus, 
  Clock, 
  MoreVertical, 
  Trash, 
  Plus,
  Calendar as CalendarIcon 
} from "lucide-react";
import { useTrainingContext } from "@/contexts/TrainingContext";
import { TrainingPlan, TrainingPriority } from "@/types/training";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

const TrainingPlans = () => {
  const { trainingPlans, fetchPlans, createTrainingPlan, deleteTrainingPlan } = useTrainingContext();
  const [isLoading, setIsLoading] = useState(true);
  const [newPlan, setNewPlan] = useState<Partial<TrainingPlan>>({
    name: '',
    description: '',
    targetRoles: [], // Updated from target_roles
    targetDepartments: [],
    courses: [],
    priority: 'Medium',
    status: 'Active',
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchPlans();
      } catch (error) {
        console.error("Failed to load training plans", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchPlans]);

  // Example function to create a new training plan
  const handleCreatePlan = async () => {
    try {
      await createTrainingPlan({
        name: "New Onboarding Plan",
        description: "Standard onboarding for new employees",
        targetRoles: ["Production Staff", "Quality Team"],
        courses: [],
        priority: "Medium" as TrainingPriority,
        status: "Active"
      });
    } catch (error) {
      console.error("Failed to create training plan", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Training Plans</h2>
        <Button onClick={handleCreatePlan}>
          <Plus className="h-4 w-4 mr-2" />
          New Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">Loading training plans...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trainingPlans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  <MoreVertical className="h-5 w-5 text-gray-400 cursor-pointer" />
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {(plan.courses?.length || 0)} courses
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <UserPlus className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {plan.targetRoles?.length || 0} target roles
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {plan.durationDays || "N/A"} days duration
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className={getPriorityColor(plan.priority || "Medium")}>
                      {plan.priority || "Medium"}
                    </Badge>
                    <Badge variant="outline">
                      {plan.status || "Active"}
                    </Badge>
                    {plan.isRequired && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => plan.id && deleteTrainingPlan(plan.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingPlans;
