
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCcw, Calendar } from 'lucide-react';
import AuditChecklist from '@/components/audits/AuditChecklist';
import ScheduleAuditForm from '@/components/audits/ScheduleAuditForm';
import SidebarLayout from '@/components/layout/SidebarLayout';

const AuditsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Audit Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage internal and external audits
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Audit
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule Audit</TabsTrigger>
            <TabsTrigger value="checklist">Audit Checklist</TabsTrigger>
            <TabsTrigger value="reports">Audit Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Audit Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Audit dashboard and statistics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleAuditForm />
          </TabsContent>

          <TabsContent value="checklist">
            <AuditChecklist />
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Audit Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Audit reports and findings will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default AuditsModule;
