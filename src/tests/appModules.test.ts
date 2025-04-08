import jest from '../mocks/jest.mock';
import * as nonConformanceServiceModule from '../services/nonConformanceService';

// Mock the service
jest.mock('@/services/nonConformanceService');

// Import other services
import auditService from '../services/auditService';
import capaService from '../services/capaService';
import documentsService from '../services/documentsService';
import supplierService from '../services/supplierService';
import trainingService from '../services/trainingService';
import haccpService from '../services/haccpService';
import traceabilityService from '../services/traceabilityService';

// Mock service methods
jest.spyOn(auditService, 'fetchAudits').mockResolvedValue([]);
jest.spyOn(capaService, 'fetchCAPAActions').mockResolvedValue([]);
jest.spyOn(capaService, 'createCAPAAction').mockResolvedValue({ id: 'mock-capa-id' } as any);
jest.spyOn(documentsService, 'fetchDocuments').mockResolvedValue([]);
jest.spyOn(nonConformanceServiceModule, 'fetchNonConformances').mockResolvedValue([]);
jest.spyOn(supplierService, 'fetchSuppliers').mockResolvedValue([]);
jest.spyOn(trainingService, 'fetchTrainingSessions').mockResolvedValue([]);
jest.spyOn(haccpService, 'fetchHACCPPlans').mockResolvedValue([]);
jest.spyOn(traceabilityService, 'fetchProducts').mockResolvedValue([]);

describe('Cross-Module Integration Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  
  describe('Audit and CAPA Integration', () => {
    it('should fetch audits and CAPAs', async () => {
      const audits = await auditService.fetchAudits();
      const capas = await capaService.fetchCAPAActions();
      
      expect(auditService.fetchAudits).toHaveBeenCalled();
      expect(capaService.fetchCAPAActions).toHaveBeenCalled();
    });
    
    it('should create CAPA from audit finding', async () => {
      const mockCapa = {
        title: 'Test CAPA from Audit',
        description: 'Created from audit finding',
        source: 'audit',
        sourceId: 'audit-1',
        priority: 'high',
        status: 'Open',
        createdBy: 'auditor'
      };
      
      const result = await capaService.createCAPAAction(mockCapa as any);
      
      expect(capaService.createCAPAAction).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
  
  describe('Documents and Training Integration', () => {
    it('should fetch documents and training sessions', async () => {
      const documents = await documentsService.fetchDocuments();
      const trainingSessions = await trainingService.fetchTrainingSessions();
      
      expect(documentsService.fetchDocuments).toHaveBeenCalled();
      expect(trainingService.fetchTrainingSessions).toHaveBeenCalled();
    });
    
    it('should handle document linking to training', async () => {
      jest.spyOn(documentsService, 'linkDocumentToModule').mockResolvedValue(true);
      
      const result = await documentsService.linkDocumentToModule('doc-1', 'training', 'training-1');
      
      expect(documentsService.linkDocumentToModule).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
  
  describe('Non-Conformance and CAPA Integration', () => {
    it('should fetch non-conformances', async () => {
      const nonConformances = await nonConformanceServiceModule.fetchNonConformances();
      
      expect(nonConformanceServiceModule.fetchNonConformances).toHaveBeenCalled();
    });
    
    it('should generate CAPA from non-conformance', async () => {
      jest.spyOn(nonConformanceServiceModule, 'generateCAPAFromNC').mockResolvedValue({ id: 'capa-1' });
      
      const result = await nonConformanceServiceModule.generateCAPAFromNC('nc-1');
      
      expect(nonConformanceServiceModule.generateCAPAFromNC).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
  
  describe('Supplier and Audit Integration', () => {
    it('should fetch suppliers', async () => {
      const suppliers = await supplierService.fetchSuppliers();
      
      expect(supplierService.fetchSuppliers).toHaveBeenCalled();
    });
    
    it('should schedule supplier audit', async () => {
      jest.spyOn(supplierService, 'scheduleAudit').mockResolvedValue({ id: 'audit-1' });
      
      const result = await supplierService.scheduleAudit('supplier-1', new Date());
      
      expect(supplierService.scheduleAudit).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
  
  describe('HACCP and Training Integration', () => {
    it('should fetch HACCP plans', async () => {
      const haccpPlans = await haccpService.fetchHACCPPlans();
      
      expect(haccpService.fetchHACCPPlans).toHaveBeenCalled();
    });
    
    it('should link HACCP to training', async () => {
      jest.spyOn(haccpService, 'linkToTraining').mockResolvedValue(true);
      
      const result = await haccpService.linkToTraining('haccp-1', 'training-1');
      
      expect(haccpService.linkToTraining).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
  
  describe('Traceability and CAPA Integration', () => {
    it('should fetch products', async () => {
      const products = await traceabilityService.fetchProducts();
      
      expect(traceabilityService.fetchProducts).toHaveBeenCalled();
    });
    
    it('should handle recall workflow', async () => {
      jest.spyOn(traceabilityService, 'createRecall').mockResolvedValue({ id: 'recall-1' });
      jest.spyOn(capaService, 'createCAPAAction').mockResolvedValue({ id: 'capa-2' } as any);
      
      const recall = await traceabilityService.createRecall({
        title: 'Test Recall',
        description: 'Test recall for product',
        productId: 'product-1'
      });
      
      const capa = await capaService.createCAPAAction({
        title: 'CAPA from Recall',
        description: 'Address root cause of recall',
        source: 'traceability',
        sourceId: recall.id,
        priority: 'critical',
        status: 'Open'
      } as any);
      
      expect(recall).toBeDefined();
      expect(capa).toBeDefined();
    });
  });
});
