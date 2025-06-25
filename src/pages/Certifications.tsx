
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCcw, Award, Download, Upload, BarChart3 } from 'lucide-react';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { useCertifications } from '@/hooks/useCertifications';
import CertificationOverview from '@/components/certifications/CertificationOverview';
import CertificationList from '@/components/certifications/CertificationList';
import EmployeeCertificationsList from '@/components/certifications/EmployeeCertificationsList';
import CreateCertificationDialog from '@/components/certifications/CreateCertificationDialog';
import ImportExportDialog from '@/components/certifications/ImportExportDialog';

const Certifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportExportDialog, setShowImportExportDialog] = useState(false);
  
  const { 
    certifications, 
    employeeCertifications, 
    stats, 
    isLoading, 
    refetch 
  } = useCertifications();

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Certifications</h1>
            <p className="text-muted-foreground mt-1">
              Manage compliance certifications and employee credentials
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowImportExportDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import/Export
            </Button>
            <Button variant="outline" onClick={refetch}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <Award className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="certifications">Certification Types</TabsTrigger>
            <TabsTrigger value="employee-certs">Employee Certifications</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <CertificationOverview 
              stats={stats} 
              recentCertifications={employeeCertifications.slice(0, 5)}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="certifications">
            <CertificationList 
              certifications={certifications}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="employee-certs">
            <EmployeeCertificationsList 
              employeeCertifications={employeeCertifications}
              certifications={certifications}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="expiring">
            <EmployeeCertificationsList 
              employeeCertifications={employeeCertifications.filter(cert => {
                const expiryDate = new Date(cert.expiry_date);
                const today = new Date();
                const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
              })}
              certifications={certifications}
              isLoading={isLoading}
              title="Expiring Soon"
            />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Certification Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Total Certifications</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.total_certifications}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900">Active</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.active_certifications}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-900">Expiring Soon</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.expiring_soon}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-900">Expired</h3>
                    <p className="text-2xl font-bold text-red-600">{stats.expired_certifications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <CreateCertificationDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />

        <ImportExportDialog 
          open={showImportExportDialog}
          onOpenChange={setShowImportExportDialog}
        />
      </div>
    </ProtectedSidebarLayout>
  );
};

export default Certifications;
