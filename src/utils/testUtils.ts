
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import React from 'react';

/**
 * Utility to test route rendering with specific path
 */
export const renderWithRouter = (
  ui: React.ReactNode,
  { route = '/', path = '/' } = {}
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

/**
 * Utility to verify if a component renders without errors
 */
export const verifyComponentRender = (Component: React.ComponentType<any>, props = {}) => {
  try {
    render(<Component {...props} />);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
};
