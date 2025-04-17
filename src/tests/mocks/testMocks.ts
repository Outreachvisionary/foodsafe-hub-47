
import { vi } from 'vitest';

// Mock navigation
export const mockNavigate = vi.fn();

// Mock useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock user context
vi.mock('@/contexts/UserContext', () => ({
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
    signOut: vi.fn(),
    updateProfile: vi.fn(),
  }),
}));

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      from: vi.fn(),
      rpc: vi.fn(),
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { user: { id: 'test-user-id' } } },
          error: null,
        }),
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id', email: 'test@example.com' } },
          error: null,
        }),
      },
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn(),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/test.pdf' } }),
        }),
      },
      channel: vi.fn().mockReturnValue({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn(),
      }),
      removeChannel: vi.fn(),
    },
  };
});

// Mock toast from @/components/ui/use-toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
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
  
  // Reset other mocks as needed
};

// Mock fetch globally
global.fetch = vi.fn();

// Mock console methods for testing
const originalConsole = { ...console };
export const mockConsole = () => {
  console.log = vi.fn();
  console.error = vi.fn();
  console.warn = vi.fn();
  console.info = vi.fn();
};

export const restoreConsole = () => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
};
