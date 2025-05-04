
import React from 'react';
import { BarChart, LineChart } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Analytics = () => {
  return (
    <>
      <DashboardHeader 
        title="Analytics" 
        subtitle="Analyze data across all modules and gain insights"
      />

      <div className="container mx-auto py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-primary" />
                    Document Compliance
                  </CardTitle>
                  <CardDescription>Document status breakdowns</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center border-t">
                  <p className="text-muted-foreground">Chart visualization will appear here</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-primary" />
                    CAPA Trends
                  </CardTitle>
                  <CardDescription>Corrective actions over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center border-t">
                  <p className="text-muted-foreground">Chart visualization will appear here</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-primary" />
                    Audit Performance
                  </CardTitle>
                  <CardDescription>Findings and observations</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center border-t">
                  <p className="text-muted-foreground">Chart visualization will appear here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="compliance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Analytics</CardTitle>
                <CardDescription>Detailed compliance metrics across all modules</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">Compliance analytics content will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>Historical data patterns and projections</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">Trend analysis content will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="custom" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Analytics</CardTitle>
                <CardDescription>Build your own analytics views</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">Custom analytics builder will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Analytics;
