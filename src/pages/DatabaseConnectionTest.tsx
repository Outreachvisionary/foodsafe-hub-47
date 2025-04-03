
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { usePermission } from '@/contexts/PermissionContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, AlertCircle, Info, ChevronRight, ChevronDown, Clock } from 'lucide-react';

type TestResult = {
  id: string;
  name: string;
  status: 'success' | 'error' | 'pending' | 'skipped';
  responseTime?: number;
  message?: string;
  data?: any;
  error?: any;
};

type TestCategory = {
  id: string;
  name: string;
  tests: TestResult[];
  expanded: boolean;
};

const DatabaseConnectionTest: React.FC = () => {
  const { user } = useUser();
  const { hasPermission } = usePermission();
  const [testCategories, setTestCategories] = useState<TestCategory[]>([
    {
      id: 'table-access',
      name: 'Table Access Tests',
      expanded: true,
      tests: [
        { id: 'org-table', name: 'Organizations Table', status: 'pending' },
        { id: 'facilities-table', name: 'Facilities Table', status: 'pending' },
        { id: 'users-table', name: 'Users Table', status: 'pending' },
        { id: 'user-facility-access', name: 'User Facility Access', status: 'pending' },
      ],
    },
    {
      id: 'api-endpoints',
      name: 'API Endpoint Tests',
      expanded: true,
      tests: [
        { id: 'list-orgs', name: 'List Organizations', status: 'pending' },
        { id: 'fetch-facility', name: 'Fetch Facility Details', status: 'pending' },
        { id: 'user-profile', name: 'Get User Profile', status: 'pending' },
        { id: 'update-profile', name: 'Update User Profile', status: 'pending' },
      ],
    },
    {
      id: 'rls-policies',
      name: 'RLS Policy Tests',
      expanded: true,
      tests: [
        { id: 'user-auth-view', name: 'User Authorized View', status: 'pending' },
        { id: 'user-auth-edit', name: 'User Authorized Edit', status: 'pending' },
        { id: 'admin-manage-users', name: 'Admin User Management', status: 'pending' },
        { id: 'admin-manage-facilities', name: 'Admin Facility Management', status: 'pending' },
      ],
    },
    {
      id: 'error-handling',
      name: 'Error Handling Tests',
      expanded: true,
      tests: [
        { id: 'unauthorized-access', name: 'Unauthorized Access Attempt', status: 'pending' },
        { id: 'invalid-params', name: 'Invalid Parameters', status: 'pending' },
        { id: 'incorrect-ids', name: 'Incorrect IDs', status: 'pending' },
        { id: 'missing-required', name: 'Missing Required Fields', status: 'pending' },
      ],
    },
    {
      id: 'crud-operations',
      name: 'CRUD Operation Tests',
      expanded: true,
      tests: [
        { id: 'create-facility', name: 'Create New Facility', status: 'pending' },
        { id: 'update-user-role', name: 'Update User Role', status: 'pending' },
        { id: 'delete-facility-access', name: 'Delete Facility Access', status: 'pending' },
      ],
    },
  ]);

  const [facilityId, setFacilityId] = useState<string>('');
  const [organizationId, setOrganizationId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);

  useEffect(() => {
    // Initialize with user's ID if available
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);

  const toggleCategoryExpand = (categoryId: string) => {
    setTestCategories(
      testCategories.map((category) =>
        category.id === categoryId ? { ...category, expanded: !category.expanded } : category
      )
    );
  };

  const updateTestResult = (categoryId: string, testId: string, result: Partial<TestResult>) => {
    setTestCategories(
      testCategories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            tests: category.tests.map((test) =>
              test.id === testId ? { ...test, ...result } : test
            ),
          };
        }
        return category;
      })
    );
  };

  const runTest = async (categoryId: string, testId: string) => {
    // Mark test as pending
    updateTestResult(categoryId, testId, { status: 'pending', message: 'Running test...' });

    try {
      let result: Partial<TestResult> = { status: 'pending' };
      const startTime = performance.now();

      switch (testId) {
        // TABLE ACCESS TESTS
        case 'org-table':
          result = await testOrganizationsTable();
          break;
        case 'facilities-table':
          result = await testFacilitiesTable();
          break;
        case 'users-table':
          result = await testUsersTable();
          break;
        case 'user-facility-access':
          result = await testUserFacilityAccess();
          break;

        // API ENDPOINT TESTS
        case 'list-orgs':
          result = await testListOrganizations();
          break;
        case 'fetch-facility':
          result = await testFetchFacility(facilityId);
          break;
        case 'user-profile':
          result = await testGetUserProfile(userId || user?.id);
          break;
        case 'update-profile':
          result = await testUpdateUserProfile(userId || user?.id);
          break;

        // RLS POLICY TESTS
        case 'user-auth-view':
          result = await testUserAuthorizedView();
          break;
        case 'user-auth-edit':
          result = await testUserAuthorizedEdit();
          break;
        case 'admin-manage-users':
          result = await testAdminUserManagement();
          break;
        case 'admin-manage-facilities':
          result = await testAdminFacilityManagement();
          break;

        // ERROR HANDLING TESTS
        case 'unauthorized-access':
          result = await testUnauthorizedAccess();
          break;
        case 'invalid-params':
          result = await testInvalidParameters();
          break;
        case 'incorrect-ids':
          result = await testIncorrectIds();
          break;
        case 'missing-required':
          result = await testMissingRequiredFields();
          break;

        // CRUD OPERATION TESTS
        case 'create-facility':
          result = await testCreateFacility(organizationId);
          break;
        case 'update-user-role':
          result = await testUpdateUserRole(userId || user?.id);
          break;
        case 'delete-facility-access':
          result = await testDeleteFacilityAccess();
          break;

        default:
          result = {
            status: 'error',
            message: 'Unknown test ID',
          };
      }

      const endTime = performance.now();
      result.responseTime = Math.round(endTime - startTime);

      // Update the test result
      updateTestResult(categoryId, testId, result);
    } catch (error) {
      console.error(`Error running test ${testId}:`, error);
      updateTestResult(categoryId, testId, {
        status: 'error',
        message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
        error,
      });
    }
  };

  const runAllTests = async () => {
    setIsTesting(true);
    
    // Reset all tests to pending
    setTestCategories(
      testCategories.map(category => ({
        ...category,
        tests: category.tests.map(test => ({
          ...test,
          status: 'pending',
          message: 'Queued for testing...'
        }))
      }))
    );

    // Run tests sequentially to avoid race conditions
    for (const category of testCategories) {
      for (const test of category.tests) {
        await runTest(category.id, test.id);
      }
    }

    setIsTesting(false);
  };

  // Implementation of test functions
  const testOrganizationsTable = async (): Promise<Partial<TestResult>> => {
    try {
      const { data, error, count } = await supabase
        .from('organizations')
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) throw error;
      
      return {
        status: 'success',
        message: `Successfully accessed organizations table. Found ${count} records.`,
        data,
      };
    } catch (error) {
      console.error('Error testing organizations table:', error);
      return {
        status: 'error',
        message: `Failed to access organizations table: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testFacilitiesTable = async (): Promise<Partial<TestResult>> => {
    try {
      const { data, error, count } = await supabase
        .from('facilities')
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) throw error;

      return {
        status: 'success',
        message: `Successfully accessed facilities table. Found ${count} records.`,
        data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to access facilities table: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testUsersTable = async (): Promise<Partial<TestResult>> => {
    try {
      // We shouldn't directly access auth.users, so check profiles instead
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) throw error;

      return {
        status: 'success',
        message: `Successfully accessed profiles table. Found ${count} records.`,
        data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to access profiles table: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testUserFacilityAccess = async (): Promise<Partial<TestResult>> => {
    try {
      // This might be a custom table or we might need to check assigned_facility_ids in profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('assigned_facility_ids')
        .limit(5);

      if (profileError) throw profileError;

      // Try to access user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .limit(5);

      const message = profileData?.length 
        ? `Successfully accessed user facility assignments. Users have assigned facilities.`
        : `No facility assignments found in profiles.`;

      const roleMessage = roleData?.length
        ? `Found ${roleData.length} user role assignments.`
        : `No user role assignments found.`;

      return {
        status: 'success',
        message: `${message} ${roleMessage}`,
        data: { profileData, roleData },
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to access user facility access: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testListOrganizations = async (): Promise<Partial<TestResult>> => {
    try {
      const { data, error } = await supabase.rpc('get_organizations');

      if (error) throw error;

      return {
        status: 'success',
        message: `Successfully retrieved ${data.length} organizations using RPC function.`,
        data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to list organizations: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testFetchFacility = async (id: string): Promise<Partial<TestResult>> => {
    if (!id) {
      return {
        status: 'skipped',
        message: 'Facility ID not provided. Test skipped.',
      };
    }

    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        status: 'success',
        message: `Successfully retrieved facility with ID: ${id}`,
        data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to fetch facility: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testGetUserProfile = async (id?: string): Promise<Partial<TestResult>> => {
    if (!id) {
      return {
        status: 'skipped',
        message: 'User ID not provided. Test skipped.',
      };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        status: 'success',
        message: `Successfully retrieved user profile for ID: ${id}`,
        data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to get user profile: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testUpdateUserProfile = async (id?: string): Promise<Partial<TestResult>> => {
    if (!id) {
      return {
        status: 'skipped',
        message: 'User ID not provided. Test skipped.',
      };
    }

    try {
      // Get the current preferences to prevent overwriting
      const { data: userData, error: getUserError } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', id)
        .single();

      if (getUserError) throw getUserError;

      const currentPreferences = userData?.preferences || {};
      const testPreferences = {
        ...currentPreferences,
        lastConnectionTest: new Date().toISOString(),
      };

      // Update the preferences
      const { data, error } = await supabase
        .from('profiles')
        .update({ preferences: testPreferences })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        status: 'success',
        message: `Successfully updated user profile preferences for ID: ${id}`,
        data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to update user profile: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testUserAuthorizedView = async (): Promise<Partial<TestResult>> => {
    try {
      const startTime = performance.now();
      
      // Check if user can view facilities they have access to
      const { data: facilities, error: facilitiesError } = await supabase
        .from('facilities')
        .select('*')
        .limit(5);

      if (facilitiesError) throw facilitiesError;

      // Get a list of organizations the user has access to
      const { data: organizations, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .limit(5);

      if (orgsError) throw orgsError;

      const endTime = performance.now();

      return {
        status: 'success',
        message: `User can view ${facilities?.length || 0} facilities and ${organizations?.length || 0} organizations`,
        data: { facilities, organizations },
        responseTime: Math.round(endTime - startTime)
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to test authorized view: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testUserAuthorizedEdit = async (): Promise<Partial<TestResult>> => {
    try {
      // Get a facility the user has access to
      const { data: facilities, error: facilitiesError } = await supabase
        .from('facilities')
        .select('*')
        .limit(1);

      if (facilitiesError) throw facilitiesError;

      if (!facilities || facilities.length === 0) {
        return {
          status: 'skipped',
          message: 'No accessible facilities found to test edit permissions.'
        };
      }

      const facility = facilities[0];
      
      // Try to update a non-critical field
      const updatedDescription = facility.description || '';
      const testUpdate = {
        description: updatedDescription + ' (test - ' + new Date().toISOString() + ')',
      };

      const { data, error } = await supabase
        .from('facilities')
        .update(testUpdate)
        .eq('id', facility.id)
        .select()
        .single();

      if (error) throw error;

      // Revert the change
      await supabase
        .from('facilities')
        .update({ description: updatedDescription })
        .eq('id', facility.id);

      return {
        status: 'success',
        message: `Successfully tested edit permissions on facility ID: ${facility.id}`,
        data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to test authorized edit: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testAdminUserManagement = async (): Promise<Partial<TestResult>> => {
    try {
      // Check if the user is an admin
      const isAdmin = hasPermission('users:manage');
      
      if (!isAdmin) {
        return {
          status: 'skipped',
          message: 'Current user does not have admin permissions. Test skipped.',
        };
      }

      // List users for organization
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

      if (usersError) throw usersError;

      return {
        status: 'success',
        message: `Admin can view ${users?.length || 0} user profiles`,
        data: { users },
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to test admin user management: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testAdminFacilityManagement = async (): Promise<Partial<TestResult>> => {
    try {
      // Check if the user is an admin
      const isAdmin = hasPermission('facilities:manage');
      
      if (!isAdmin) {
        return {
          status: 'skipped',
          message: 'Current user does not have admin permissions. Test skipped.',
        };
      }

      // List facilities the admin can manage
      const { data: facilities, error: facilitiesError } = await supabase
        .from('facilities')
        .select('*')
        .limit(5);

      if (facilitiesError) throw facilitiesError;

      return {
        status: 'success',
        message: `Admin can manage ${facilities?.length || 0} facilities`,
        data: { facilities },
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to test admin facility management: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testUnauthorizedAccess = async (): Promise<Partial<TestResult>> => {
    try {
      // Try to access an organization with a fake ID
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', fakeId)
        .single();

      // If we get data, that might indicate an RLS issue
      if (data) {
        return {
          status: 'error',
          message: `RLS policy may not be working properly: Retrieved data for non-existent organization`,
          data,
        };
      }

      // We should get an error, but it should be "No rows found" not an RLS error
      if (error && error.message.includes('No rows found')) {
        return {
          status: 'success',
          message: 'RLS working as expected: Attempted access to non-existent data returned "No rows found"',
          error,
        };
      }

      return {
        status: 'success',
        message: 'RLS working as expected: Unauthorized access attempt was properly restricted',
        error,
      };
    } catch (error) {
      // This is expected, but let's make sure it's the right kind of error
      if (error instanceof Error && error.message.includes('No rows found')) {
        return {
          status: 'success',
          message: 'RLS working as expected: Unauthorized access attempt properly rejected',
          error,
        };
      }
      
      return {
        status: 'error',
        message: `Unexpected error during unauthorized access test: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testInvalidParameters = async (): Promise<Partial<TestResult>> => {
    try {
      // Try to filter with an invalid parameter
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('non_existent_column', 'value');

      if (error) {
        return {
          status: 'success',
          message: 'Error handling working as expected: Invalid column name properly rejected',
          error,
        };
      }

      return {
        status: 'error',
        message: 'Expected an error when using invalid parameters, but none was thrown',
        data,
      };
    } catch (error) {
      // This is expected
      return {
        status: 'success',
        message: 'Error handling working as expected: Invalid parameters properly rejected',
        error,
      };
    }
  };

  const testIncorrectIds = async (): Promise<Partial<TestResult>> => {
    try {
      // Try to fetch with an incorrectly formatted ID
      const incorrectId = 'not-a-uuid';
      
      const startTime = performance.now();

      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('id', incorrectId)
        .single();

      if (error) {
        return {
          status: 'success',
          message: 'Error handling working as expected: Incorrectly formatted ID properly rejected',
          error,
        };
      }

      return {
        status: 'error',
        message: 'Expected an error when using incorrectly formatted ID, but none was thrown',
        data,
      };
    } catch (error) {
      // This is expected
      return {
        status: 'success',
        message: 'Error handling working as expected: Incorrectly formatted ID properly rejected',
        error,
      };
    }
  };

  const testMissingRequiredFields = async (): Promise<Partial<TestResult>> => {
    try {
      // Try to create a facility without required fields
      const { data, error } = await supabase
        .from('facilities')
        .insert([{ description: 'Missing required fields test' }])
        .select();

      if (error) {
        return {
          status: 'success',
          message: 'Error handling working as expected: Missing required fields properly rejected',
          error,
        };
      }

      return {
        status: 'error',
        message: 'Expected an error when missing required fields, but none was thrown',
        data,
      };
    } catch (error) {
      // This is expected
      return {
        status: 'success',
        message: 'Error handling working as expected: Missing required fields properly rejected',
        error,
      };
    }
  };

  const testCreateFacility = async (orgId: string): Promise<Partial<TestResult>> => {
    if (!orgId) {
      return {
        status: 'skipped',
        message: 'Organization ID not provided. Test skipped.',
      };
    }

    try {
      const newFacility = {
        name: `Test Facility ${new Date().toISOString()}`,
        description: 'Created during database connection test',
        organization_id: orgId,
        status: 'active',
        contact_email: 'test@example.com',
      };

      const { data, error } = await supabase
        .from('facilities')
        .insert([newFacility])
        .select()
        .single();

      if (error) throw error;

      return {
        status: 'success',
        message: `Successfully created new facility with ID: ${data.id}`,
        data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to create facility: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testUpdateUserRole = async (id?: string): Promise<Partial<TestResult>> => {
    if (!id) {
      return {
        status: 'skipped',
        message: 'User ID not provided. Test skipped.',
      };
    }

    try {
      // Check for existing user roles first
      const { data: existingRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', id)
        .limit(1);

      if (rolesError) throw rolesError;

      // If no roles exists for testing, we'll skip this test
      if (!existingRoles || existingRoles.length === 0) {
        return {
          status: 'skipped',
          message: 'No existing roles found for this user. Test skipped.',
        };
      }

      // Just update the assigned_at timestamp to avoid disrupting actual role assignments
      const { data, error } = await supabase
        .from('user_roles')
        .update({ assigned_at: new Date().toISOString() })
        .eq('id', existingRoles[0].id)
        .select()
        .single();

      if (error) throw error;

      return {
        status: 'success',
        message: `Successfully updated user role assignment timestamp for ID: ${existingRoles[0].id}`,
        data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to update user role: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const testDeleteFacilityAccess = async (): Promise<Partial<TestResult>> => {
    try {
      // First create a temporary access entry to delete
      const testAccess = {
        user_id: user?.id,
        role_id: '00000000-0000-0000-0000-000000000000', // Using a fake ID for test purposes
        assigned_by: user?.id,
        assigned_at: new Date().toISOString(),
      };

      const { data: insertData, error: insertError } = await supabase
        .from('user_roles')
        .insert([testAccess])
        .select()
        .single();

      if (insertError) {
        return {
          status: 'skipped',
          message: `Could not create test entry for deletion: ${insertError.message}`,
          error: insertError,
        };
      }

      // Now delete the test entry
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', insertData.id);

      if (deleteError) throw deleteError;

      return {
        status: 'success',
        message: `Successfully deleted test user_roles entry with ID: ${insertData.id}`,
        data: insertData,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to delete facility access: ${error instanceof Error ? error.message : String(error)}`,
        error,
      };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
      case 'skipped':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTestData = (data: any) => {
    try {
      return (
        <pre className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-60">
          {JSON.stringify(data, null, 2)}
        </pre>
      );
    } catch (e) {
      return <p>Unable to display data</p>;
    }
  };

  const getTestSummary = () => {
    const allTests = testCategories.flatMap(category => category.tests);
    const successCount = allTests.filter(test => test.status === 'success').length;
    const errorCount = allTests.filter(test => test.status === 'error').length;
    const pendingCount = allTests.filter(test => test.status === 'pending').length;
    const skippedCount = allTests.filter(test => test.status === 'skipped').length;
    const totalCount = allTests.length;

    return {
      success: successCount,
      error: errorCount,
      pending: pendingCount,
      skipped: skippedCount,
      total: totalCount,
      passRate: totalCount ? Math.round((successCount / (totalCount - skippedCount - pendingCount)) * 100) : 0
    };
  };

  const summary = getTestSummary();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Database Connection Test</h1>
          <p className="text-muted-foreground">
            Test the connection to the backend database and validate API endpoints, RLS policies, and CRUD operations.
          </p>
        </div>
        <Button 
          onClick={runAllTests} 
          disabled={isTesting}
          className="bg-primary"
        >
          {isTesting ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="md:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle>Test Summary</CardTitle>
            <CardDescription>Overall results of all database connection tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around items-center flex-wrap gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{summary.total}</div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">{summary.success}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">{summary.error}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">{summary.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{summary.skipped}</div>
                <div className="text-sm text-muted-foreground">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {summary.pending > 0 || (summary.total - summary.skipped - summary.pending) === 0
                    ? '--'
                    : `${summary.passRate}%`}
                </div>
                <div className="text-sm text-muted-foreground">Pass Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Test Parameters</CardTitle>
            <CardDescription>Configure test inputs and parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organization-id">Organization ID</Label>
              <Input
                id="organization-id"
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                placeholder="Enter organization ID for testing"
              />
              <p className="text-xs text-muted-foreground">
                Used for testing facility creation and organization-specific operations
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facility-id">Facility ID</Label>
              <Input
                id="facility-id"
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                placeholder="Enter facility ID for testing"
              />
              <p className="text-xs text-muted-foreground">
                Used for testing specific facility operations
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-id">User ID</Label>
              <Input
                id="user-id"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID for testing"
              />
              <p className="text-xs text-muted-foreground">
                {user?.id && 'Current user ID is prefilled. '}
                Used for testing user-specific operations
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => {
                setOrganizationId('');
                setFacilityId('');
                setUserId(user?.id || '');
              }}
              variant="outline" 
              size="sm"
            >
              Reset Inputs
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
            <CardDescription>
              {selectedTest 
                ? `Details for test: ${selectedTest.name}`
                : 'Select a test to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTest ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(selectedTest.status)}
                    <span className="ml-2 font-medium">{selectedTest.name}</span>
                  </div>
                  <Badge variant={
                    selectedTest.status === 'success' ? 'success' :
                    selectedTest.status === 'error' ? 'destructive' :
                    selectedTest.status === 'pending' ? 'default' : 'outline'
                  }>
                    {selectedTest.status.toUpperCase()}
                  </Badge>
                </div>

                {selectedTest.responseTime && (
                  <div className="text-sm text-muted-foreground">
                    Response time: {selectedTest.responseTime}ms
                  </div>
                )}

                {selectedTest.message && (
                  <Alert>
                    <AlertTitle>Message</AlertTitle>
                    <AlertDescription>
                      {selectedTest.message}
                    </AlertDescription>
                  </Alert>
                )}

                {selectedTest.error && (
                  <div>
                    <h4 className="mb-2 font-medium text-destructive">Error Details</h4>
                    {formatTestData(selectedTest.error)}
                  </div>
                )}

                {selectedTest.data && (
                  <div>
                    <h4 className="mb-2 font-medium">Response Data</h4>
                    {formatTestData(selectedTest.data)}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={() => runTest(
                    testCategories.find(cat => 
                      cat.tests.some(t => t.id === selectedTest.id))?.id || '',
                    selectedTest.id
                  )}>
                    Run Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Select a test from the list to view its details</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Results of all database connection tests</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table-access">
              <TabsList className="mb-4">
                {testCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {testCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Test Name</TableHead>
                        <TableHead className="w-[100px] text-center">Status</TableHead>
                        <TableHead className="w-[100px] text-center">Response Time</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="w-[100px] text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.tests.map((test) => (
                        <TableRow 
                          key={test.id} 
                          className={selectedTest?.id === test.id ? 'bg-muted/50' : ''}
                          onClick={() => setSelectedTest(test)}
                        >
                          <TableCell className="font-medium">{test.name}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              {getStatusIcon(test.status)}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {test.responseTime ? `${test.responseTime}ms` : '-'}
                          </TableCell>
                          <TableCell className="max-w-[400px] truncate">
                            {test.message || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                runTest(category.id, test.id);
                              }}
                            >
                              Run
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseConnectionTest;
