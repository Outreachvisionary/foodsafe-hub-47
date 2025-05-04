
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '@/contexts/UserContext';

/**
 * Helper function for rendering components with Router context
 * @param ui Component to render
 * @param options Optional rendering options
 * @returns The rendered component with testing utilities
 */
export const renderWithRouter = (
  ui: React.ReactElement,
  { route = '/', ...renderOptions } = {}
) => {
  window.history.pushState({}, 'Test page', route);
  
  return {
    ...render(ui, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[route]}>
          {children}
        </MemoryRouter>
      ),
      ...renderOptions,
    }),
  };
};

// Mock navigate function for testing
export const mockNavigate = jest.fn();

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/**
 * Helper function for rendering components with UserContext
 * @param ui Component to render
 * @param options Optional rendering options including mock user
 * @returns The rendered component with testing utilities
 */
export const renderWithUser = (
  ui: React.ReactElement,
  { mockUser = null, ...renderOptions } = {}
) => {
  const UserProviderWithProps = ({ children }: { children: React.ReactNode }) => (
    <UserProvider>{children}</UserProvider>
  );

  return {
    ...render(ui, {
      wrapper: UserProviderWithProps,
      ...renderOptions,
    }),
  };
};

/**
 * Helper function for rendering components with both Router and User context
 * @param ui Component to render
 * @param options Optional rendering options
 * @returns The rendered component with testing utilities
 */
export const renderWithRouterAndUser = (
  ui: React.ReactElement,
  { route = '/', ...renderOptions } = {}
) => {
  window.history.pushState({}, 'Test page', route);
  
  const CombinedProviders = ({ children }: { children: React.ReactNode }) => (
    <UserProvider>
      <MemoryRouter initialEntries={[route]}>
        {children}
      </MemoryRouter>
    </UserProvider>
  );

  return {
    ...render(ui, {
      wrapper: CombinedProviders,
      ...renderOptions,
    }),
  };
};

export default {
  renderWithRouter,
  renderWithUser,
  renderWithRouterAndUser,
  mockNavigate,
};
