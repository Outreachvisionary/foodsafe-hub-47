
import { CAPA, CAPAFilter, CAPAStats } from '@/types/capa';

// Mock data for testing
const mockCAPAs: CAPA[] = [
  {
    id: '1',
    title: 'HACCP Critical Limit Deviation',
    description: 'Critical limit deviation in cooking step of HACCP plan',
    source: 'haccp',
    sourceId: 'haccp-123',
    priority: 'critical',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'John Smith',
    department: 'Quality',
    createdBy: 'System',
    createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date().toISOString(),
    effectivenessVerified: false,
    isFsma204Compliant: true,
    correctiveAction: 'Investigated root cause and recalibrated temperature monitoring equipment.',
    preventiveAction: 'Implemented more frequent calibration checks for all temperature monitoring devices.'
  },
  {
    id: '2',
    title: 'Foreign Material Complaint',
    description: 'Customer reported finding metal fragment in product',
    source: 'complaint',
    sourceId: 'complaint-456',
    priority: 'high',
    status: 'open',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Jane Doe',
    department: 'Production',
    createdBy: 'Admin',
    createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date().toISOString(),
    effectivenessVerified: false,
    isFsma204Compliant: true
  },
  {
    id: '3',
    title: 'Audit Finding: Documentation',
    description: 'Internal audit identified gaps in change control documentation',
    source: 'audit',
    sourceId: 'audit-789',
    priority: 'medium',
    status: 'closed',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Mark Wilson',
    department: 'Documentation',
    createdBy: 'Admin',
    createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    completionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    effectivenessVerified: true,
    effectivenessRating: 'excellent',
    rootCause: 'Change control SOP not properly communicated to new employees',
    correctiveAction: 'Updated all affected documents with proper change control details',
    preventiveAction: 'Enhanced new employee training on document control',
    isFsma204Compliant: true
  }
];

export async function createCAPA(capaData: Omit<CAPA, 'id'>): Promise<CAPA> {
  // In a real implementation, this would call an API or database
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a mock ID
      const newId = `capa-${Date.now()}`;
      
      // Create the CAPA object
      const newCAPA: CAPA = {
        ...capaData,
        id: newId,
        createdDate: capaData.createdDate || new Date().toISOString(),
        lastUpdated: capaData.lastUpdated || new Date().toISOString()
      };
      
      // Add to mock data
      mockCAPAs.push(newCAPA);
      
      resolve(newCAPA);
    }, 500);
  });
}

export async function fetchCAPAs(filter?: CAPAFilter): Promise<CAPA[]> {
  // In a real implementation, this would call an API with filter parameters
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredCAPAs = [...mockCAPAs];
      
      if (filter) {
        // Apply status filter
        if (filter.status && filter.status.length > 0) {
          filteredCAPAs = filteredCAPAs.filter(capa => 
            filter.status!.includes(capa.status)
          );
        }
        
        // Apply priority filter
        if (filter.priority && filter.priority.length > 0) {
          filteredCAPAs = filteredCAPAs.filter(capa => 
            filter.priority!.includes(capa.priority)
          );
        }
        
        // Apply source filter
        if (filter.source && filter.source.length > 0) {
          filteredCAPAs = filteredCAPAs.filter(capa => 
            filter.source!.includes(capa.source)
          );
        }
        
        // Apply date range filter
        if (filter.dateRange) {
          const start = new Date(filter.dateRange.start);
          const end = new Date(filter.dateRange.end);
          
          filteredCAPAs = filteredCAPAs.filter(capa => {
            const dueDate = new Date(capa.dueDate);
            return dueDate >= start && dueDate <= end;
          });
        }
        
        // Apply search term filter
        if (filter.searchTerm) {
          const searchTermLower = filter.searchTerm.toLowerCase();
          filteredCAPAs = filteredCAPAs.filter(capa => 
            capa.title.toLowerCase().includes(searchTermLower) || 
            capa.description.toLowerCase().includes(searchTermLower)
          );
        }
      }
      
      resolve(filteredCAPAs);
    }, 500);
  });
}

export async function fetchCAPAById(id: string): Promise<CAPA> {
  // In a real implementation, this would call an API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const capa = mockCAPAs.find(capa => capa.id === id);
      
      if (capa) {
        resolve(capa);
      } else {
        reject(new Error(`CAPA with ID ${id} not found`));
      }
    }, 500);
  });
}

export async function updateCAPA(id: string, updatedData: Partial<CAPA>): Promise<CAPA> {
  // In a real implementation, this would call an API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockCAPAs.findIndex(capa => capa.id === id);
      
      if (index !== -1) {
        // Update the CAPA
        mockCAPAs[index] = {
          ...mockCAPAs[index],
          ...updatedData,
          lastUpdated: new Date().toISOString()
        };
        
        resolve(mockCAPAs[index]);
      } else {
        reject(new Error(`CAPA with ID ${id} not found`));
      }
    }, 500);
  });
}

export async function getCAPAStats(): Promise<CAPAStats> {
  // In a real implementation, this would fetch from an API or calculate from database
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate counts from mock data
      const openCount = mockCAPAs.filter(capa => capa.status === 'open').length;
      const inProgressCount = mockCAPAs.filter(capa => capa.status === 'in-progress').length;
      const closedCount = mockCAPAs.filter(capa => capa.status === 'closed').length;
      const verifiedCount = mockCAPAs.filter(capa => capa.status === 'verified').length;
      const pendingVerificationCount = mockCAPAs.filter(capa => capa.status === 'pending-verification').length;
      
      // Calculate overdue CAPAs
      const now = new Date();
      const overdueCount = mockCAPAs.filter(capa => 
        capa.status !== 'closed' && 
        capa.status !== 'verified' && 
        new Date(capa.dueDate) < now
      ).length;
      
      // Count by status
      const byStatus = [
        { name: 'Open', value: openCount },
        { name: 'In Progress', value: inProgressCount },
        { name: 'Closed', value: closedCount },
        { name: 'Verified', value: verifiedCount },
        { name: 'Pending Verification', value: pendingVerificationCount }
      ];
      
      // Count by priority
      const criticalCount = mockCAPAs.filter(capa => capa.priority === 'critical').length;
      const highCount = mockCAPAs.filter(capa => capa.priority === 'high').length;
      const mediumCount = mockCAPAs.filter(capa => capa.priority === 'medium').length;
      const lowCount = mockCAPAs.filter(capa => capa.priority === 'low').length;
      
      const byPriority = [
        { name: 'Critical', value: criticalCount },
        { name: 'High', value: highCount },
        { name: 'Medium', value: mediumCount },
        { name: 'Low', value: lowCount }
      ];
      
      // Count by source
      const auditCount = mockCAPAs.filter(capa => capa.source === 'audit').length;
      const complaintCount = mockCAPAs.filter(capa => capa.source === 'complaint').length;
      const hacppCount = mockCAPAs.filter(capa => capa.source === 'haccp').length;
      const otherCount = mockCAPAs.filter(capa => !['audit', 'complaint', 'haccp'].includes(capa.source)).length;
      
      const bySource = [
        { name: 'Audit', value: auditCount },
        { name: 'Complaint', value: complaintCount },
        { name: 'HACCP', value: hacppCount },
        { name: 'Other', value: otherCount }
      ];
      
      // FSMA 204 compliance rate
      const fsma204CompliantCount = mockCAPAs.filter(capa => capa.isFsma204Compliant).length;
      const fsma204ComplianceRate = (fsma204CompliantCount / mockCAPAs.length) * 100;
      
      // Effectiveness stats
      const effectiveCount = mockCAPAs.filter(capa => 
        capa.effectivenessRating === 'excellent' || capa.effectivenessRating === 'good'
      ).length;
      
      const partiallyEffectiveCount = mockCAPAs.filter(capa => 
        capa.effectivenessRating === 'adequate'
      ).length;
      
      const ineffectiveCount = mockCAPAs.filter(capa => 
        capa.effectivenessRating === 'poor' || capa.effectivenessRating === 'ineffective'
      ).length;
      
      resolve({
        total: mockCAPAs.length,
        openCount,
        inProgressCount,
        closedCount,
        verifiedCount,
        pendingVerificationCount,
        overdueCount,
        byStatus,
        byPriority,
        bySource,
        fsma204ComplianceRate,
        effectivenessStats: {
          effective: effectiveCount,
          partiallyEffective: partiallyEffectiveCount,
          ineffective: ineffectiveCount
        }
      });
    }, 500);
  });
}
