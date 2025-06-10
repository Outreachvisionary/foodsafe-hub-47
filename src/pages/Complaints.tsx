
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCcw, MessageSquare } from 'lucide-react';
import SidebarLayout from '@/components/layout/SidebarLayout';

const Complaints: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Complaints Management</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage customer complaints
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Log Complaint
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="investigating">Investigating</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Complaints Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Complaints dashboard and statistics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="open">
            <Card>
              <CardHeader>
                <CardTitle>Open Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Open complaints requiring attention will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investigating">
            <Card>
              <CardHeader>
                <CardTitle>Under Investigation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Complaints under investigation will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resolved">
            <Card>
              <CardHeader>
                <CardTitle>Resolved Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Resolved complaints and outcomes will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Complaints;
