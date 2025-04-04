
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrainingDashboard from '@/components/training/TrainingDashboard';
import TrainingRecords from '@/components/training/TrainingRecords';
import TrainingPlans from '@/components/training/TrainingPlans';
import CourseLibrary from '@/components/training/CourseLibrary';
import CompetencyAssessments from '@/components/training/CompetencyAssessments';
import ReportsAnalytics from '@/components/training/ReportsAnalytics';
import { useAuditTraining } from '@/hooks/useAuditTraining';
import AuditTrainingAlert from '@/components/training/AuditTrainingAlert';
import AuditTrainingTasks from '@/components/training/AuditTrainingTasks';
import { TrainingProvider } from '@/contexts/TrainingContext';
import TrainingMatrix from '@/components/training/TrainingMatrix';
import CourseCreation from '@/components/training/CourseCreation';
import UserEnrollment from '@/components/training/UserEnrollment';
import CourseDelivery from '@/components/training/CourseDelivery';
import CertificationManagement from '@/components/training/CertificationManagement';

const TrainingModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { trainings, loading } = useAuditTraining();
  
  // Filter only non-completed training from audits
  const auditTrainingTasks = trainings.filter(t => t.status !== 'completed');
  
  // Count critical and high priority tasks
  const criticalTasks = auditTrainingTasks.filter(t => t.priority === 'critical').length;
  const highPriorityTasks = auditTrainingTasks.filter(t => t.priority === 'high').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Training Module" 
        subtitle="Manage employee training, competency and compliance certification." 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert for audit-related training */}
        <AuditTrainingAlert 
          count={auditTrainingTasks.length} 
          criticalTasks={criticalTasks} 
        />
        
        {/* Audit training tasks */}
        <AuditTrainingTasks 
          tasks={auditTrainingTasks}
          onViewDetails={() => setActiveTab("plans")}
          criticalTasks={criticalTasks}
          highPriorityTasks={highPriorityTasks}
        />
        
        <TrainingProvider>
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full animate-fade-in">
            <TabsList className="mb-8 flex flex-wrap">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="matrix">Training Matrix</TabsTrigger>
              <TabsTrigger value="courses">Course Library</TabsTrigger>
              <TabsTrigger value="course-creation">Course Creation</TabsTrigger>
              <TabsTrigger value="enrollment">User Enrollment</TabsTrigger>
              <TabsTrigger value="delivery">Course Delivery</TabsTrigger>
              <TabsTrigger value="records">Training Records</TabsTrigger>
              <TabsTrigger value="plans">Training Plans</TabsTrigger>
              <TabsTrigger value="certifications">Certification Management</TabsTrigger>
              <TabsTrigger value="assessments">Competency Assessments</TabsTrigger>
              <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <TrainingDashboard />
            </TabsContent>
            
            <TabsContent value="matrix">
              <TrainingMatrix />
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

            <TabsContent value="course-creation">
              <CourseCreation />
            </TabsContent>

            <TabsContent value="enrollment">
              <UserEnrollment />
            </TabsContent>

            <TabsContent value="delivery">
              <CourseDelivery />
            </TabsContent>
            
            <TabsContent value="certifications">
              <CertificationManagement />
            </TabsContent>

            <TabsContent value="assessments">
              <CompetencyAssessments />
            </TabsContent>
            
            <TabsContent value="reports">
              <ReportsAnalytics />
            </TabsContent>
          </Tabs>
        </TrainingProvider>
      </main>
    </div>
  );
};

export default TrainingModule;
