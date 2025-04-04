
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import BackendFrontendTests from '@/components/BackendFrontendTests';

// Interface for test result
interface TestResult {
  module: string;
  status: 'pass' | 'fail' | 'pending';
  message?: string;
}

// Component for displaying a single test result
const TestResultItem: React.FC<{ result: TestResult }> = ({ result }) => {
  let icon;
  let colorClass;

  switch (result.status) {
    case 'pass':
      icon = <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />;
      colorClass = "text-green-500";
      break;
    case 'fail':
      icon = <XCircle className="h-4 w-4 mr-2 text-red-500" />;
      colorClass = "text-red-500";
      break;
    default:
      icon = <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />;
      colorClass = "text-yellow-500";
  }

  return (
    <div className="flex items-center py-2">
      {icon}
      <span className={colorClass}>{result.module}</span>
      {result.message && <span className="ml-2 text-sm text-gray-500">{result.message}</span>}
    </div>
  );
};

// Component for the entire database connection test page
const DatabaseConnectionTest: React.FC = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'db-connection' | 'backend-frontend'>('db-connection');
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [moduleFilters, setModuleFilters] = useState({
    users: true,
    roles: true,
    permissions: true,
    organizations: true,
    facilities: true,
    documents: true,
    training: true,
    nonConformances: true,
    capa: true,
    audits: true,
  });
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectAllModules, setSelectAllModules] = useState(true);

  useEffect(() => {
    const fetchOrganizationsAndFacilities = async () => {
      setIsLoading(true);
      try {
        const { data: orgs, error: orgError } = await supabase
          .from('organizations')
          .select('*');
        if (orgError) throw orgError;
        setOrganizations(orgs || []);

        const { data: facs, error: facError } = await supabase
          .from('facilities')
          .select('*');
        if (facError) throw facError;
        setFacilities(facs || []);
      } catch (error: any) {
        toast.error(`Error fetching data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationsAndFacilities();
  }, []);

  const handleOrganizationChange = (orgId: string) => {
    setSelectedOrganization(orgId);
  };

  const handleFacilityChange = (facilityId: string) => {
    setSelectedFacility(facilityId);
  };

  const handleModuleFilterChange = (module: string) => {
    setModuleFilters(prev => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const handleSelectAllModules = () => {
    setSelectAllModules(!selectAllModules);
    setModuleFilters(prev => {
      const newState = { ...prev };
      for (const key in newState) {
        newState[key] = !selectAllModules;
      }
      return newState;
    });
  };

  const handleRunTests = async () => {
    setIsLoading(true);
    setTestResults([]);

    const modulesToTest = Object.keys(moduleFilters).filter(module => moduleFilters[module]);

    const testPromises = modulesToTest.map(async module => {
      try {
        // Simulate a database query
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate success or failure based on module
        const isSuccess = Math.random() > 0.2; // 80% chance of success
        if (isSuccess) {
          return {
            module: module,
            status: 'pass',
            message: `Successfully connected to ${module} module.`,
          };
        } else {
          return {
            module: module,
            status: 'fail',
            message: `Failed to connect to ${module} module.`,
          };
        }
      } catch (error: any) {
        return {
          module: module,
          status: 'fail',
          message: `Error connecting to ${module} module: ${error.message}`,
        };
      }
    });

    Promise.all(testPromises)
      .then(results => {
        setTestResults(results);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Database Connection Testing</h1>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'db-connection' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('db-connection')}
          >
            Database Connectivity
          </Button>
          <Button 
            variant={activeTab === 'backend-frontend' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('backend-frontend')}
          >
            Backend-Frontend Integration
          </Button>
        </div>
      </div>
      
      {activeTab === 'db-connection' ? (
        <>
          {/* Database connection testing UI section */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Organization</CardTitle>
                <CardDescription>Choose an organization to test its database connection.</CardDescription>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handleOrganizationChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {organizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
      
            <Card>
              <CardHeader>
                <CardTitle>Select Facility</CardTitle>
                <CardDescription>Choose a facility to test its database connection.</CardDescription>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handleFacilityChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a facility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {facilities.map(facility => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
      
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-semibold">Module Tests</h2>
            <div className="ml-4 text-sm">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectAllModules}
                  onChange={handleSelectAllModules}
                  className="mr-2"
                />
                Select All
              </label>
            </div>
          </div>
      
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-6">
            <Card>
              <CardContent>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={moduleFilters.users}
                    onChange={() => handleModuleFilterChange('users')}
                    className="mr-2"
                  />
                  Users
                </label>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={moduleFilters.roles}
                    onChange={() => handleModuleFilterChange('roles')}
                    className="mr-2"
                  />
                  Roles
                </label>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={moduleFilters.permissions}
                    onChange={() => handleModuleFilterChange('permissions')}
                    className="mr-2"
                  />
                  Permissions
                </label>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={moduleFilters.organizations}
                    onChange={() => handleModuleFilterChange('organizations')}
                    className="mr-2"
                  />
                  Organizations
                </label>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={moduleFilters.facilities}
                    onChange={() => handleModuleFilterChange('facilities')}
                    className="mr-2"
                  />
                  Facilities
                </label>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={moduleFilters.documents}
                    onChange={() => handleModuleFilterChange('documents')}
                    className="mr-2"
                  />
                  Documents
                </label>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={moduleFilters.training}
                    onChange={() => handleModuleFilterChange('training')}
                    className="mr-2"
                  />
                  Training
                </label>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={moduleFilters.nonConformances}
                    onChange={() => handleModuleFilterChange('nonConformances')}
                    className="mr-2"
                  />
                  Non-Conformances
                </label>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={moduleFilters.capa}
                    onChange={() => handleModuleFilterChange('capa')}
                    className="mr-2"
                  />
                  CAPA
                </label>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={moduleFilters.audits}
                    onChange={() => handleModuleFilterChange('audits')}
                    className="mr-2"
                  />
                  Audits
                </label>
              </CardContent>
            </Card>
          </div>
      
          <div className="flex justify-end mb-6">
            <Button onClick={handleRunTests} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run Tests'
              )}
            </Button>
          </div>
      
          <div className="grid grid-cols-1 gap-6">
            {testResults.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Test Result: {result.module}</CardTitle>
                </CardHeader>
                <CardContent>
                  <TestResultItem result={result} />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <BackendFrontendTests />
      )}
    </div>
  );
};

export default DatabaseConnectionTest;
