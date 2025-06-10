
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCcw, BookOpen } from 'lucide-react';
import SidebarLayout from '@/components/layout/SidebarLayout';

const Standards: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Standards Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage compliance standards and requirements
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Standard
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="iso22000">ISO 22000</TabsTrigger>
            <TabsTrigger value="sqf">SQF</TabsTrigger>
            <TabsTrigger value="brc">BRC</TabsTrigger>
            <TabsTrigger value="fssc22000">FSSC 22000</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Standards Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Standards dashboard and compliance status will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="iso22000">
            <Card>
              <CardHeader>
                <CardTitle>ISO 22000</CardTitle>
              </CardHeader>
              <CardContent>
                <p>ISO 22000 requirements and compliance tracking will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sqf">
            <Card>
              <CardHeader>
                <CardTitle>SQF (Safe Quality Food)</CardTitle>
              </CardHeader>
              <CardContent>
                <p>SQF requirements and compliance tracking will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brc">
            <Card>
              <CardHeader>
                <CardTitle>BRC Global Standards</CardTitle>
              </CardHeader>
              <CardContent>
                <p>BRC requirements and compliance tracking will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fssc22000">
            <Card>
              <CardHeader>
                <CardTitle>FSSC 22000</CardTitle>
              </CardHeader>
              <CardContent>
                <p>FSSC 22000 requirements and compliance tracking will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Standards;
