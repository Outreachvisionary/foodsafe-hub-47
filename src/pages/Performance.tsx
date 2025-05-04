
import React from 'react';
import { Gauge, TrendingUp, Activity } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Performance = () => {
  return (
    <>
      <DashboardHeader 
        title="Performance Monitoring" 
        subtitle="Track key performance indicators and metrics across the organization"
      />

      <div className="container mx-auto py-6">
        <Tabs defaultValue="kpis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kpis">Key Performance Indicators</TabsTrigger>
            <TabsTrigger value="metrics">Operational Metrics</TabsTrigger>
            <TabsTrigger value="reports">Performance Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kpis" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gauge className="h-5 w-5 mr-2 text-primary" />
                    Quality Score
                  </CardTitle>
                  <CardDescription>Overall quality performance</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-primary">92%</div>
                    <div className="text-sm text-muted-foreground mt-2">+2.5% from last month</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    Compliance Rate
                  </CardTitle>
                  <CardDescription>Regulatory compliance status</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-primary">87%</div>
                    <div className="text-sm text-muted-foreground mt-2">-1.3% from last month</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    Training Effectiveness
                  </CardTitle>
                  <CardDescription>Training impact assessment</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-primary">78%</div>
                    <div className="text-sm text-muted-foreground mt-2">+5.2% from last month</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>KPI Trends</CardTitle>
                <CardDescription>Performance over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Chart visualization will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Operational Metrics</CardTitle>
                <CardDescription>Detailed metrics by department and process</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">Operational metrics content will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Reports</CardTitle>
                <CardDescription>Scheduled and on-demand performance reports</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">Performance reports will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Performance;
