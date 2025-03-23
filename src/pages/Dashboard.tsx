
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import SQFDashboard from '@/components/dashboard/standards/SQFDashboard';
import ISO22000Dashboard from '@/components/dashboard/standards/ISO22000Dashboard';
import FSSC22000Dashboard from '@/components/dashboard/standards/FSSC22000Dashboard';
import HACCPDashboard from '@/components/dashboard/standards/HACCPDashboard';
import BRCDashboard from '@/components/dashboard/standards/BRCGS2Dashboard';
import SidebarLayout from '@/components/layout/SidebarLayout';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

const Dashboard = () => {
  return (
    <SidebarLayout>
      <div className="bg-gray-50 min-h-screen">
        <DashboardHeader 
          title="Food Safety Management System" 
          subtitle="Your comprehensive food safety compliance platform with integrated workflow automation" 
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs />
          
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
        </main>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
