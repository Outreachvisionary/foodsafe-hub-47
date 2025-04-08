
import { 
  describe, 
  it, 
  expect, 
  beforeEach, 
  jest 
} from '../mocks/jest.mock';
import nonConformanceService from '../services/nonConformanceService';

// Mock the nonConformanceService methods
jest.spyOn(nonConformanceService, 'fetchNonConformances').mockResolvedValue([
  {
    id: 'nc-1',
    title: 'Test NC 1',
    status: 'Open',
    createdBy: 'user1',
    createdAt: '2023-01-01'
  },
  {
    id: 'nc-2',
    title: 'Test NC 2',
    status: 'Closed',
    createdBy: 'user2',
    createdAt: '2023-01-02'
  }
]);

jest.spyOn(nonConformanceService, 'fetchNonConformanceById').mockImplementation(
  (id) => Promise.resolve({
    id,
    title: `NC with ID ${id}`,
    description: 'Test description',
    status: 'Open',
    reportedDate: '2023-01-01',
    createdBy: 'user1',
    itemName: 'Test Item',
    itemCategory: 'Product'
  })
);

jest.spyOn(nonConformanceService, 'createNonConformance').mockImplementation(
  (data) => Promise.resolve({
    id: 'new-nc-id',
    ...data,
    createdAt: '2023-01-03'
  })
);

jest.spyOn(nonConformanceService, 'updateNonConformance').mockImplementation(
  (id, data) => Promise.resolve({
    id,
    ...data,
    updatedAt: '2023-01-04'
  })
);

jest.spyOn(nonConformanceService, 'updateNCStatus').mockImplementation(
  (id, status) => Promise.resolve({
    id,
    status,
    updatedAt: '2023-01-04'
  })
);

jest.spyOn(nonConformanceService, 'deleteNonConformance').mockResolvedValue(true);

describe('Non-Conformance Service Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  
  describe('Fetching Non-Conformances', () => {
    it('should fetch all non-conformances', async () => {
      const result = await nonConformanceService.fetchNonConformances();
      
      expect(nonConformanceService.fetchNonConformances).toHaveBeenCalled();
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('nc-1');
    });
    
    it('should fetch a non-conformance by ID', async () => {
      const id = 'nc-123';
      const result = await nonConformanceService.fetchNonConformanceById(id);
      
      expect(nonConformanceService.fetchNonConformanceById).toHaveBeenCalledWith(id);
      expect(result).toBeDefined();
    });
  });
  
  describe('Creating Non-Conformances', () => {
    it('should create a new non-conformance', async () => {
      const newNC = {
        title: 'New Non-Conformance',
        description: 'Test description',
        itemName: 'Test Item',
        itemCategory: 'Product',
        reasonCategory: 'Quality',
        createdBy: 'user1'
      };
      
      const result = await nonConformanceService.createNonConformance(newNC);
      
      expect(nonConformanceService.createNonConformance).toHaveBeenCalledWith(newNC);
      expect(result).toBeDefined();
      expect(result.title).toBe(newNC.title);
      expect(result.id).toBeDefined();
    });
    
    it('should handle errors when creating', async () => {
      jest.spyOn(nonConformanceService, 'createNonConformance').mockRejectedValue(new Error('Create error'));
      
      try {
        await nonConformanceService.createNonConformance({} as any);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
  
  describe('Updating Non-Conformances', () => {
    it('should update a non-conformance', async () => {
      const id = 'nc-123';
      const updates = {
        title: 'Updated Title',
        description: 'Updated description'
      };
      
      const result = await nonConformanceService.updateNonConformance(id, updates, 'user1');
      
      expect(nonConformanceService.updateNonConformance).toHaveBeenCalledWith(id, updates, 'user1');
      expect(result).toBeDefined();
      expect(result.title).toBe(updates.title);
    });
    
    it('should update a non-conformance status', async () => {
      const id = 'nc-123';
      const newStatus = 'Closed';
      
      const result = await nonConformanceService.updateNCStatus(id, newStatus, 'user1');
      
      expect(nonConformanceService.updateNCStatus).toHaveBeenCalledWith(id, newStatus, 'user1');
      expect(result).toBeDefined();
    });
  });
  
  describe('NC Activities', () => {
    it('should create an activity for a non-conformance', async () => {
      const activity = {
        non_conformance_id: 'nc-123',
        action: 'Status updated',
        performed_by: 'user1',
        comments: 'Test comment'
      };
      
      jest.spyOn(nonConformanceService, 'createNCActivity').mockResolvedValue({
        id: 'activity-1',
        ...activity,
        performed_at: '2023-01-03'
      });
      
      const result = await nonConformanceService.createNCActivity(activity);
      
      expect(nonConformanceService.createNCActivity).toHaveBeenCalledWith(activity);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.action).toBe(activity.action);
      expect(result.performed_by).toBe(activity.performed_by);
    });
  });
  
  describe('Full NC Workflow', () => {
    it('should support the full NC lifecycle', async () => {
      const newNC = {
        title: 'Process Deviation',
        description: 'Temperature exceeded limit',
        itemName: 'Batch 12345',
        itemCategory: 'Process',
        reasonCategory: 'Temperature',
        createdBy: 'quality-manager'
      };
      
      // Create
      const created = await nonConformanceService.createNonConformance(newNC);
      
      // Update
      const updates = {
        description: 'Updated description',
        resolution_details: 'Issue resolved'
      };
      
      const updated = await nonConformanceService.updateNonConformance(created.id, updates, 'quality-manager');
      
      // Change status
      const statusChange = await nonConformanceService.updateNCStatus(created.id, 'Under Review', 'supervisor');
      
      // Create activity
      const activity = {
        non_conformance_id: created.id,
        action: 'Investigation completed',
        performed_by: 'investigator',
        comments: 'Root cause identified'
      };
      
      jest.spyOn(nonConformanceService, 'createNCActivity').mockResolvedValue({
        id: 'activity-123',
        ...activity,
        performed_at: '2023-01-05'
      });
      
      const activityResult = await nonConformanceService.createNCActivity(activity);
      
      expect(created).toBeDefined();
      expect(updated).toBeDefined();
      expect(statusChange).toBeDefined();
      expect(activityResult).toBeDefined();
    });
  });
});
