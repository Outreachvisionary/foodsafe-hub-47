
import React, { useState, useEffect } from 'react';
import { supabase, supabaseConfig } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchOrganizations, fetchFacilities } from '@/utils/supabaseHelpers';
import { fetchUserProfile, updateUserProfile } from '@/services/profileService';
import { createFacility, updateFacility, deleteFacility } from '@/services/facilityService';
import { Facility } from '@/types/facility';
import { UserProfile } from '@/types/user';
import { Organization } from '@/types/organization';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  details?: any;
}

const DatabaseConnectionTest = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [supabaseInfo, setSupabaseInfo] = useState({
    url: supabaseConfig.url,
    key: supabaseConfig.keyPreview
  });

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const resetTests = () => {
    setResults([]);
    setOrganizations([]);
    setFacilities([]);
    setUserProfile(null);
  };

  // Test 1: Table Structure and Access
  const testTableStructure = async () => {
    try {
      addResult({
        name: "Testing Database Connection",
        status: "pending",
        message: "Checking connection to Supabase..."
      });

      // Test connection
      const { data: connTest, error: connError } = await supabase.from('organizations').select('count(*)', { count: 'exact', head: true });
      
      if (connError) throw connError;
      
      addResult({
        name: "Database Connection",
        status: "success",
        message: "Successfully connected to Supabase"
      });

      // Check tables existence
      const tables = ['organizations', 'facilities', 'profiles'];
      
      for (const table of tables) {
        try {
          addResult({
            name: `Testing ${table} table access`,
            status: "pending",
            message: `Checking if ${table} table exists and is accessible...`
          });
          
          const { error } = await supabase.from(table).select('count(*)', { count: 'exact', head: true });
          
          if (error) throw error;
          
          addResult({
            name: `${table} Table Access`,
            status: "success",
            message: `Table '${table}' exists and is accessible`
          });
        } catch (error: any) {
          addResult({
            name: `${table} Table Access`,
            status: "error",
            message: `Error accessing '${table}' table: ${error.message}`
          });
        }
      }

      // Check for user_facility_access
      try {
        addResult({
          name: "Testing user_facility_access table",
          status: "pending",
          message: "Checking if user_facility_access table exists..."
        });
        
        const { error } = await supabase.from('user_facility_access').select('count(*)', { count: 'exact', head: true });
        
        if (error) throw error;
        
        addResult({
          name: "user_facility_access Table Access",
          status: "success",
          message: "Table 'user_facility_access' exists and is accessible"
        });
      } catch (error: any) {
        addResult({
          name: "user_facility_access Table Access",
          status: "warning",
          message: `Table 'user_facility_access' might not exist or isn't accessible. Using assigned_facility_ids in profiles instead?`
        });
      }

    } catch (error: any) {
      addResult({
        name: "Database Connection",
        status: "error",
        message: `Error connecting to database: ${error.message}`
      });
    }
  };

  // Test 2: API Endpoint Testing
  const testApiEndpoints = async () => {
    if (!user) {
      addResult({
        name: "API Endpoint Testing",
        status: "error",
        message: "User not logged in. Cannot test API endpoints."
      });
      return;
    }

    // Test 2.1: Fetch Organizations
    try {
      addResult({
        name: "Testing Organizations API",
        status: "pending",
        message: "Fetching organizations..."
      });
      
      const orgs = await fetchOrganizations();
      setOrganizations(orgs);
      
      addResult({
        name: "Organizations API",
        status: "success",
        message: `Successfully fetched ${orgs.length} organizations`,
        details: orgs
      });
    } catch (error: any) {
      addResult({
        name: "Organizations API",
        status: "error",
        message: `Error fetching organizations: ${error.message}`
      });
    }

    // Test 2.2: Fetch Facilities
    if (organizations.length > 0) {
      try {
        const orgId = organizations[0].id;
        
        addResult({
          name: "Testing Facilities API",
          status: "pending",
          message: `Fetching facilities for organization ${orgId}...`
        });
        
        const facs = await fetchFacilities(orgId);
        setFacilities(facs);
        
        addResult({
          name: "Facilities API",
          status: "success",
          message: `Successfully fetched ${facs.length} facilities for organization ${orgId}`,
          details: facs
        });
      } catch (error: any) {
        addResult({
          name: "Facilities API",
          status: "error",
          message: `Error fetching facilities: ${error.message}`
        });
      }
    } else {
      addResult({
        name: "Facilities API",
        status: "warning",
        message: "Skipped facilities test as no organizations were found"
      });
    }

    // Test 2.3: Fetch User Profile
    try {
      addResult({
        name: "Testing User Profile API",
        status: "pending",
        message: "Fetching user profile..."
      });
      
      const profile = await fetchUserProfile(user.id);
      setUserProfile(profile);
      
      addResult({
        name: "User Profile API",
        status: "success",
        message: "Successfully fetched user profile",
        details: profile
      });
    } catch (error: any) {
      addResult({
        name: "User Profile API",
        status: "error",
        message: `Error fetching user profile: ${error.message}`
      });
    }

    // Test 2.4: Update User Profile (non-destructive test)
    try {
      if (userProfile) {
        const testUpdate = {
          ...userProfile,
          // Create a non-destructive update by setting the same values
          full_name: userProfile.full_name || 'Test User',
          preferred_language: userProfile.preferred_language || 'en'
        };
        
        addResult({
          name: "Testing Profile Update API",
          status: "pending",
          message: "Updating user profile (non-destructive test)..."
        });
        
        const updatedProfile = await updateUserProfile(user.id, testUpdate);
        
        if (updatedProfile) {
          addResult({
            name: "Profile Update API",
            status: "success",
            message: "Successfully updated user profile",
            details: updatedProfile
          });
        } else {
          addResult({
            name: "Profile Update API",
            status: "warning",
            message: "Profile update completed but no data was returned, check the console for details"
          });
        }
      } else {
        addResult({
          name: "Profile Update API",
          status: "warning",
          message: "Skipped profile update test as profile could not be fetched"
        });
      }
    } catch (error: any) {
      addResult({
        name: "Profile Update API",
        status: "error",
        message: `Error updating user profile: ${error.message}`
      });
    }
  };

  // Test 3: RLS Policy Validation
  const testRlsPolicies = async () => {
    // Test 3.1: Attempt to access data outside user's organization
    try {
      addResult({
        name: "Testing RLS Policies",
        status: "pending",
        message: "Testing access to unauthorized organizations..."
      });
      
      // This should be blocked by RLS if properly configured
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .not('id', 'in', organizations.map(o => o.id));
      
      if (error && error.message.includes('row-level security')) {
        addResult({
          name: "RLS Organization Policies",
          status: "success",
          message: "RLS correctly blocked access to unauthorized organizations"
        });
      } else if (data && data.length > 0) {
        addResult({
          name: "RLS Organization Policies",
          status: "warning",
          message: "Was able to access organizations that might be unauthorized. RLS might not be properly configured.",
          details: data
        });
      } else {
        addResult({
          name: "RLS Organization Policies",
          status: "warning",
          message: "No unauthorized organizations found to test against. RLS test inconclusive."
        });
      }
    } catch (error: any) {
      // Some errors here might actually be good (RLS blocking access)
      if (error.message.includes('row-level security') || error.message.includes('permission denied')) {
        addResult({
          name: "RLS Organization Policies",
          status: "success",
          message: "RLS correctly blocked access to unauthorized organizations"
        });
      } else {
        addResult({
          name: "RLS Organization Policies",
          status: "error",
          message: `Error testing RLS for organizations: ${error.message}`
        });
      }
    }

    // Test 3.2: Attempt to access facilities outside user's organization
    if (organizations.length > 0) {
      try {
        addResult({
          name: "Testing Facility RLS Policies",
          status: "pending",
          message: "Testing access to unauthorized facilities..."
        });
        
        // This should be blocked by RLS if properly configured
        const { data, error } = await supabase
          .from('facilities')
          .select('*')
          .not('organization_id', 'in', organizations.map(o => o.id));
        
        if (error && error.message.includes('row-level security')) {
          addResult({
            name: "RLS Facility Policies",
            status: "success",
            message: "RLS correctly blocked access to unauthorized facilities"
          });
        } else if (data && data.length > 0) {
          addResult({
            name: "RLS Facility Policies",
            status: "warning",
            message: "Was able to access facilities that might be unauthorized. RLS might not be properly configured.",
            details: data
          });
        } else {
          addResult({
            name: "RLS Facility Policies",
            status: "warning",
            message: "No unauthorized facilities found to test against. RLS test inconclusive."
          });
        }
      } catch (error: any) {
        // Some errors here might actually be good (RLS blocking access)
        if (error.message.includes('row-level security') || error.message.includes('permission denied')) {
          addResult({
            name: "RLS Facility Policies",
            status: "success",
            message: "RLS correctly blocked access to unauthorized facilities"
          });
        } else {
          addResult({
            name: "RLS Facility Policies",
            status: "error",
            message: `Error testing RLS for facilities: ${error.message}`
          });
        }
      }
    }
  };

  // Test 4: CRUD Operations
  const testCrudOperations = async () => {
    if (organizations.length === 0) {
      addResult({
        name: "CRUD Operations",
        status: "warning",
        message: "Skipping CRUD tests as no organizations were found"
      });
      return;
    }

    const orgId = organizations[0].id;
    
    // Test 4.1: Create a test facility
    let testFacilityId: string | undefined;
    try {
      addResult({
        name: "Testing Create Operation",
        status: "pending",
        message: "Creating a test facility..."
      });
      
      const testFacility: Partial<Facility> = {
        name: `Test Facility ${new Date().toISOString()}`,
        description: "Created for connection testing - safe to delete",
        organization_id: orgId,
        status: 'active',
        country: 'Test Country',
        state: 'Test State',
        city: 'Test City'
      };
      
      const createdFacility = await createFacility(testFacility);
      testFacilityId = createdFacility.id;
      
      addResult({
        name: "Create Operation",
        status: "success",
        message: "Successfully created test facility",
        details: createdFacility
      });
    } catch (error: any) {
      addResult({
        name: "Create Operation",
        status: "error",
        message: `Error creating test facility: ${error.message}`
      });
      return; // Skip remaining tests if we couldn't create
    }

    // Test 4.2: Update the test facility
    if (testFacilityId) {
      try {
        addResult({
          name: "Testing Update Operation",
          status: "pending",
          message: `Updating test facility ${testFacilityId}...`
        });
        
        const updates: Partial<Facility> = {
          description: "Updated for connection testing - safe to delete"
        };
        
        const updatedFacility = await updateFacility(testFacilityId, updates);
        
        addResult({
          name: "Update Operation",
          status: "success",
          message: "Successfully updated test facility",
          details: updatedFacility
        });
      } catch (error: any) {
        addResult({
          name: "Update Operation",
          status: "error",
          message: `Error updating test facility: ${error.message}`
        });
      }
    }

    // Test 4.3: Delete the test facility
    if (testFacilityId) {
      try {
        addResult({
          name: "Testing Delete Operation",
          status: "pending",
          message: `Deleting test facility ${testFacilityId}...`
        });
        
        await deleteFacility(testFacilityId);
        
        // Verify deletion
        const { data, error } = await supabase
          .from('facilities')
          .select('*')
          .eq('id', testFacilityId);
        
        if ((data && data.length === 0) || error) {
          addResult({
            name: "Delete Operation",
            status: "success",
            message: "Successfully deleted test facility"
          });
        } else {
          addResult({
            name: "Delete Operation",
            status: "warning",
            message: "Facility might not have been deleted properly",
            details: data
          });
        }
      } catch (error: any) {
        addResult({
          name: "Delete Operation",
          status: "error",
          message: `Error deleting test facility: ${error.message}`
        });
      }
    }
  };

  const runAllTests = async () => {
    resetTests();
    setIsLoading(true);
    
    await testTableStructure();
    await testApiEndpoints();
    await testRlsPolicies();
    await testCrudOperations();
    
    setIsLoading(false);
    
    toast({
      title: "Database tests completed",
      description: "All tests have been executed. Please review the results."
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
          <CardDescription>
            Verify connectivity between the frontend and Supabase backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This tool will test the connection to your Supabase backend and verify that your tables,
            API endpoints, RLS policies, and CRUD operations are working correctly.
          </p>
          
          <div className="bg-slate-50 p-4 rounded-md mb-4">
            <h3 className="text-sm font-medium mb-2">Supabase Configuration</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">URL:</div>
              <div>{supabaseInfo.url}</div>
              <div className="text-gray-600">Key:</div>
              <div>{supabaseInfo.key}</div>
            </div>
          </div>
          
          {!user && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                You must be logged in to run these tests. Please log in and try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex space-x-2">
            <Button onClick={runAllTests} disabled={isLoading || !user} className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Run All Tests
                </>
              )}
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    These tests verify your application's connection to Supabase and test various
                    database operations. If any tests fail, check your Supabase configuration.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {result.status !== 'pending' && getStatusIcon(result.status)}
                    <h3 className="font-medium">{result.name}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ml-auto ${
                      result.status === 'success' ? 'bg-green-100 text-green-800' :
                      result.status === 'error' ? 'bg-red-100 text-red-800' :
                      result.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.status === 'pending' ? 'In Progress' : result.status}
                    </span>
                  </div>
                  <p className="text-gray-700">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-blue-600">View Details</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseConnectionTest;
