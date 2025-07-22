
import { documentService } from './documentService';
import * as nonConformanceService from './nonConformanceService';
import * as complaintService from './complaintService';
import * as capaService from './capaService';
import auditService from './realAuditService';
import supplierService from './supplierService';
import trainingService from './trainingService';

// Export the document service
export { documentService };

// Re-export for backward compatibility
export const {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument
} = documentService;

// Export non-conformance service
export { nonConformanceService };

// Export complaint service
export { complaintService };

// Export CAPA service
export { capaService };

// Export audit service (real implementation)
export { auditService };

// Export supplier service
export { supplierService };

// Export training service
export { trainingService };
