
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterX, Search, SlidersHorizontal, Zap } from 'lucide-react';
import CAPADashboard from '@/components/capa/CAPADashboard';
import CAPAList from '@/components/capa/CAPAList';
import CAPAEffectiveness from '@/components/capa/CAPAEffectiveness';
import CAPAReports from '@/components/capa/CAPAReports';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import CreateCAPADialog from '@/components/capa/CreateCAPADialog';
import AutomatedCAPAGenerator from '@/components/capa/AutomatedCAPAGenerator';

// Mock data for demo purposes
const mockFindings = [
  {
    id: 'AF-2023-095',
    title: 'Sanitation verification swab results show recurring issues in packaging area',
    description: 'Multiple swab results show increasing levels of Listeria indicators in the packaging area despite regular sanitation procedures.',
    source: 'audit',
    sourceId: 'AUDIT-2023-14',
    date: '2023-11-10',
    severity: 'critical'
  }
];

const CAPA = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    source: 'all',
    dueDate: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutomation, setShowAutomation] = useState(false);
  
  const { toast: uiToast } = useToast();

  const handleCAPACreated = (capaData: any) => {
    uiToast({
      title: "CAPA Created",
      description: `New CAPA "${capaData.title}" has been created`
    });
    // In a real app, we would refresh the data from the API here
    setShowAutomation(false);
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      source: 'all',
      dueDate: 'all'
    });
    setSearchQuery('');
    
    uiToast({
      title: "Filters Reset",
      description: "All filters have been cleared"
    });
  };

  const toggleAutomation = () => {
    setShowAutomation(!showAutomation);
    
    if (!showAutomation) {
      toast.info("Displaying auto-detected issues requiring CAPA");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="CAPA Management" 
        subtitle="Manage corrective and preventive actions across all compliance modules"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex-1 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search CAPAs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.source} onValueChange={(value) => setFilters({...filters, source: value})}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
                <SelectItem value="haccp">HACCP</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="traceability">Traceability</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => uiToast({
                title: "Advanced Filters",
                description: "Advanced filtering options"
              })}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={resetFilters}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant={showAutomation ? "default" : "outline"} 
              onClick={toggleAutomation}
              className="flex items-center"
            >
              <Zap className="h-4 w-4 mr-2" />
              Auto-Detected Issues
              {mockFindings.length > 0 && !showAutomation && (
                <span className="ml-1 bg-red-100 text-red-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {mockFindings.length}
                </span>
              )}
            </Button>
            
            <CreateCAPADialog onCAPACreated={handleCAPACreated} />
          </div>
        </div>
        
        {showAutomation && (
          <div className="mb-6">
            <AutomatedCAPAGenerator onCAPACreated={handleCAPACreated} />
          </div>
        )}
        
        <Tabs 
          defaultValue="dashboard" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full animate-fade-in"
        >
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="list">CAPA List</TabsTrigger>
            <TabsTrigger value="effectiveness">Effectiveness</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <CAPADashboard filters={filters} searchQuery={searchQuery} />
          </TabsContent>
          
          <TabsContent value="list">
            <CAPAList filters={filters} searchQuery={searchQuery} />
          </TabsContent>
          
          <TabsContent value="effectiveness">
            <CAPAEffectiveness />
          </TabsContent>
          
          <TabsContent value="reports">
            <CAPAReports />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CAPA;
