
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SuppliersList from '@/components/suppliers/SuppliersList';
import SupplierApproval from '@/components/suppliers/SupplierApproval';
import SupplierDocuments from '@/components/suppliers/SupplierDocuments';
import SupplierRiskAssessment from '@/components/suppliers/SupplierRiskAssessment';

const SupplierManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Supplier Management" 
        subtitle="Manage suppliers, documentation, and compliance" 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="suppliers" className="w-full animate-fade-in">
          <TabsList className="mb-8">
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="approval">Approval Workflow</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="suppliers" className="space-y-6">
            <SuppliersList />
          </TabsContent>
          
          <TabsContent value="approval" className="space-y-6">
            <SupplierApproval />
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6">
            <SupplierDocuments />
          </TabsContent>
          
          <TabsContent value="risk" className="space-y-6">
            <SupplierRiskAssessment />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SupplierManagement;
