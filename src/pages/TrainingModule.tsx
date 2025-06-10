
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCcw } from 'lucide-react';
import TrainingDashboard from '@/components/training/TrainingDashboard';
import TrainingMatrix from '@/components/training/TrainingMatrix';
import CourseLibrary from '@/components/training/CourseLibrary';
import TrainingRecords from '@/components/training/TrainingRecords';
import CompetencyAssessments from '@/components/training/CompetencyAssessments';
import ReportsAnalytics from '@/components/training/ReportsAnalytics';
import SidebarLayout from '@/components/layout/SidebarLayout';

const TrainingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Training Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage training programs and employee development
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Training
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="matrix">Training Matrix</TabsTrigger>
            <TabsTrigger value="library">Course Library</TabsTrigger>
            <TabsTrigger value="records">Training Records</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <TrainingDashboard />
          </TabsContent>

          <TabsContent value="matrix">
            <TrainingMatrix />
          </TabsContent>

          <TabsContent value="library">
            <CourseLibrary />
          </TabsContent>

          <TabsContent value="records">
            <TrainingRecords />
          </TabsContent>

          <TabsContent value="assessments">
            <CompetencyAssessments />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default TrainingModule;
