
import { DocumentStatus } from '@/types/document';

export const getStatusColor = (status: DocumentStatus): string => {
  switch (status) {
    case DocumentStatus.Draft:
      return 'bg-gray-100 text-gray-800';
    case DocumentStatus.Pending_Approval:
      return 'bg-yellow-100 text-yellow-800';
    case DocumentStatus.Approved:
      return 'bg-green-100 text-green-800';
    case DocumentStatus.Rejected:
      return 'bg-red-100 text-red-800';
    case DocumentStatus.Archived:
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getDocumentIcon = (fileType: string): string => {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('doc')) return '📝';
  if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
  if (fileType.includes('image')) return '🖼️';
  return '📄';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getDocumentAge = (createdAt: string): string => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};
