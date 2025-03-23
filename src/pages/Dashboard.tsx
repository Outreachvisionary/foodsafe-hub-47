
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import SQFDashboard from '@/components/dashboard/standards/SQFDashboard';
import ISO22000Dashboard from '@/components/dashboard/standards/ISO22000Dashboard';
import FSSC22000Dashboard from '@/components/dashboard/standards/FSSC22000Dashboard';
import HACCPDashboard from '@/components/dashboard/standards/HACCPDashboard';
import BRCGS2Dashboard from '@/components/dashboard/standards/BRCGS2Dashboard';
import SidebarLayout from '@/components/layout/SidebarLayout';

const Dashboard = () => {
  return (
    <SidebarLayout>
      <div className="bg-gray-50">
        <DashboardHeader 
          title="Food Safety Management System" 
          subtitle="Your comprehensive food safety compliance platform with integrated workflow automation" 
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="mb-10 p-8 bg-gradient-to-r from-fsms-blue to-blue-600 rounded-xl text-white">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold mb-4">FoodCompli</h1>
              <p className="text-xl mb-6">
                Your comprehensive food safety compliance platform with integrated workflow automation
              </p>
              <div className="flex space-x-4">
                <Link to="/dashboard/overview">
                  <Button className="bg-white text-fsms-blue hover:bg-gray-100">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/standards">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                    View Standards
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Traditional Dashboard Tabs */}
          <section>
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
          </section>
        </main>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
