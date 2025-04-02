
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import TrainingDashboard from '@/components/training/TrainingDashboard';
import TrainingRecords from '@/components/training/TrainingRecords';
import TrainingPlans from '@/components/training/TrainingPlans';
import CourseLibrary from '@/components/training/CourseLibrary';
import CompetencyAssessments from '@/components/training/CompetencyAssessments';
import ReportsAnalytics from '@/components/training/ReportsAnalytics';
import { useAuditTraining } from '@/hooks/useAuditTraining';
import AuditTrainingAlert from '@/components/training/AuditTrainingAlert';
import AuditTrainingTasks from '@/components/training/AuditTrainingTasks';
import { TrainingProvider, useTrainingContext } from '@/contexts/TrainingContext';
import PermissionGuard from '@/components/auth/PermissionGuard';

// TrainingContent component that uses the context
const TrainingContent = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { trainings, loading } = useAuditTraining();
  const { hasErrors } = useTrainingContext();
  
  // Filter only non-completed training from audits
  const auditTrainingTasks = trainings.filter(t => t.status !== 'completed');
  
  // Count critical and high priority tasks
  const criticalTasks = auditTrainingTasks.filter(t => t.priority === 'critical').length;
  const highPriorityTasks = auditTrainingTasks.filter(t => t.priority === 'high').length;

  return (
    <>
      {hasErrors && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading some training data. You may experience limited functionality.
          </AlertDescription>
        </Alert>
      )}
      
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
      
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full animate-fade-in">
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
          <ReportsAnalytics />
        </TabsContent>
      </Tabs>
    </>
  );
};

// Main TrainingModule component that wraps everything with the provider
const TrainingModule = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Training Module" 
        subtitle="Manage employee training, competency and compliance certification." 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PermissionGuard 
          permission="training.view"
          fallback={
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Restricted</AlertTitle>
              <AlertDescription>
                You don't have permission to view the training module.
              </AlertDescription>
            </Alert>
          }
        >
          <TrainingProvider showLoadingOverlay={true}>
            <TrainingContent />
          </TrainingProvider>
        </PermissionGuard>
      </main>
    </div>
  );
};

export default TrainingModule;
