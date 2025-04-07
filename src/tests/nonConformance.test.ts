
import { supabase } from '../integrations/supabase/client';
import { 
  fetchNonConformances, 
  fetchNonConformanceById, 
  createNonConformance, 
  updateNonConformance, 
  deleteNonConformance,
  fetchNCActivities,
  fetchNCAttachments,
  fetchNCStats,
  updateNCStatus
} from '../services/nonConformanceService';
import { NonConformance } from '../types/non-conformance';

// Mock data
const mockNC: Omit<NonConformance, 'id' | 'created_at' | 'updated_at'> = {
  title: 'Test Non-Conformance',
  description: 'This is a test non-conformance',
  item_name: 'Test Item',
  item_category: 'Processing Equipment',
  reason_category: 'Equipment Malfunction',
  status: 'On Hold',
  created_by: 'test-user',
  reported_date: new Date().toISOString(),
};

// Mock for generated IDs
const mockId = 'test-id-123';

// Mock Supabase responses
jest.mock('../integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn(),
    then: jest.fn(),
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn().mockReturnThis(),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'test-url' } }),
    },
    removeChannel: jest.fn(),
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
    }),
    rpc: jest.fn().mockReturnThis(),
  },
}));

describe('Non-Conformance Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchNonConformances', () => {
    it('should fetch all non-conformances successfully', async () => {
      const mockData = [{ ...mockNC, id: mockId }];
      (supabase.from().select().order().then as jest.Mock).mockResolvedValue({ 
        data: mockData, 
        error: null 
      });

      const result = await fetchNonConformances();
      
      expect(supabase.from).toHaveBeenCalledWith('non_conformances');
      expect(supabase.from().select).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should throw an error when fetching fails', async () => {
      (supabase.from().select().order().then as jest.Mock).mockResolvedValue({ 
        data: null, 
        error: { message: 'Database error' } 
      });

      await expect(fetchNonConformances()).rejects.toThrow();
    });
  });

  describe('fetchNonConformanceById', () => {
    it('should fetch a non-conformance by ID successfully', async () => {
      const mockData = { ...mockNC, id: mockId };
      (supabase.from().select().eq().single as jest.Mock).mockResolvedValue({ 
        data: mockData, 
        error: null 
      });

      const result = await fetchNonConformanceById(mockId);
      
      expect(supabase.from).toHaveBeenCalledWith('non_conformances');
      expect(supabase.from().select).toHaveBeenCalled();
      expect(supabase.from().select().eq).toHaveBeenCalledWith('id', mockId);
      expect(result).toEqual(mockData);
    });

    it('should throw an error when fetching by ID fails', async () => {
      (supabase.from().select().eq().single as jest.Mock).mockResolvedValue({ 
        data: null, 
        error: { message: 'Not found' } 
      });

      await expect(fetchNonConformanceById(mockId)).rejects.toThrow();
    });
  });

  describe('createNonConformance', () => {
    it('should create a non-conformance successfully', async () => {
      const mockCreatedNC = { ...mockNC, id: mockId };
      (supabase.from().insert().select().single as jest.Mock).mockResolvedValue({ 
        data: mockCreatedNC, 
        error: null 
      });
      
      // Mock activity creation
      (supabase.from().insert().select().single as jest.Mock).mockResolvedValue({ 
        data: { id: 'activity-id' }, 
        error: null 
      });

      const result = await createNonConformance(mockNC);
      
      expect(supabase.from).toHaveBeenCalledWith('non_conformances');
      expect(supabase.from().insert).toHaveBeenCalledWith([mockNC]);
      expect(result).toEqual(mockCreatedNC);
    });

    it('should throw an error when creation fails', async () => {
      (supabase.from().insert().select().single as jest.Mock).mockResolvedValue({ 
        data: null, 
        error: { message: 'Insertion error' } 
      });

      await expect(createNonConformance(mockNC)).rejects.toThrow();
    });
  });

  describe('updateNonConformance', () => {
    const updates = { title: 'Updated Title' };
    const userId = 'test-user';
    
    it('should update a non-conformance successfully', async () => {
      // Mock current record fetch
      (supabase.from().select().eq().single as jest.Mock).mockResolvedValue({ 
        data: { ...mockNC, id: mockId }, 
        error: null 
      });
      
      // Mock update
      const mockUpdatedNC = { ...mockNC, id: mockId, ...updates };
      (supabase.from().update().eq().select().single as jest.Mock).mockResolvedValue({ 
        data: mockUpdatedNC, 
        error: null 
      });
      
      // Mock activity creation
      (supabase.from().insert().select().single as jest.Mock).mockResolvedValue({ 
        data: { id: 'activity-id' }, 
        error: null 
      });

      const result = await updateNonConformance(mockId, updates, userId);
      
      expect(supabase.from).toHaveBeenCalledWith('non_conformances');
      expect(supabase.from().update).toHaveBeenCalled();
      expect(supabase.from().update().eq).toHaveBeenCalledWith('id', mockId);
      expect(result).toEqual(mockUpdatedNC);
    });

    it('should throw an error when update fails', async () => {
      // Mock current record fetch
      (supabase.from().select().eq().single as jest.Mock).mockResolvedValue({ 
        data: { ...mockNC, id: mockId }, 
        error: null 
      });
      
      // Mock update failure
      (supabase.from().update().eq().select().single as jest.Mock).mockResolvedValue({ 
        data: null, 
        error: { message: 'Update error' } 
      });

      await expect(updateNonConformance(mockId, updates, userId)).rejects.toThrow();
    });
  });

  // Additional tests for other functions would follow the same pattern
  
  describe('fetchNCStats', () => {
    it('should fetch non-conformance statistics successfully', async () => {
      const mockStats = {
        total: 5,
        totalQuantityOnHold: 100,
        byStatus: { 'On Hold': 2, 'Under Review': 1, 'Released': 2 },
        byCategory: { 'Processing Equipment': 3, 'Raw Products': 2 },
        byReason: { 'Equipment Malfunction': 3, 'Quality Issues': 2 },
        recentItems: [{ ...mockNC, id: mockId }]
      };
      
      // Mock data fetch
      (supabase.from().select().order().then as jest.Mock).mockResolvedValue({ 
        data: [
          { ...mockNC, id: '1', status: 'On Hold', quantity_on_hold: 20, item_category: 'Processing Equipment', reason_category: 'Equipment Malfunction' },
          { ...mockNC, id: '2', status: 'On Hold', quantity_on_hold: 30, item_category: 'Processing Equipment', reason_category: 'Equipment Malfunction' },
          { ...mockNC, id: '3', status: 'Under Review', quantity_on_hold: 10, item_category: 'Processing Equipment', reason_category: 'Equipment Malfunction' },
          { ...mockNC, id: '4', status: 'Released', quantity_on_hold: 0, item_category: 'Raw Products', reason_category: 'Quality Issues' },
          { ...mockNC, id: '5', status: 'Released', quantity_on_hold: 40, item_category: 'Raw Products', reason_category: 'Quality Issues' },
        ], 
        error: null 
      });

      const result = await fetchNCStats();
      
      expect(supabase.from).toHaveBeenCalledWith('non_conformances');
      expect(result).toHaveProperty('total', 5);
      expect(result).toHaveProperty('byStatus');
      expect(result).toHaveProperty('byCategory');
      expect(result).toHaveProperty('byReason');
      expect(result).toHaveProperty('recentItems');
    });

    it('should throw an error when stats fetch fails', async () => {
      (supabase.from().select().order().then as jest.Mock).mockResolvedValue({ 
        data: null, 
        error: { message: 'Stats fetch error' } 
      });

      await expect(fetchNCStats()).rejects.toThrow();
    });
  });
});
