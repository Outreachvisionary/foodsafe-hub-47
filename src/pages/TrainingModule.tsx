
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Users, ClipboardCheck, BarChart, Calendar } from 'lucide-react';
import TrainingDashboard from '@/components/training/TrainingDashboard';
import CourseLibrary from '@/components/training/CourseLibrary';
import TrainingRecords from '@/components/training/TrainingRecords';
import TrainingPlans from '@/components/training/TrainingPlans';
import ReportsAnalytics from '@/components/training/ReportsAnalytics';
import CompetencyAssessments from '@/components/training/CompetencyAssessments';
import PermissionGuard from '@/components/auth/PermissionGuard';

const TrainingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Training Management</h1>
          <p className="text-muted-foreground">Manage training courses, records, and certifications</p>
        </div>
        
        <div className="flex gap-2">
          <PermissionGuard 
            permissions="training.create"
            fallback={
              <Button variant="outline" disabled>
                <Plus className="mr-2 h-4 w-4" />
                New Training
              </Button>
            }
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Training
            </Button>
          </PermissionGuard>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="dashboard" className="flex gap-1 items-center">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex gap-1 items-center">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Courses</span>
          </TabsTrigger>
          <TabsTrigger value="records" className="flex gap-1 items-center">
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Records</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex gap-1 items-center">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Plans</span>
          </TabsTrigger>
          <TabsTrigger value="competency" className="flex gap-1 items-center">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Competency</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex gap-1 items-center">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <TrainingDashboard />
        </TabsContent>
        
        <TabsContent value="courses">
          <CourseLibrary />
        </TabsContent>
        
        <TabsContent value="records">
          <TrainingRecords />
        </TabsContent>
        
        <TabsContent value="plans">
          <TrainingPlans />
        </TabsContent>
        
        <TabsContent value="competency">
          <CompetencyAssessments />
        </TabsContent>
        
        <TabsContent value="reports">
          <ReportsAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingModule;
