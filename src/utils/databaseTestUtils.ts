
// Create this utility file since it's being imported in TestingVerification.tsx
export interface FunctionTestResult {
  name: string;
  status: 'pending' | 'passing' | 'failing' | 'partial';
  message?: string;
  details?: string;
}

export const runTest = async (testFunction: () => Promise<boolean>, testName: string): Promise<FunctionTestResult> => {
  try {
    const result = await testFunction();
    return {
      name: testName,
      status: result ? 'passing' : 'failing',
      message: result ? 'Test passed' : 'Test failed'
    };
  } catch (error) {
    return {
      name: testName,
      status: 'failing',
      message: 'Test failed with error',
      details: error instanceof Error ? error.message : String(error)
    };
  }
};

export default FunctionTestResult;
