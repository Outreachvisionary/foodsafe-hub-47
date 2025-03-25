import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, BarChart, PieChart, TrendingUp, BarChart2, Filter, Share2 } from 'lucide-react';
import ReportDashboard from '@/components/reports/ReportDashboard';
import ReportBuilder from '@/components/reports/ReportBuilder';
import PrebuiltReports from '@/components/reports/PrebuiltReports';
import ScheduledReports from '@/components/reports/ScheduledReports';
import ModuleIntegration from '@/components/reports/ModuleIntegration';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { ReportProvider } from '@/contexts/ReportContext';

const ReportsContent = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  
  useEffect(() => {
    if (user?.preferences?.dashboardLayout) {
      console.log(`Loading user's preferred dashboard layout: ${user.preferences.dashboardLayout}`);
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('activeTab');
    if (tabParam && ['dashboard', 'prebuilt', 'builder', 'scheduled', 'integration'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [user]);
  
  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Your report has been exported successfully."
    });
  };

  const navigateToModuleReports = (module: string) => {
    const moduleRoutes: Record<string, string> = {
      'documents': '/documents?activeTab=reports',
      'capa': '/capa?activeTab=reports',
      'audits': '/internal-audits?activeTab=reports',
      'training': '/training?activeTab=reports',
      'complaints': '/complaint-management?activeTab=reports',
      'haccp': '/haccp?activeTab=reports'
    };
    
    if (moduleRoutes[module]) {
      navigate(moduleRoutes[module]);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Reports & Analytics" 
        subtitle="Comprehensive reporting and analytics for compliance monitoring and management" 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        
        <div className="flex justify-between items-center my-6">
          <h2 className="text-xl font-semibold">Compliance Reports</h2>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Dashboard
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="prebuilt" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Prebuilt Reports</span>
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Report Builder</span>
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Scheduled Reports</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span>Module Integration</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <ReportDashboard dateRange={dateRange} />
          </TabsContent>
          
          <TabsContent value="prebuilt">
            <PrebuiltReports dateRange={dateRange} onNavigateToModule={navigateToModuleReports} />
          </TabsContent>
          
          <TabsContent value="builder">
            <ReportBuilder />
          </TabsContent>
          
          <TabsContent value="scheduled">
            <ScheduledReports />
          </TabsContent>
          
          <TabsContent value="integration">
            <ModuleIntegration onNavigateToModule={navigateToModuleReports} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const Reports = () => {
  return (
    <ReportProvider>
      <ReportsContent />
    </ReportProvider>
  );
};

export default Reports;
