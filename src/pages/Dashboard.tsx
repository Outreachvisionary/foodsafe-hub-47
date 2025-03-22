
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import SQFDashboard from '@/components/dashboard/standards/SQFDashboard';
import ISO22000Dashboard from '@/components/dashboard/standards/ISO22000Dashboard';
import FSSC22000Dashboard from '@/components/dashboard/standards/FSSC22000Dashboard';
import HACCPDashboard from '@/components/dashboard/standards/HACCPDashboard';
import BRCGS2Dashboard from '@/components/dashboard/standards/BRCGS2Dashboard';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="FSMS Dashboard" 
        subtitle="Welcome back! Here's an overview of your food safety compliance." 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="w-full animate-fade-in">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sqf">SQF</TabsTrigger>
            <TabsTrigger value="iso22000">ISO 22000</TabsTrigger>
            <TabsTrigger value="fssc22000">FSSC 22000</TabsTrigger>
            <TabsTrigger value="haccp">HACCP</TabsTrigger>
            <TabsTrigger value="brcgs2">BRC GS2</TabsTrigger>
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
          
          <TabsContent value="brcgs2">
            <BRCGS2Dashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
