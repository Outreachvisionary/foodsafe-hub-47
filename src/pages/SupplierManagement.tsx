
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCcw } from 'lucide-react';
import SuppliersList from '@/components/suppliers/SuppliersList';
import SupplierApproval from '@/components/suppliers/SupplierApproval';
import SupplierRiskAssessment from '@/components/suppliers/SupplierRiskAssessment';
import SidebarLayout from '@/components/layout/SidebarLayout';

const SupplierManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('suppliers');

  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Supplier Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage supplier relationships and compliance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="suppliers">All Suppliers</TabsTrigger>
            <TabsTrigger value="approval">Approval Process</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers">
            <SuppliersList />
          </TabsContent>

          <TabsContent value="approval">
            <SupplierApproval />
          </TabsContent>

          <TabsContent value="risk">
            <SupplierRiskAssessment />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default SupplierManagement;
