
import { CAPAActivity, CAPAStatus } from '@/types/capa';

// Mock function to record a CAPA activity
export const recordCAPAActivity = async (params: {
  capa_id: string;
  action_type: string;
  action_description: string;
  performed_by: string;
  old_status?: string;
  new_status?: string;
  metadata?: Record<string, any>;
}): Promise<void> => {
  try {
    console.log('Recording CAPA activity:', params);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('Error recording CAPA activity:', error);
    throw error;
  }
};

// Mock function to get CAPA activities
export const getCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return [
      {
        id: '1',
        capaId: capaId,
        action_type: 'Status_Change',
        action_description: 'CAPA status updated',
        performed_at: new Date().toISOString(),
        performed_by: 'John Doe',
        old_status: 'Open',
        new_status: 'In_Progress',
        metadata: { comments: 'Starting work on this CAPA' }
      },
      {
        id: '2',
        capaId: capaId,
        action_type: 'Update',
        action_description: 'Root cause analysis added',
        performed_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        performed_by: 'Jane Smith',
        metadata: { comments: 'Completed root cause analysis' }
      },
      {
        id: '3',
        capaId: capaId,
        action_type: 'Comment',
        action_description: 'Added comment',
        performed_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        performed_by: 'Michael Johnson',
        metadata: { comments: 'Need more information about this issue' }
      }
    ];
  } catch (error) {
    console.error('Error fetching CAPA activities:', error);
    throw error;
  }
};

// Mock function for mapping statuses
export const mapInternalStatusToDb = (status: CAPAStatus): string => status;
export const mapDbStatusToInternal = (status: string): CAPAStatus => status as CAPAStatus;
