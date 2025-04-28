
import { CAPAActivity } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';

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
    capaId: activityData.capa_id,
    actionType: activityData.action_type,
    actionDescription: activityData.action_description,
    performedAt: new Date().toISOString(),
    performedBy: activityData.performed_by,
    oldStatus: activityData.old_status ? convertToCAPAStatus(activityData.old_status) : undefined,
    newStatus: activityData.new_status ? convertToCAPAStatus(activityData.new_status) : undefined,
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
      capaId: capaId,
      actionType: 'created',
      actionDescription: 'CAPA was created',
      performedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      performedBy: 'John Doe',
      oldStatus: undefined,
      newStatus: CAPAStatus.Open
    },
    {
      id: '2',
      capaId: capaId,
      actionType: 'status_change',
      actionDescription: 'Status updated from Open to In Progress',
      performedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      performedBy: 'Jane Smith',
      oldStatus: CAPAStatus.Open,
      newStatus: CAPAStatus.InProgress
    },
    {
      id: '3',
      capaId: capaId,
      actionType: 'comment',
      actionDescription: 'Added root cause analysis',
      performedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      performedBy: 'Jane Smith',
      metadata: {
        comments: 'Completed root cause analysis and identified key issues.'
      }
    },
    {
      id: '4',
      capaId: capaId,
      actionType: 'document_linked',
      actionDescription: 'Associated document with CAPA',
      performedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      performedBy: 'John Doe',
      metadata: {
        documentId: 'doc-123',
        documentName: 'Procedure Update'
      }
    }
  ];
};

// Helper function to convert string status to CAPAStatus enum
const convertToCAPAStatus = (status: string): CAPAStatus => {
  switch(status?.toLowerCase().replace(/ /g, '_')) {
    case 'open': return CAPAStatus.Open;
    case 'in_progress': return CAPAStatus.InProgress;
    case 'under_review': return CAPAStatus.UnderReview;
    case 'completed': return CAPAStatus.Completed;
    case 'closed': return CAPAStatus.Closed;
    case 'rejected': return CAPAStatus.Rejected;
    case 'on_hold': return CAPAStatus.OnHold;
    case 'overdue': return CAPAStatus.Overdue;
    case 'pending_verification': return CAPAStatus.PendingVerification;
    case 'verified': return CAPAStatus.Verified;
    default: return CAPAStatus.Open;
  }
};
