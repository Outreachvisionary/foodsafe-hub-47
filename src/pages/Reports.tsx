
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReportBuilder from '@/components/reports/ReportBuilder';
import PrebuiltReports from '@/components/reports/PrebuiltReports';
import ScheduledReports from '@/components/reports/ScheduledReports';
import ModuleIntegration from '@/components/reports/ModuleIntegration';
import { User } from '@/types/user';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('prebuilt');
  const [reportLayout, setReportLayout] = useState<string>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get layout from user preferences if available
    if (user?.preferences?.reportLayout) {
      setReportLayout(user.preferences.reportLayout);
    }
  }, [user]);

  const handleLayoutChange = async (layout: string) => {
    setReportLayout(layout);
    // Save user preference (this would be implemented in a real app)
    console.log(`Saving layout preference: ${layout}`);
  };

  const handleNavigateToModule = (modulePath: string) => {
    navigate(`/${modulePath}`);
  };

  return (
    <>
      <DashboardHeader 
        title="Reports" 
        subtitle="Generate and analyze reports across all modules"
      />

      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="prebuilt">Prebuilt Reports</TabsTrigger>
                  <TabsTrigger value="builder">Report Builder</TabsTrigger>
                  <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
                  <TabsTrigger value="integrations">Module Integration</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Layout:</span>
                  <Select value={reportLayout} onValueChange={handleLayoutChange}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="prebuilt" className="mt-0">
                <PrebuiltReports layout={reportLayout} />
              </TabsContent>

              <TabsContent value="builder" className="mt-0">
                <ReportBuilder />
              </TabsContent>

              <TabsContent value="scheduled" className="mt-0">
                <ScheduledReports />
              </TabsContent>

              <TabsContent value="integrations" className="mt-0">
                <ModuleIntegration onNavigateToModule={handleNavigateToModule} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Reports;
