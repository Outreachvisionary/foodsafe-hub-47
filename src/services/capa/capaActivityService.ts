
import { CAPAActivity } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';
import { convertToCAPAStatus } from '@/utils/typeAdapters';

// Mock function to record CAPA activity
export const recordCAPAActivity = async (activityData: {
  capa_id: string;
  action_type: string;
  action_description: string;
  performed_by: string;
  old_status?: string;
  new_status?: string;
  metadata?: Record<string, any>;
}) => {
  // In a real implementation, this would insert a record into the database
  const activity: CAPAActivity = {
    id: `activity-${Date.now()}`,
    capa_id: activityData.capa_id,
    actionType: activityData.action_type,
    actionDescription: activityData.action_description,
    performed_at: new Date().toISOString(),
    performed_by: activityData.performed_by,
    old_status: activityData.old_status ? convertToCAPAStatus(activityData.old_status) : undefined,
    new_status: activityData.new_status ? convertToCAPAStatus(activityData.new_status) : undefined,
    metadata: activityData.metadata
  };
  
  // Simulate successful insertion
  return Promise.resolve(activity);
};

// Mock function to get CAPA activities
export const getCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Return mock data for CAPA activities
  return [
    {
      id: '1',
      capa_id: capaId,
      action_type: 'created',
      action_description: 'CAPA was created',
      performed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      performed_by: 'John Doe',
      old_status: undefined,
      new_status: CAPAStatus.Open
    },
    {
      id: '2',
      capa_id: capaId,
      action_type: 'status_change',
      action_description: 'Status updated from Open to In Progress',
      performed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      performed_by: 'Jane Smith',
      old_status: CAPAStatus.Open,
      new_status: CAPAStatus.InProgress
    },
    {
      id: '3',
      capa_id: capaId,
      action_type: 'comment',
      action_description: 'Added root cause analysis',
      performed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      performed_by: 'Jane Smith',
      metadata: {
        comments: 'Completed root cause analysis and identified key issues.'
      }
    },
    {
      id: '4',
      capa_id: capaId,
      action_type: 'document_linked',
      action_description: 'Associated document with CAPA',
      performed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      performed_by: 'John Doe',
      metadata: {
        documentId: 'doc-123',
        documentName: 'Procedure Update'
      }
    }
  ];
};
