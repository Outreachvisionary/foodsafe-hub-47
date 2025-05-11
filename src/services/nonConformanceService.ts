import { NonConformance, NCActivity, NCAttachment, NCStats } from '@/types/non-conformance';
import { adaptNCForAPI, adaptAPIToNC } from '@/utils/nonConformanceAdapters';
import { toast } from 'sonner';

// Mock data for demonstration purposes
const mockNonConformances: NonConformance[] = [
  {
    id: 'nc-001',
    title: 'Foreign material in product',
    description: 'Metal fragments found in product batch',
    status: 'On Hold',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    reported_date: new Date().toISOString(),
    created_by: 'John Doe',
    item_name: 'Product Batch 12345',
    item_category: 'Finished Product',
    reason_category: 'Foreign Material',
    location: 'Production Line 2',
    department: 'Production',
    quantity: 100,
    quantity_on_hold: 100,
    units: 'kg'
  },
  // Add more mock data items if needed
];

// Get all non-conformances
export const getAllNonConformances = async () => {
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockNonConformances };
  } catch (error) {
    console.error('Error fetching non-conformances:', error);
    throw error;
  }
};

// Get non-conformance by ID
export const getNonConformanceById = async (id: string): Promise<NonConformance> => {
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const foundNC = mockNonConformances.find(nc => nc.id === id);
    if (!foundNC) {
      throw new Error(`Non-conformance with ID ${id} not found`);
    }
    return foundNC;
  } catch (error) {
    console.error('Error fetching non-conformance:', error);
    throw error;
  }
};

// Create non-conformance
export const createNonConformance = async (data: Partial<NonConformance>): Promise<NonConformance> => {
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const newNC: NonConformance = {
      ...data,
      id: `nc-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reported_date: data.reported_date || new Date().toISOString(),
      created_by: data.created_by || 'Current User',
      status: data.status || 'On Hold'
    } as NonConformance;
    
    return newNC;
  } catch (error) {
    console.error('Error creating non-conformance:', error);
    throw error;
  }
};

// Update non-conformance - updated signature to match calls (2 params)
export const updateNonConformance = async (id: string, data: Partial<NonConformance>): Promise<NonConformance> => {
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedNC: NonConformance = {
      ...mockNonConformances.find(nc => nc.id === id) as NonConformance,
      ...data,
      updated_at: new Date().toISOString()
    };
    
    return updatedNC;
  } catch (error) {
    console.error('Error updating non-conformance:', error);
    throw error;
  }
};

// Delete non-conformance
export const deleteNonConformance = async (id: string): Promise<void> => {
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real implementation, this would remove the item from the database
    console.log(`Deleting non-conformance with ID: ${id}`);
  } catch (error) {
    console.error('Error deleting non-conformance:', error);
    throw error;
  }
};

// Fetch NC activities
export const fetchNCActivities = async (nonConformanceId: string): Promise<NCActivity[]> => {
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock activity data
    const activities: NCActivity[] = [
      {
        id: `act-${Date.now()}-1`,
        non_conformance_id: nonConformanceId,
        action: 'Status changed from Draft to On Hold',
        performed_by: 'Quality Inspector',
        performed_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        previous_status: 'Draft',
        new_status: 'On Hold'
      },
      {
        id: `act-${Date.now()}-2`,
        non_conformance_id: nonConformanceId,
        action: 'Updated quantity on hold from 0 to 100',
        performed_by: 'Warehouse Manager',
        performed_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        comments: 'Material segregated and labeled'
      }
    ];
    
    return activities;
  } catch (error) {
    console.error('Error fetching NC activities:', error);
    throw error;
  }
};

// Fetch NC attachments
export const fetchNCAttachments = async (nonConformanceId: string): Promise<NCAttachment[]> => {
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock attachment data
    const attachments: NCAttachment[] = [
      {
        id: `att-${Date.now()}-1`,
        non_conformance_id: nonConformanceId,
        file_name: 'incident_report.pdf',
        file_path: `/attachments/${nonConformanceId}/incident_report.pdf`,
        file_type: 'application/pdf',
        file_size: 1024 * 1024 * 2.5, // 2.5 MB
        description: 'Initial incident report',
        uploaded_at: new Date(Date.now() - 86400000).toISOString(),
        uploaded_by: 'Quality Inspector'
      }
    ];
    
    return attachments;
  } catch (error) {
    console.error('Error fetching NC attachments:', error);
    throw error;
  }
};

// Upload NC attachment - updated signature to match calls (3 params)
export const uploadNCAttachment = async (
  nonConformanceId: string,
  file: File,
  description?: string
): Promise<NCAttachment> => {
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful upload
    const newAttachment: NCAttachment = {
      id: `att-${Date.now()}`,
      non_conformance_id: nonConformanceId,
      file_name: file.name,
      file_path: `/attachments/${nonConformanceId}/${file.name}`,
      file_type: file.type,
      file_size: file.size,
      description: description || '',
      uploaded_at: new Date().toISOString(),
      uploaded_by: 'Current User'
    };
    
    return newAttachment;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
};

// Fetch NC stats for dashboard
export const fetchNCStats = async (): Promise<NCStats> => {
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock stats data
    const stats: NCStats = {
      total: 42,
      byStatus: {
        'On Hold': 12,
        'Under Review': 8,
        'In Progress': 15,
        'Closed': 7
      },
      byCategory: {
        'Finished Product': 18,
        'Raw Material': 12,
        'Equipment': 8,
        'Packaging': 4
      },
      byReasonCategory: {
        'Quality Issue': 15,
        'Foreign Material': 10,
        'Process Deviation': 9,
        'Damaged': 5,
        'Other': 3
      },
      byRiskLevel: {
        'High': 7,
        'Medium': 20,
        'Low': 15
      },
      overdue: 5,
      pendingReview: 8,
      recentlyResolved: 3,
      totalQuantityOnHold: 1250
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching NC stats:', error);
    throw error;
  }
};
