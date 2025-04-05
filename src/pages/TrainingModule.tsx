
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { NestedTabs } from '@/components/ui/nested-tabs';
import { TabsContent } from '@/components/ui/tabs';
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
import { 
  BarChart, 
  BookOpen, 
  GraduationCap, 
  Users, 
  FileText,
  Award, 
  LayoutDashboard, 
  PieChart, 
  Lightbulb
} from 'lucide-react';

const TrainingModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { trainings, loading } = useAuditTraining();
  
  // Filter only non-completed training from audits
  const auditTrainingTasks = trainings.filter(t => t.status !== 'completed');
  
  // Count critical and high priority tasks
  const criticalTasks = auditTrainingTasks.filter(t => t.priority === 'critical').length;
  const highPriorityTasks = auditTrainingTasks.filter(t => t.priority === 'high').length;

  // Navigation tabs with parent/child relationships
  const navigationTabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      id: "training-management",
      label: "Training Management",
      icon: <GraduationCap className="h-4 w-4" />,
      children: [
        {
          id: "matrix",
          label: "Training Matrix",
          icon: <BarChart className="h-4 w-4" />
        },
        {
          id: "courses",
          label: "Course Library",
          icon: <BookOpen className="h-4 w-4" />
        },
        {
          id: "course-creation",
          label: "Course Creation",
          icon: <Lightbulb className="h-4 w-4" />
        },
        {
          id: "delivery",
          label: "Course Delivery",
          icon: <BookOpen className="h-4 w-4" />
        }
      ]
    },
    {
      id: "user-management",
      label: "User Management",
      icon: <Users className="h-4 w-4" />,
      children: [
        {
          id: "enrollment",
          label: "User Enrollment",
          icon: <Users className="h-4 w-4" />
        },
        {
          id: "assessments",
          label: "Competency Assessments",
          icon: <FileText className="h-4 w-4" />
        }
      ]
    },
    {
      id: "compliance-management",
      label: "Compliance Management",
      icon: <Award className="h-4 w-4" />,
      children: [
        {
          id: "certifications",
          label: "Certification Management",
          icon: <Award className="h-4 w-4" />
        },
        {
          id: "reports",
          label: "Reports & Analytics",
          icon: <PieChart className="h-4 w-4" />
        }
      ]
    },
    {
      id: "records-group",
      label: "Records",
      icon: <FileText className="h-4 w-4" />,
      children: [
        {
          id: "records",
          label: "Training Records",
          icon: <FileText className="h-4 w-4" />
        },
        {
          id: "plans",
          label: "Training Plans",
          icon: <FileText className="h-4 w-4" />
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Training Module" 
        subtitle="Manage employee training, competency and compliance certification." 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert for audit-related training */}
        {auditTrainingTasks.length > 0 && (
          <AuditTrainingAlert 
            count={auditTrainingTasks.length} 
            criticalTasks={criticalTasks} 
          />
        )}
        
        {/* Audit training tasks */}
        {auditTrainingTasks.length > 0 && (
          <AuditTrainingTasks 
            tasks={auditTrainingTasks}
            onViewDetails={() => setActiveTab("plans")}
            criticalTasks={criticalTasks}
            highPriorityTasks={highPriorityTasks}
          />
        )}
        
        <TrainingProvider>
          <NestedTabs 
            tabs={navigationTabs} 
            defaultValue="dashboard" 
            value={activeTab} 
            onTabChange={setActiveTab}
            className="w-full animate-fade-in"
          >
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
          </NestedTabs>
        </TrainingProvider>
      </main>
    </div>
  );
};

export default TrainingModule;
