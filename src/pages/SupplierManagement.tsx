
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SuppliersList from '@/components/suppliers/SuppliersList';
import SupplierApproval from '@/components/suppliers/SupplierApproval';
import SupplierDocuments from '@/components/suppliers/SupplierDocuments';
import SupplierRiskAssessment from '@/components/suppliers/SupplierRiskAssessment';
import StandardSelect from '@/components/suppliers/StandardSelect';
import StandardRequirements from '@/components/suppliers/StandardRequirements';
import { StandardName } from '@/types/supplier';

const SupplierManagement = () => {
  const [selectedStandard, setSelectedStandard] = useState<StandardName>('SQF');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Supplier Management" 
        subtitle="Manage suppliers, documentation, and compliance" 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1" />
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">FSMS Standard:</span>
            <StandardSelect 
              value={selectedStandard}
              onValueChange={(value) => setSelectedStandard(value as StandardName)}
              includeAll={false}
              triggerClassName="w-[180px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3">
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
                <SupplierDocuments standard={selectedStandard} />
              </TabsContent>
              
              <TabsContent value="risk" className="space-y-6">
                <SupplierRiskAssessment />
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <StandardRequirements standard={selectedStandard} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupplierManagement;
