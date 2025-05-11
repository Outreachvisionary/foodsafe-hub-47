
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/components/DashboardHeader';
import { ClipboardCheck, FileCheck, BarChart3, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

const HACCP = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <DashboardHeader 
        title="HACCP Management" 
        subtitle="Manage your HACCP plans, monitoring, and verification activities" 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs />
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span>HACCP Plans</span>
            </TabsTrigger>
            <TabsTrigger value="ccps" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Critical Points</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Monitoring</span>
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Verification</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="Active HACCP Plans" 
                value="12" 
                description="Currently implemented plans" 
                trend="up" 
              />
              <StatCard 
                title="Critical Control Points" 
                value="28" 
                description="Monitored across all plans" 
                trend="stable" 
              />
              <StatCard 
                title="Verification Activities" 
                value="8" 
                description="Scheduled this month" 
                trend="down" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Recent HACCP activities will be displayed here.</p>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">HACCP program status will be displayed here.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="plans">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>HACCP Plans</CardTitle>
                <Button onClick={() => navigate('/haccp-module')}>
                  Manage HACCP Plans
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">View and manage your HACCP plans.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ccps">
            <Card>
              <CardHeader>
                <CardTitle>Critical Control Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Manage critical control points for your HACCP plans.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle>Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Monitor your HACCP activities and record data.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Verify the effectiveness of your HACCP plan.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, description, trend }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{title}</span>
          <span className="text-3xl font-bold mt-1">{value}</span>
          <span className="text-xs text-gray-500 mt-1">{description}</span>
          {trend && (
            <div className="mt-2">
              {trend === 'up' && <span className="text-green-500 text-xs">↑ Increasing</span>}
              {trend === 'down' && <span className="text-red-500 text-xs">↓ Decreasing</span>}
              {trend === 'stable' && <span className="text-blue-500 text-xs">→ Stable</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HACCP;
