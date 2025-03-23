
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrainingDashboard from '@/components/training/TrainingDashboard';
import TrainingRecords from '@/components/training/TrainingRecords';
import TrainingPlans from '@/components/training/TrainingPlans';
import CourseLibrary from '@/components/training/CourseLibrary';
import CompetencyAssessments from '@/components/training/competency/CompetencyAssessments';
import ReportsAnalytics from '@/components/training/ReportsAnalytics';
import CertificationGate from '@/components/training/certification/CertificationGate';

const TrainingModule = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Training Module" 
        subtitle="Manage employee training, competency and compliance certification." 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="w-full animate-fade-in">
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="records">Training Records</TabsTrigger>
            <TabsTrigger value="plans">Training Plans</TabsTrigger>
            <TabsTrigger value="courses">Course Library</TabsTrigger>
            <TabsTrigger value="assessments">Competency Assessments</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <TrainingDashboard />
          </TabsContent>
          
          <TabsContent value="records">
            <TrainingRecords />
          </TabsContent>
          
          <TabsContent value="plans">
            <TrainingPlans />
          </TabsContent>
          
          <TabsContent value="courses">
            <CourseLibrary />
          </TabsContent>
          
          <TabsContent value="assessments">
            <CompetencyAssessments />
          </TabsContent>
          
          <TabsContent value="reports">
            <CertificationGate 
              certificationType="quality-management" 
              requiredFor="Reports & Analytics"
            >
              <ReportsAnalytics />
            </CertificationGate>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TrainingModule;
