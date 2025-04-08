
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NonConformance from '@/pages/NonConformance';
import { mockNavigate, renderWithRouter } from './mocks/testMocks';
import { supabase } from '@/integrations/supabase/client';

// Mock the fetchNonConformances function
jest.mock('@/services/nonConformanceService', () => ({
  fetchNonConformances: jest.fn().mockResolvedValue([
    {
      id: '1',
      title: 'Test NC 1',
      status: 'Open',
      reported_date: '2025-01-01T00:00:00.000Z',
      item_name: 'Test Item',
      item_category: 'Test Category',
      reason_category: 'Test Reason',
    },
    {
      id: '2',
      title: 'Test NC 2',
      status: 'Closed',
      reported_date: '2025-01-02T00:00:00.000Z',
      item_name: 'Test Item 2',
      item_category: 'Test Category 2',
      reason_category: 'Test Reason 2',
    },
  ]),
}));

describe('NonConformance Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the NonConformance page', async () => {
    renderWithRouter(<NonConformance />);
    
    // Verify the page title is rendered
    await waitFor(() => {
      expect(screen.getByText('Non-Conformance Management')).toBeInTheDocument();
    });
  });

  it('navigates to new NC form when button is clicked', async () => {
    renderWithRouter(<NonConformance />);
    
    // Find and click the "New Non-Conformance" button
    const newButton = await screen.findByText('New Non-Conformance');
    newButton.click();
    
    // Verify navigation was called
    expect(mockNavigate).toHaveBeenCalledWith('/non-conformance/new');
  });

  it('subscribes to realtime updates for non-conformances', async () => {
    const mockSubscribe = jest.fn();
    (supabase.channel as jest.Mock).mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: mockSubscribe,
    });

    render(
      <BrowserRouter>
        <NonConformance />
      </BrowserRouter>
    );
    
    // Verify subscription was called
    await waitFor(() => {
      expect(supabase.channel).toHaveBeenCalledWith('public:non_conformances');
      expect(mockSubscribe).toHaveBeenCalled();
    });
  });
});
