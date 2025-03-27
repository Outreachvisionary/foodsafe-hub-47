
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import SQFDashboard from '@/components/dashboard/standards/SQFDashboard';
import ISO22000Dashboard from '@/components/dashboard/standards/ISO22000Dashboard';
import FSSC22000Dashboard from '@/components/dashboard/standards/FSSC22000Dashboard';
import HACCPDashboard from '@/components/dashboard/standards/HACCPDashboard';
import BRCDashboard from '@/components/dashboard/standards/BRCDashboard';
import AppLayout from '@/components/layout/AppLayout';

const Dashboard = () => {
  return (
    <AppLayout 
      title="Food Safety Management System" 
      subtitle="Your comprehensive food safety compliance platform with integrated workflow automation" 
    >
      {/* Dashboard Tabs */}
      <section className="mt-6">
        <Tabs defaultValue="overview" className="w-full animate-fade-in">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sqf">SQF</TabsTrigger>
            <TabsTrigger value="iso22000">ISO 22000</TabsTrigger>
            <TabsTrigger value="fssc22000">FSSC 22000</TabsTrigger>
            <TabsTrigger value="haccp">HACCP</TabsTrigger>
            <TabsTrigger value="brc">BRC</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview />
          </TabsContent>
          
          <TabsContent value="sqf">
            <SQFDashboard />
          </TabsContent>
          
          <TabsContent value="iso22000">
            <ISO22000Dashboard />
          </TabsContent>
          
          <TabsContent value="fssc22000">
            <FSSC22000Dashboard />
          </TabsContent>
          
          <TabsContent value="haccp">
            <HACCPDashboard />
          </TabsContent>
          
          <TabsContent value="brc">
            <BRCDashboard />
          </TabsContent>
        </Tabs>
      </section>
    </AppLayout>
  );
};

export default Dashboard;
