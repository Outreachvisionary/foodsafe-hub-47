import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, FileText, AlertTriangle, Check, BarChart, CirclePlus, ListChecks, ShieldAlert, Clipboard, Download, FileEdit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

const HaccpModule = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const { toast } = useToast();
  
  const handleCreatePlan = () => {
    toast({
      title: "Success!",
      description: "New HACCP plan created",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="HACCP & Risk Assessment" 
        subtitle="Build, manage, and monitor HACCP plans and risk assessments for all your food safety standards" 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        
        <Tabs defaultValue="plans" value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
          <TabsList className="mb-8">
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              <span>HACCP Plans</span>
            </TabsTrigger>
            <TabsTrigger value="hazards" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>Hazard Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="ccps" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Critical Control Points</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Monitoring</span>
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <Clipboard className="h-4 w-4" />
              <span>Risk Assessment</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {activeTab === 'plans' && 'HACCP Plans'}
              {activeTab === 'hazards' && 'Hazard Analysis'}
              {activeTab === 'ccps' && 'Critical Control Points'}
              {activeTab === 'monitoring' && 'Monitoring Procedures'}
              {activeTab === 'risk' && 'Risk Assessment Models'}
            </h2>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>
                    {activeTab === 'plans' && 'New Plan'}
                    {activeTab === 'hazards' && 'New Hazard Analysis'}
                    {activeTab === 'ccps' && 'New CCP'}
                    {activeTab === 'monitoring' && 'New Procedure'}
                    {activeTab === 'risk' && 'New Assessment'}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>
                    {activeTab === 'plans' && 'Create New HACCP Plan'}
                    {activeTab === 'hazards' && 'New Hazard Analysis Worksheet'}
                    {activeTab === 'ccps' && 'Define New Critical Control Point'}
                    {activeTab === 'monitoring' && 'Create Monitoring Procedure'}
                    {activeTab === 'risk' && 'New Risk Assessment'}
                  </DialogTitle>
                  <DialogDescription>
                    {activeTab === 'plans' && 'Start a new HACCP plan from scratch or choose from templates.'}
                    {activeTab === 'hazards' && 'Document potential hazards, their significance, and preventive measures.'}
                    {activeTab === 'ccps' && 'Define critical limits, monitoring procedures, and corrective actions.'}
                    {activeTab === 'monitoring' && 'Set up monitoring procedures for your critical control points.'}
                    {activeTab === 'risk' && 'Evaluate and document food safety risks using standard methodologies.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter a title..." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea 
                      id="description" 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                      placeholder="Describe the scope and purpose..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="standard">Applicable Standard</Label>
                    <select 
                      id="standard"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="SQF">SQF</option>
                      <option value="ISO22000">ISO 22000</option>
                      <option value="FSSC22000">FSSC 22000</option>
                      <option value="HACCP">HACCP</option>
                      <option value="BRCGS2">BRC GS2</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline">Cancel</Button>
                  <Button type="button" onClick={handleCreatePlan}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Example HACCP Plans */}
              {[
                {
                  title: "Raw Material Receiving HACCP Plan",
                  description: "Controls and monitoring for raw material receiving process",
                  standard: "SQF",
                  lastUpdated: "2023-04-15",
                  ccpCount: 2,
                },
                {
                  title: "Cooking Process HACCP Plan",
                  description: "Temperature controls and monitoring for cooking processes",
                  standard: "FSSC 22000",
                  lastUpdated: "2023-05-22",
                  ccpCount: 3,
                },
                {
                  title: "Packaging HACCP Plan",
                  description: "Controls for packaging integrity and foreign material",
                  standard: "BRC GS2",
                  lastUpdated: "2023-03-10",
                  ccpCount: 1,
                },
                {
                  title: "Cold Storage HACCP Plan",
                  description: "Temperature monitoring for refrigerated storage",
                  standard: "ISO 22000",
                  lastUpdated: "2023-06-01",
                  ccpCount: 1,
                },
                {
                  title: "Product Distribution HACCP Plan",
                  description: "Controls for product distribution and transportation",
                  standard: "HACCP",
                  lastUpdated: "2023-05-17",
                  ccpCount: 2,
                }
              ].map((plan, index) => (
                <Card key={index} className="hover:shadow-md transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <ShieldAlert className="h-4 w-4" />
                      <span>{plan.standard}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{plan.ccpCount} Critical Control {plan.ccpCount === 1 ? 'Point' : 'Points'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FileText className="h-4 w-4" />
                      <span>Last updated: {plan.lastUpdated}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <FileEdit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>Export</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Add New Plan Card */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="hover:shadow-md transition-all duration-200 border-dashed border-2 flex flex-col items-center justify-center cursor-pointer h-[294px]">
                    <CardContent className="flex flex-col items-center justify-center h-full">
                      <CirclePlus className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 font-medium">Create New HACCP Plan</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Create New HACCP Plan</DialogTitle>
                    <DialogDescription>
                      Start a new HACCP plan from scratch or choose from templates.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Enter a title..." />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea 
                        id="description" 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                        placeholder="Describe the scope and purpose..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="standard">Applicable Standard</Label>
                      <select 
                        id="standard"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="SQF">SQF</option>
                        <option value="ISO22000">ISO 22000</option>
                        <option value="FSSC22000">FSSC 22000</option>
                        <option value="HACCP">HACCP</option>
                        <option value="BRCGS2">BRC GS2</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline">Cancel</Button>
                    <Button type="button" onClick={handleCreatePlan}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
          
          <TabsContent value="hazards" className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ShieldAlert className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Hazard Analysis Coming Soon</h3>
              <p>Comprehensive hazard analysis tools for your HACCP plans will be available in the next update.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="ccps" className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Critical Control Points Coming Soon</h3>
              <p>Tools for defining and monitoring critical control points will be available in the next update.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="monitoring" className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Monitoring Procedures Coming Soon</h3>
              <p>Comprehensive monitoring procedure tools will be available in the next update.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="risk" className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Clipboard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Risk Assessment Models Coming Soon</h3>
              <p>Comprehensive risk assessment tools will be available in the next update.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HaccpModule;
