
// Mock navigation
export const mockNavigate = jest.fn();

// Mock useNavigate hook
jest.mock('react-router-dom', async () => {
  const actual = await jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock user context
jest.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      profile: {
        full_name: 'Test User',
        role: 'admin',
      },
    },
    loading: false,
    signOut: jest.fn(),
    updateProfile: jest.fn(),
  }),
}));

// Mock supabase client
jest.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
      rpc: jest.fn(),
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: { user: { id: 'test-user-id' } } },
          error: null,
        }),
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id', email: 'test@example.com' } },
          error: null,
        }),
      },
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn(),
          getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/test.pdf' } }),
        }),
      },
      channel: jest.fn().mockReturnValue({
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn(),
      }),
      removeChannel: jest.fn(),
    },
  };
});

// Mock toast from @/components/ui/use-toast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));

// Reset all mocks between tests
export const resetMocks = () => {
  mockNavigate.mockReset();
  
  const { supabase } = require('@/integrations/supabase/client');
  supabase.from.mockReset();
  supabase.rpc.mockReset();
  supabase.auth.getSession.mockReset();
  supabase.auth.getUser.mockReset();
};

// Mock console methods for testing
const originalConsole = { ...console };
export const mockConsole = () => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
  console.info = jest.fn();
};

export const restoreConsole = () => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
};

// Export renderWithRouter for the tests
export const renderWithRouter = (component: React.ReactElement, options = {}) => {
  // This will be implemented with proper testing library code
  return { component };
};
