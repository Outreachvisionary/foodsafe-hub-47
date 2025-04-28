
import { DocumentStatus, CheckoutStatus, Document } from '@/types/document';
import { CAPA, CAPAStatus, CAPASource } from '@/types/capa';
import { 
  isDocumentStatus,
  isCheckoutStatus,
  convertToCAPAStatus,
  convertToDocumentStatus,
  convertToCheckoutStatus,
  convertToEffectivenessRating
} from '@/utils/typeAdapters';

describe('Type Integration Tests', () => {
  describe('Document Type Tests', () => {
    it('should correctly validate document status', () => {
      // Valid status
      expect(isDocumentStatus('Draft', 'Draft')).toBe(true);
      expect(isDocumentStatus('Pending_Approval', 'Pending_Approval')).toBe(true);
      
      // Invalid status
      expect(isDocumentStatus('InReview', 'Pending_Approval')).toBe(false);
      expect(isDocumentStatus('Draft', 'Approved')).toBe(false);
    });
    
    it('should correctly validate checkout status', () => {
      // Valid status
      expect(isCheckoutStatus('Available', 'Available')).toBe(true);
      expect(isCheckoutStatus('Checked_Out', 'Checked_Out')).toBe(true);
      
      // Invalid status
      expect(isCheckoutStatus('CheckedOut', 'Checked_Out')).toBe(false);
      expect(isCheckoutStatus('Available', 'Checked_Out')).toBe(false);
    });
    
    it('should correctly convert document status strings', () => {
      // Valid status
      expect(convertToDocumentStatus('Draft')).toBe('Draft');
      expect(convertToDocumentStatus('Pending_Approval')).toBe('Pending_Approval');
      
      // Invalid status
      expect(convertToDocumentStatus('InvalidStatus')).toBe('Draft');
    });
    
    it('should correctly convert checkout status strings', () => {
      // Valid status
      expect(convertToCheckoutStatus('Available')).toBe('Available');
      expect(convertToCheckoutStatus('Checked_Out')).toBe('Checked_Out');
      
      // Invalid status
      expect(convertToCheckoutStatus('CheckedOut')).toBe('Available');
      expect(convertToCheckoutStatus(undefined)).toBe('Available');
    });
  });

  describe('CAPA Type Tests', () => {
    it('should correctly convert CAPA status strings', () => {
      // Valid status
      expect(convertToCAPAStatus('Open')).toBe('Open');
      expect(convertToCAPAStatus('In_Progress')).toBe('In_Progress');
      
      // Invalid status
      expect(convertToCAPAStatus('InProgress')).toBe('Open');
    });
    
    it('should correctly convert effectiveness rating strings', () => {
      // Valid ratings
      expect(convertToEffectivenessRating('Effective')).toBe('Effective');
      expect(convertToEffectivenessRating('Not_Effective')).toBe('Not_Effective');
      
      // Invalid ratings
      expect(convertToEffectivenessRating('SomewhatEffective')).toBe('Not_Effective');
      expect(convertToEffectivenessRating(undefined)).toBe('Not_Effective');
    });
  });
  
  describe('Type Structure Tests', () => {
    it('should validate Document type structure', () => {
      const doc: Document = {
        id: '123',
        title: 'Test Document',
        category: 'SOP',
        status: 'Draft',
        file_name: 'test.pdf',
        file_type: 'application/pdf',
        file_size: 1000,
        version: 1,
        created_by: 'user1',
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
        checkout_status: 'Available'
      };
      
      // Type should be valid
      expect(doc.id).toBe('123');
      expect(doc.status).toBe('Draft');
      expect(doc.checkout_status).toBe('Available');
    });
    
    it('should validate CAPA type structure', () => {
      const capa: CAPA = {
        id: '123',
        title: 'Test CAPA',
        description: 'Test description',
        status: 'Open',
        priority: 'High',
        createdAt: '2023-01-01',
        createdBy: 'user1',
        dueDate: '2023-02-01',
        assignedTo: 'user2',
        source: 'Audit',
        source_reference: 'AUDIT-2023-001'
      };
      
      // Type should be valid
      expect(capa.id).toBe('123');
      expect(capa.status).toBe('Open');
      expect(capa.source).toBe('Audit');
      expect(capa.source_reference).toBe('AUDIT-2023-001');
    });
  });
});
