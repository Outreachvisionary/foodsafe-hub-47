
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, FileText, BarChart2, Shield, ClipboardCheck, Smartphone, Flask, Factory, FileSearch } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
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

        {/* Compliance Frameworks Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Compliance Frameworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* SQF Framework Card */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>SQF Edition 9</CardTitle>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Widely Used</span>
                </div>
                <CardDescription>
                  A GFSI-recognized certification standard that food manufacturers and distributors around the world rely on for a rigorous, credible food safety management system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium text-sm text-gray-500 mb-3">Modules:</h4>
                <ul className="space-y-2">
                  {[
                    { icon: <Shield className="h-4 w-4" />, text: "Management & Commitment" },
                    { icon: <CheckCircle className="h-4 w-4" />, text: "Compliance Checklist" },
                    { icon: <FileText className="h-4 w-4" />, text: "Document Control" },
                    { icon: <Smartphone className="h-4 w-4" />, text: "Tech Evaluation & Supplier" },
                    { icon: <Shield className="h-4 w-4" />, text: "Food Safety System" }
                  ].map((item, index) => (
                    <li key={index} className="flex items-center justify-between group">
                      <div className="flex items-center text-gray-700">
                        {item.icon}
                        <span className="ml-2">{item.text}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button variant="outline" size="sm" className="w-full">
                    Get Started <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* BRC Global Standard Card */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>BRC Global Standard v9</CardTitle>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">International</span>
                </div>
                <CardDescription>
                  A leading global certification program used by food manufacturers, retailers, and food service organizations to ensure standardized quality and safety.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium text-sm text-gray-500 mb-3">Modules:</h4>
                <ul className="space-y-2">
                  {[
                    { icon: <Shield className="h-4 w-4" />, text: "Senior Management" },
                    { icon: <CheckCircle className="h-4 w-4" />, text: "Compliance Checklist" },
                    { icon: <Smartphone className="h-4 w-4" />, text: "Training & Competence" },
                    { icon: <BarChart2 className="h-4 w-4" />, text: "Hazard Analysis" },
                    { icon: <FileText className="h-4 w-4" />, text: "Product Control" }
                  ].map((item, index) => (
                    <li key={index} className="flex items-center justify-between group">
                      <div className="flex items-center text-gray-700">
                        {item.icon}
                        <span className="ml-2">{item.text}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button variant="outline" size="sm" className="w-full">
                    Get Started <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* GMP Module Card */}
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>GMP Module 11</CardTitle>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Essential</span>
                </div>
                <CardDescription>
                  Good Manufacturing Practices covering the fundamental requirements for control of food safety, ensuring consistent quality and compliance with regulatory standards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium text-sm text-gray-500 mb-3">Modules:</h4>
                <ul className="space-y-2">
                  {[
                    { icon: <FileSearch className="h-4 w-4" />, text: "Site Location" },
                    { icon: <CheckCircle className="h-4 w-4" />, text: "Product Handling" },
                    { icon: <Shield className="h-4 w-4" />, text: "Personnel Practices" },
                    { icon: <Factory className="h-4 w-4" />, text: "Equipment" },
                    { icon: <FileText className="h-4 w-4" />, text: "Cleaning" }
                  ].map((item, index) => (
                    <li key={index} className="flex items-center justify-between group">
                      <div className="flex items-center text-gray-700">
                        {item.icon}
                        <span className="ml-2">{item.text}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button variant="outline" size="sm" className="w-full">
                    Get Started <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ISO 22000 Card */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>ISO 22000</CardTitle>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Coming Soon</span>
                </div>
                <CardDescription>
                  ISO 22000 is an international food safety management system that can be certified to. It maps out what an organization needs to do to demonstrate its ability to control food safety hazards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 italic">Modules coming soon</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Additional Tools Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Additional Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* QA Technician Tool */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-100 p-2 rounded">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">QA Technician Floor Checks</CardTitle>
                    <CardDescription>
                      Complete daily GMP Module 11 floor checks to verify compliance
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <Button variant="outline" size="sm" className="w-full">
                  Access Tool <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>

            {/* Dairy Operations Dashboard */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-100 p-2 rounded">
                    <BarChart2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Dairy Operations Dashboard</CardTitle>
                    <CardDescription>
                      Specialized dashboard for dairy-specific compliance metrics and quality indicators
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <Button variant="outline" size="sm" className="w-full">
                  Access Tool <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>

            {/* Laboratory Analysis Workflows */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-100 p-2 rounded">
                    <Flask className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Laboratory Analysis Workflows</CardTitle>
                    <CardDescription>
                      Streamline laboratory testing procedures and maintain quality control records
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <Button variant="outline" size="sm" className="w-full">
                  Access Tool <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Traditional Dashboard Tabs */}
        <section>
          <Tabs defaultValue="overview" className="w-full animate-fade-in mt-10">
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
  );
};

export default Dashboard;
