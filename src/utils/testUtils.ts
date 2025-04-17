
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a wrapper with BrowserRouter for testing components that use routing
export function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);
  
  return {
    ...render(ui, { wrapper: BrowserRouter }),
  };
}

// Create a wrapper with MemoryRouter for testing components that use routing with a specific route
export function renderWithMemoryRouter(
  ui: React.ReactElement,
  { initialEntries = ['/'], initialIndex = 0 } = {}
) {
  return {
    ...render(
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
        {ui}
      </MemoryRouter>
    ),
  };
}

// Create a wrapper with QueryClientProvider for testing components that use react-query
export function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    ),
    queryClient,
  };
}

// All-in-one wrapper for components that use both routing and react-query
export function renderWithAll(
  ui: React.ReactElement,
  { route = '/', initialEntries = [route], initialIndex = 0 } = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  window.history.pushState({}, 'Test page', route);
  
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
          {ui}
        </MemoryRouter>
      </QueryClientProvider>
    ),
    queryClient,
  };
}
