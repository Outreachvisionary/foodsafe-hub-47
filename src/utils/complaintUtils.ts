
import { ComplaintStatus } from '@/types/complaint';

export const priorityLevels = ['Low', 'Medium', 'High', 'Critical'] as const;
export type Priority = typeof priorityLevels[number];

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'Low':
      return 'text-green-600 bg-green-100';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'High':
      return 'text-orange-600 bg-orange-100';
    case 'Critical':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getStatusColor = (status: ComplaintStatus): string => {
  switch (status) {
    case ComplaintStatus.New:
      return 'text-blue-600 bg-blue-100';
    case ComplaintStatus.Under_Investigation:
      return 'text-orange-600 bg-orange-100';
    case ComplaintStatus.Resolved:
      return 'text-green-600 bg-green-100';
    case ComplaintStatus.Closed:
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Add the missing function that components are trying to import
export const getComplaintStatusColor = (status: ComplaintStatus): { bg: string; text: string; border: string } => {
  switch (status) {
    case ComplaintStatus.New:
      return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
    case ComplaintStatus.Under_Investigation:
      return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' };
    case ComplaintStatus.Resolved:
      return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
    case ComplaintStatus.Closed:
      return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
  }
};

export const formatComplaintId = (id: string): string => {
  return `COMP-${id.substring(0, 8).toUpperCase()}`;
};

export const calculateDaysOpen = (reportedDate: string): number => {
  const reported = new Date(reportedDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - reported.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getComplaintsByStatus = (complaints: any[], status: ComplaintStatus) => {
  return complaints.filter(complaint => complaint.status === status);
};

export const sortComplaintsByPriority = (complaints: any[]) => {
  const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
  return complaints.sort((a, b) => (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[a.priority as keyof typeof priorityOrder] || 0));
};

export const getOverdueComplaints = (complaints: any[], dueDays: number = 30) => {
  return complaints.filter(complaint => {
    if (complaint.status === ComplaintStatus.Closed || complaint.status === ComplaintStatus.Resolved) return false;
    return calculateDaysOpen(complaint.reported_date) > dueDays;
  });
};

export const mapComplaintStatus = (status: string): ComplaintStatus => {
  const statusMap: Record<string, ComplaintStatus> = {
    'New': ComplaintStatus.New,
    'Under Investigation': ComplaintStatus.Under_Investigation, 
    'Under_Investigation': ComplaintStatus.Under_Investigation,
    'Resolved': ComplaintStatus.Resolved,
    'Closed': ComplaintStatus.Closed
  };
  
  return statusMap[status] || ComplaintStatus.New;
};
