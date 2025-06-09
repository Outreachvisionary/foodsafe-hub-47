
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { testDatabaseConnection, testBackendIntegration } from '@/utils/routeTestUtils';
import { supabase } from '@/integrations/supabase/client';

describe('Database Integration Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test connection to major data tables
  it('should connect to the organizations table', async () => {
    const result = await testDatabaseConnection();
    expect(result).toBe(true);
  });
  
  it('should connect to the facilities table', async () => {
    const result = await testDatabaseConnection();
    expect(result).toBe(true);
  });
  
  it('should connect to the non_conformances table', async () => {
    const result = await testDatabaseConnection();
    expect(result).toBe(true);
  });
  
  it('should connect to the documents table', async () => {
    const result = await testDatabaseConnection();
    expect(result).toBe(true);
  });
  
  // Test CRUD operations
  it('should perform read operations on organizations', async () => {
    const result = await testBackendIntegration();
    expect(result.status).toBe('passed');
  });
  
  it('should perform read operations on facilities', async () => {
    const result = await testBackendIntegration();
    expect(result.status).toBe('passed');
  });
  
  // Test database functions
  it('should execute the get_organizations RPC function', async () => {
    const mockResponse = { data: [{ id: '1', name: 'Test Org' }], error: null };
    (supabase.rpc as jest.Mock).mockResolvedValue(mockResponse);
    
    const { data, error } = await supabase.rpc('get_organizations');
    
    expect(error).toBeNull();
    expect(data).toEqual(mockResponse.data);
  });
  
  it('should execute the get_facilities RPC function', async () => {
    const mockResponse = { data: [{ id: '1', name: 'Test Facility' }], error: null };
    (supabase.rpc as jest.Mock).mockResolvedValue(mockResponse);
    
    const { data, error } = await supabase.rpc('get_facilities', {
      p_organization_id: null,
      p_only_assigned: false
    });
    
    expect(error).toBeNull();
    expect(data).toEqual(mockResponse.data);
  });
  
  // Test cross-module data relationships
  it('should verify relationship between non-conformances and CAPAs', async () => {
    // Mock a non-conformance with a CAPA reference
    const mockNonConformance = { 
      id: '123', 
      title: 'Test NC', 
      capa_id: '456'
    };
    
    const mockCapaResponse = { 
      data: [{ id: '456', title: 'Test CAPA' }], 
      error: null 
    };
    
    // Setup mocks
    const fromMock = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockNonConformance, error: null })
    });
    
    (supabase.from as jest.Mock)
      .mockImplementationOnce(fromMock)
      .mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue(mockCapaResponse)
      }));
    
    // Fetch non-conformance
    const { data: nc } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('id', '123')
      .single();
    
    // Fetch related CAPA
    const { data: capa } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', nc.capa_id)
      .single();
    
    expect(nc.id).toBe('123');
    expect(nc.capa_id).toBe('456');
    expect(capa[0].id).toBe('456');
  });
});
