
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCcw, ShieldCheck } from 'lucide-react';
import SidebarLayout from '@/components/layout/SidebarLayout';

const HACCP: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">HACCP Management</h1>
            <p className="text-muted-foreground mt-1">
              Hazard Analysis and Critical Control Points
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create HACCP Plan
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hazards">Hazard Analysis</TabsTrigger>
            <TabsTrigger value="ccps">Critical Control Points</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  HACCP Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>HACCP system overview and status will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hazards">
            <Card>
              <CardHeader>
                <CardTitle>Hazard Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Hazard identification and analysis will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ccps">
            <Card>
              <CardHeader>
                <CardTitle>Critical Control Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Critical control points management will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle>Monitoring Procedures</CardTitle>
              </CardHeader>
              <CardContent>
                <p>CCP monitoring procedures and records will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Verification Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p>HACCP verification activities will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default HACCP;
