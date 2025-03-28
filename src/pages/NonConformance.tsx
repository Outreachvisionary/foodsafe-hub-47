
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarLayout from '@/components/layout/SidebarLayout';
import NCDashboard from '@/components/non-conformance/NCDashboard';
import NCList from '@/components/non-conformance/NCList';
import NCDetails from '@/components/non-conformance/NCDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NonConformanceModule: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  return (
    <SidebarLayout>
      <div className="flex flex-col space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Non-Conformance Management</h1>
        </div>
        
        {id ? (
          <NCDetails id={id} onClose={() => navigate('/non-conformance')} />
        ) : (
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="list">Non-Conformance Items</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <NCDashboard />
            </TabsContent>
            <TabsContent value="list">
              <NCList />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </SidebarLayout>
  );
};

export default NonConformanceModule;
