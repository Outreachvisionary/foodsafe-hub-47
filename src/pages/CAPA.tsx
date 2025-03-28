
import React, { useState, useCallback, useMemo } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import CreateCAPADialog from '@/components/capa/CreateCAPADialog';
import AutomatedCAPAGenerator from '@/components/capa/AutomatedCAPAGenerator';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import CAPADashboard from '@/components/capa/CAPADashboard';
import CAPAList from '@/components/capa/CAPAList';
import CAPAEffectiveness from '@/components/capa/CAPAEffectiveness';
import CAPAReports from '@/components/capa/CAPAReports';
import CAPAFilters from '@/components/capa/CAPAFilters';
import { CAPAFilters as CAPAFiltersType } from '@/types/capa';

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
  const [filters, setFilters] = useState<CAPAFiltersType>({
    status: 'all',
    priority: 'all',
    source: 'all',
    dueDate: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutomation, setShowAutomation] = useState(false);
  
  const handleCAPACreated = useCallback((capaData: any) => {
    toast({
      title: "CAPA Created",
      description: `New CAPA "${capaData.title}" has been created`
    });
    // In a real app, we would refresh the data from the API here
    setShowAutomation(false);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: 'all',
      priority: 'all',
      source: 'all',
      dueDate: 'all'
    });
    setSearchQuery('');
    
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared"
    });
  }, []);

  const toggleAutomation = useCallback(() => {
    setShowAutomation(!showAutomation);
    
    if (!showAutomation) {
      toast.info("Displaying auto-detected issues requiring CAPA");
    }
  }, [showAutomation]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="CAPA Management" 
        subtitle="Manage corrective and preventive actions across all compliance modules"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs />
        
        <CAPAFilters 
          filters={filters}
          searchQuery={searchQuery}
          setFilters={setFilters}
          setSearchQuery={setSearchQuery}
          resetFilters={resetFilters}
          showAutomation={showAutomation}
          toggleAutomation={toggleAutomation}
          automationCount={mockFindings.length}
        />
        
        <div className="flex justify-end space-x-2 mb-6">
          <CreateCAPADialog onCAPACreated={handleCAPACreated} />
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
