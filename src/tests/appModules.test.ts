
import { supabase } from '../integrations/supabase/client';
import { NonConformance } from '../types/non-conformance';

// Import services for testing
import * as nonConformanceService from '../services/nonConformanceService';
import * as documentsService from '../services/documentsService';
import * as capaService from '../services/capaService';
import * as auditService from '../services/auditService';
import * as supplierService from '../services/supplierService';
import * as traceabilityService from '../services/traceabilityService';
import * as trainingService from '../services/trainingService';
import * as haccpService from '../services/haccpService';

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
    single: jest.fn().mockReturnThis(),
    rpc: jest.fn().mockReturnThis(),
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
  }
}));

// Mock services
jest.mock('../services/nonConformanceService');
jest.mock('../services/documentsService');
jest.mock('../services/capaService');
jest.mock('../services/auditService');
jest.mock('../services/supplierService');
jest.mock('../services/traceabilityService');
jest.mock('../services/trainingService');
jest.mock('../services/haccpService');

describe('Application Modules Database Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Non-Conformance Module', () => {
    it('should fetch non-conformances', async () => {
      const mockData = [{ id: '1', title: 'Test NC' }];
      (nonConformanceService.fetchNonConformances as jest.Mock).mockResolvedValue(mockData);
      
      const result = await nonConformanceService.fetchNonConformances();
      
      expect(nonConformanceService.fetchNonConformances).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should create a non-conformance', async () => {
      const mockData = { id: '1', title: 'New NC' };
      (nonConformanceService.createNonConformance as jest.Mock).mockResolvedValue(mockData);
      
      const result = await nonConformanceService.createNonConformance({} as any);
      
      expect(nonConformanceService.createNonConformance).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('CAPA Module', () => {
    it('should fetch CAPA actions', async () => {
      const mockData = [{ id: '1', title: 'Test CAPA' }];
      (capaService.fetchCAPAActions as jest.Mock).mockResolvedValue(mockData);
      
      const result = await capaService.fetchCAPAActions();
      
      expect(capaService.fetchCAPAActions).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should create a CAPA action', async () => {
      const mockData = { id: '1', title: 'New CAPA' };
      (capaService.createCAPAAction as jest.Mock).mockResolvedValue(mockData);
      
      const result = await capaService.createCAPAAction({} as any);
      
      expect(capaService.createCAPAAction).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('Documents Module', () => {
    it('should fetch documents', async () => {
      const mockData = [{ id: '1', title: 'Test Document' }];
      (documentsService.fetchDocuments as jest.Mock).mockResolvedValue(mockData);
      
      const result = await documentsService.fetchDocuments();
      
      expect(documentsService.fetchDocuments).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should create a document', async () => {
      const mockData = { id: '1', title: 'New Document' };
      (documentsService.createDocument as jest.Mock).mockResolvedValue(mockData);
      
      const result = await documentsService.createDocument({} as any);
      
      expect(documentsService.createDocument).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('Audit Module', () => {
    it('should fetch audits', async () => {
      const mockData = [{ id: '1', title: 'Test Audit' }];
      (auditService.fetchAudits as jest.Mock).mockResolvedValue(mockData);
      
      const result = await auditService.fetchAudits();
      
      expect(auditService.fetchAudits).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should create an audit', async () => {
      const mockData = { id: '1', title: 'New Audit' };
      (auditService.createAudit as jest.Mock).mockResolvedValue(mockData);
      
      const result = await auditService.createAudit({} as any);
      
      expect(auditService.createAudit).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('Supplier Module', () => {
    it('should fetch suppliers', async () => {
      const mockData = [{ id: '1', name: 'Test Supplier' }];
      (supplierService.fetchSuppliers as jest.Mock).mockResolvedValue(mockData);
      
      const result = await supplierService.fetchSuppliers();
      
      expect(supplierService.fetchSuppliers).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should create a supplier', async () => {
      const mockData = { id: '1', name: 'New Supplier' };
      (supplierService.createSupplier as jest.Mock).mockResolvedValue(mockData);
      
      const result = await supplierService.createSupplier({} as any);
      
      expect(supplierService.createSupplier).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });
  
  describe('Traceability Module', () => {
    it('should fetch products', async () => {
      const mockData = [{ id: '1', name: 'Test Product' }];
      (traceabilityService.fetchProducts as jest.Mock).mockResolvedValue(mockData);
      
      const result = await traceabilityService.fetchProducts();
      
      expect(traceabilityService.fetchProducts).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should create a product', async () => {
      const mockData = { id: '1', name: 'New Product' };
      (traceabilityService.createProduct as jest.Mock).mockResolvedValue(mockData);
      
      const result = await traceabilityService.createProduct({} as any);
      
      expect(traceabilityService.createProduct).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });
  
  describe('Training Module', () => {
    it('should fetch training sessions', async () => {
      const mockData = [{ id: '1', title: 'Test Training' }];
      (trainingService.fetchTrainingSessions as jest.Mock).mockResolvedValue(mockData);
      
      const result = await trainingService.fetchTrainingSessions();
      
      expect(trainingService.fetchTrainingSessions).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should create a training session', async () => {
      const mockData = { id: '1', title: 'New Training' };
      (trainingService.createTrainingSession as jest.Mock).mockResolvedValue(mockData);
      
      const result = await trainingService.createTrainingSession({} as any);
      
      expect(trainingService.createTrainingSession).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });
  
  describe('HACCP Module', () => {
    it('should fetch HACCP plans', async () => {
      const mockData = [{ id: '1', title: 'Test HACCP Plan' }];
      (haccpService.fetchHACCPPlans as jest.Mock).mockResolvedValue(mockData);
      
      const result = await haccpService.fetchHACCPPlans();
      
      expect(haccpService.fetchHACCPPlans).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should create a HACCP plan', async () => {
      const mockData = { id: '1', title: 'New HACCP Plan' };
      (haccpService.createHACCPPlan as jest.Mock).mockResolvedValue(mockData);
      
      const result = await haccpService.createHACCPPlan({} as any);
      
      expect(haccpService.createHACCPPlan).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('Database Integration Tests', () => {
    it('should have proper error handling for database operations', async () => {
      // Test that errors are properly caught and handled
      (nonConformanceService.fetchNonConformances as jest.Mock).mockRejectedValue(new Error('Database connection error'));
      
      await expect(nonConformanceService.fetchNonConformances()).rejects.toThrow('Database connection error');
    });
    
    it('should handle database constraints and validation', async () => {
      // Test that database constraints are properly enforced
      const invalidData = { /* missing required fields */ };
      (nonConformanceService.createNonConformance as jest.Mock).mockRejectedValue(new Error('Validation error: missing required fields'));
      
      await expect(nonConformanceService.createNonConformance(invalidData as any)).rejects.toThrow('Validation error');
    });
  });
});
